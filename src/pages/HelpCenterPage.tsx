import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  Search, 
  MessageCircle, 
  FileText, 
  Shield, 
  CreditCard, 
  Globe,
  HelpCircle,
  Mail,
  Phone,
  Clock
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { useToast } from '@/hooks/use-toast'

export function HelpCenterPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })

  const faqCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        {
          question: 'How do I analyze my first contract?',
          answer: 'Simply go to the home page, upload your contract file (.txt or .md) or paste the text directly. Select your contract language and jurisdiction, then click "Analyze Contract". Our AI will provide a comprehensive risk assessment within minutes.'
        },
        {
          question: 'What file formats are supported?',
          answer: 'Currently, we support plain text files (.txt) and Markdown files (.md). We\'re working on adding support for PDF and Word documents in future updates.'
        },
        {
          question: 'Do I need to create an account to use the service?',
          answer: 'You can browse the website and explore features without an account. However, to analyze contracts, generate documents, or access your dashboard, you\'ll need to sign in with your email address.'
        },
        {
          question: 'How accurate is the AI analysis?',
          answer: 'Our AI is trained on thousands of legal contracts and provides highly accurate risk assessments. However, our analysis is for informational purposes only and should not replace consultation with qualified legal professionals for important matters.'
        }
      ]
    },
    {
      id: 'pricing-billing',
      title: 'Pricing & Billing',
      icon: <CreditCard className="h-5 w-5" />,
      questions: [
        {
          question: 'What are the different pricing plans?',
          answer: 'We offer four plans: Basic ($5/month) for unlimited analysis, AI+ ($15/month) with 5 contract generations, Team ($40/month) with collaboration features, and Unlimited ($100/month) with unlimited generation. We also offer pay-per-use at $1 per document.'
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your subscription at any time through your account settings. Your access will continue until the end of your current billing period, and you can download your documents for 30 days after cancellation.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and select cryptocurrencies. All payments are processed securely through Stripe.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee for new subscriptions. If you\'re not satisfied with our service, contact support within 30 days for a full refund.'
        },
        {
          question: 'How does pay-per-use pricing work?',
          answer: 'With pay-per-use, you pay $1 for each document analysis without a monthly commitment. This is perfect for occasional users who don\'t need regular contract analysis.'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features & Usage',
      icon: <FileText className="h-5 w-5" />,
      questions: [
        {
          question: 'What languages are supported?',
          answer: 'We support 11 languages: English, Spanish, Portuguese (Brazil & Portugal), French, German, Russian, Japanese, Chinese (Simplified), Arabic, Hindi, and Italian. Both the interface and contract analysis are available in these languages.'
        },
        {
          question: 'Which legal jurisdictions do you cover?',
          answer: 'We provide jurisdiction-specific analysis for: United States, Mexico, Brazil, Russia, Japan, China, UAE, Germany, Europe, Canada, UK, Spain, France, Portugal, and India. Our AI understands the legal context and requirements for each jurisdiction.'
        },
        {
          question: 'Can I collaborate with my team on contracts?',
          answer: 'Yes! Team and Unlimited plans include collaboration features. You can invite team members via email or link, assign roles (viewer, commenter, editor), and work together on contract analysis and generation.'
        },
        {
          question: 'How do I export my analyzed contracts?',
          answer: 'AI+ and higher plans include export functionality. You can download contracts as PDF or Word documents with track changes, making it easy to share with colleagues or implement recommended changes.'
        },
        {
          question: 'What is the signature tool?',
          answer: 'Our signature tool allows you to add digital signatures to contracts. It costs $1 per document for Basic users, while Premium plan users get it free. You can assign roles (signer, sender, witness) and track document status.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <Shield className="h-5 w-5" />,
      questions: [
        {
          question: 'How secure is my contract data?',
          answer: 'We implement bank-level security with end-to-end encryption, SOC2 Type II compliance, and ISO 27001 certification. Your contracts are encrypted in transit and at rest, with strict access controls.'
        },
        {
          question: 'Do you store my contracts permanently?',
          answer: 'We store your contracts securely for the duration of your subscription plus 30 days. You can delete contracts anytime from your dashboard. We never share your contract content with third parties.'
        },
        {
          question: 'Is the service GDPR compliant?',
          answer: 'Yes, we are fully GDPR compliant. You have the right to access, correct, delete, or export your data. Contact our privacy team at privacy@legalai.com for any data protection requests.'
        },
        {
          question: 'Who can access my contracts?',
          answer: 'Only you and team members you explicitly invite can access your contracts. Our staff cannot view your contract content except in rare cases where you specifically request technical support.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Support',
      icon: <Globe className="h-5 w-5" />,
      questions: [
        {
          question: 'The website is not loading properly. What should I do?',
          answer: 'Try refreshing the page, clearing your browser cache, or using a different browser. If the issue persists, check our status page or contact support with details about your browser and operating system.'
        },
        {
          question: 'My contract analysis is taking too long. Is this normal?',
          answer: 'Most analyses complete within 2-5 minutes. Longer documents or complex contracts may take up to 10 minutes. If your analysis is stuck for more than 15 minutes, please contact support.'
        },
        {
          question: 'Can I use the service on mobile devices?',
          answer: 'Yes! Our platform is fully responsive and optimized for mobile devices. You can analyze contracts, access your dashboard, and manage your account from any smartphone or tablet.'
        },
        {
          question: 'Do you have an API for developers?',
          answer: 'We\'re currently developing our API for enterprise customers. If you\'re interested in integrating our contract analysis into your application, please contact our sales team.'
        }
      ]
    }
  ]

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate form submission
    toast({
      title: "Support Ticket Submitted",
      description: "We'll get back to you within 24 hours. Check your email for updates.",
    })
    
    // Reset form
    setSupportForm({
      name: '',
      email: '',
      subject: '',
      message: '',
      category: 'general'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find answers to common questions, get support, and learn how to make the most of LegalAI
            </p>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm text-gray-600 mb-4">Get help via email</p>
              <p className="text-sm font-medium">support@legalai.com</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Phone className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Phone Support</h3>
              <p className="text-sm text-gray-600 mb-4">Speak with our team</p>
              <p className="text-sm font-medium">+1 (555) 123-4567</p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-sm text-gray-600 mb-4">Average response</p>
              <p className="text-sm font-medium">{"< 24 hours"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="space-y-6">
            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Categories */}
            <div className="space-y-6">
              {filteredFAQs.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      {category.icon}
                      <span>{category.title}</span>
                      <Badge variant="secondary">{category.questions.length}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <AccordionItem key={index} value={`${category.id}-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>

            {searchTerm && filteredFAQs.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    Try different keywords or browse our categories above
                  </p>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Submit a Support Ticket</span>
                </CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Send us a message and we'll help you out.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSupportSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input
                        type="text"
                        value={supportForm.name}
                        onChange={(e) => setSupportForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input
                        type="email"
                        value={supportForm.email}
                        onChange={(e) => setSupportForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category</label>
                    <select
                      value={supportForm.category}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="general">General Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="feature">Feature Request</option>
                      <option value="bug">Bug Report</option>
                      <option value="security">Security Concern</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      type="text"
                      value={supportForm.subject}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      value={supportForm.message}
                      onChange={(e) => setSupportForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Please provide as much detail as possible about your question or issue..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">Before submitting:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Check our FAQ above for quick answers</li>
                      <li>• Include your browser and operating system if reporting a technical issue</li>
                      <li>• Attach screenshots if they help explain the problem</li>
                      <li>• We typically respond within 24 hours</li>
                    </ul>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Submit Support Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}