import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  FileText, 
  Globe, 
  DollarSign, 
  Users, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Download,
  Eye,
  Share2,
  PenTool
} from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { getJurisdictionByLanguage } from '@/lib/i18n'
import { blink } from '@/blink/client'
import { CONTRACT_TEMPLATES } from '@/data/contractTemplates'
import { JURISDICTIONS, PAYMENT_PLANS } from '@/types/contractGeneration'
import type { ContractTemplate, GeneratedContract, ContractField } from '@/types/contractGeneration'
import { ContractForm } from '@/components/contract/ContractForm'
import { ContractPreview } from '@/components/contract/ContractPreview'
import { PaymentModal } from '@/components/contract/PaymentModal'
import { CollaborationPanel } from '@/components/contract/CollaborationPanel'
import { LegalDisclaimerModal } from '@/components/contract/LegalDisclaimerModal'

export function ContractGenerationPage() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template')
  
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null)
  const [currentStep, setCurrentStep] = useState<'select' | 'form' | 'preview' | 'payment' | 'complete'>('select')
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(() => getJurisdictionByLanguage(language))
  const [generatedContract, setGeneratedContract] = useState<GeneratedContract | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    if (templateId) {
      const template = CONTRACT_TEMPLATES.find(t => t.id === templateId)
      if (template) {
        setSelectedTemplate(template)
        setCurrentStep('form')
      }
    }
  }, [templateId])

  const filteredTemplates = CONTRACT_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'legal', label: 'Legal Documents' },
    { value: 'employment', label: 'Employment' },
    { value: 'business', label: 'Business Agreements' },
    { value: 'intellectual-property', label: 'Intellectual Property' },
    { value: 'investment', label: 'Investment & Funding' }
  ]

  const handleTemplateSelect = (template: ContractTemplate) => {
    if (!hasAcceptedTerms) {
      setShowDisclaimerModal(true)
      setSelectedTemplate(template)
      return
    }
    setSelectedTemplate(template)
    setCurrentStep('form')
  }

  const handleFormSubmit = async (data: Record<string, any>) => {
    setFormData(data)
    setIsGenerating(true)
    
    try {
      // Generate contract using AI
      const contractContent = await generateContractContent(selectedTemplate!, data, selectedJurisdiction, language)
      
      const contract: GeneratedContract = {
        id: `contract_${Date.now()}`,
        templateId: selectedTemplate!.id,
        title: `${selectedTemplate!.name} - ${data.company_name || data.disclosing_party || 'Contract'}`,
        content: contractContent,
        jurisdiction: selectedJurisdiction,
        language,
        formData: data,
        generatedAt: new Date().toISOString(),
        userId: user?.id || 'demo_user',
        status: 'generated',
        pageCount: selectedTemplate!.estimatedPages,
        price: selectedTemplate!.estimatedPages * 0.80,
        riskSummary: await generateRiskSummary(selectedTemplate!, data, selectedJurisdiction)
      }
      
      setGeneratedContract(contract)
      setCurrentStep('preview')
    } catch (error) {
      console.error('Error generating contract:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const generateContractContent = async (template: ContractTemplate, data: Record<string, any>, jurisdiction: string, language: string) => {
    // Get jurisdiction-specific requirements
    const jurisdictionInfo = JURISDICTIONS.find(j => j.code === jurisdiction)
    const jurisdictionRequirements = jurisdictionInfo?.specificRequirements || []
    
    // Use Blink AI to generate contract content
    const prompt = `Generate a ${template.name} contract with the following details:
    
Template: ${template.name}
Description: ${template.description}
Jurisdiction: ${jurisdiction} (${jurisdictionInfo?.name})
Legal System: ${jurisdictionInfo?.legalSystem}
Language: ${language}
Currency: ${jurisdictionInfo?.currency}
Form Data: ${JSON.stringify(data, null, 2)}

JURISDICTION-SPECIFIC REQUIREMENTS:
${jurisdictionRequirements.map(req => `- ${req}`).join('\n')}

Please create a comprehensive, legally sound contract that includes:
1. Proper legal formatting and structure for ${jurisdictionInfo?.name}
2. All necessary clauses for this type of contract
3. Jurisdiction-specific requirements and compliance (${jurisdictionRequirements.join(', ')})
4. Professional language appropriate for ${language}
5. Clear terms and conditions following ${jurisdictionInfo?.legalSystem} principles
6. Proper signatures section with jurisdiction-appropriate witnessing requirements
7. Currency amounts in ${jurisdictionInfo?.currency}
8. Governing law clause specifying ${jurisdictionInfo?.name}
9. Dispute resolution mechanisms appropriate for ${jurisdictionInfo?.legalSystem}

IMPORTANT: Ensure the contract complies with local laws and regulations in ${jurisdictionInfo?.name}. Include specific clauses that address common legal requirements in this jurisdiction.

The contract should be approximately ${template.estimatedPages} pages long and follow best practices for ${template.category} contracts in ${jurisdictionInfo?.name}.`

    const { text } = await blink.ai.generateText({
      prompt,
      model: 'gpt-4o-mini',
      maxTokens: 4000
    })

    return text
  }

  const generateRiskSummary = async (template: ContractTemplate, data: Record<string, any>, jurisdiction: string) => {
    const jurisdictionInfo = JURISDICTIONS.find(j => j.code === jurisdiction)
    const jurisdictionRequirements = jurisdictionInfo?.specificRequirements || []
    
    const prompt = `Generate a comprehensive risk summary for a ${template.name} contract in ${jurisdiction} (${jurisdictionInfo?.name}) jurisdiction. Include:
    
1. Purpose of the contract (2-3 sentences)
2. Common startup mistakes specific to ${jurisdictionInfo?.name} (3-4 bullet points)
3. Key clauses to review under ${jurisdictionInfo?.legalSystem} legal system (3-4 bullet points)
4. ${jurisdictionInfo?.name}-specific legal risks and compliance requirements (3-4 bullet points)
5. Currency and financial considerations for ${jurisdictionInfo?.currency}
6. Cross-border implications if applicable
7. SEO-optimized content with keywords: ${template.seoKeywords.join(', ')}
8. Legal disclaimer

JURISDICTION-SPECIFIC CONTEXT:
- Legal System: ${jurisdictionInfo?.legalSystem}
- Currency: ${jurisdictionInfo?.currency}
- Key Requirements: ${jurisdictionRequirements.join(', ')}

Make it exactly 400 words and include relevant legal considerations for startups operating in ${jurisdictionInfo?.name}.`

    const { text } = await blink.ai.generateText({
      prompt,
      model: 'gpt-4o-mini',
      maxTokens: 600
    })

    return {
      purpose: text.split('\n')[0] || '',
      commonMistakes: template.riskAreas,
      keyClausesToReview: template.riskAreas,
      jurisdictionRisks: jurisdictionRequirements.length > 0 ? jurisdictionRequirements : [`${jurisdictionInfo?.name} specific requirements apply`],
      seoContent: text,
      disclaimer: `All documents and analyses provided on this platform are for informational purposes only and are generated using AI technology. The output may not accurately reflect local laws, enforceability, or legal standards in ${jurisdictionInfo?.name} or your specific jurisdiction. Use of these documents is at the user's sole risk. Guiflo Inc. assumes no responsibility or legal liability for any use, damages, losses, or outcomes resulting from the use of these materials. We strongly recommend that all users consult with a qualified attorney licensed in ${jurisdictionInfo?.name} before using or executing any document.`
    }
  }

  const handlePurchase = async (paymentMethod: 'subscription' | 'pay-per-use') => {
    if (!generatedContract) return

    try {
      // Process payment through Stripe
      // For demo purposes, we'll simulate the payment
      console.log('Processing payment:', paymentMethod)
      
      // Update contract status
      const updatedContract = {
        ...generatedContract,
        status: 'purchased' as const
      }
      
      setGeneratedContract(updatedContract)
      setShowPaymentModal(false)
      setCurrentStep('complete')
      
      // Store in localStorage for demo
      localStorage.setItem(`generated_contract_${updatedContract.id}`, JSON.stringify(updatedContract))
      
    } catch (error) {
      console.error('Payment error:', error)
    }
  }

  const handleDownload = (format: 'pdf' | 'docx') => {
    if (!generatedContract || generatedContract.status !== 'purchased') {
      setShowPaymentModal(true)
      return
    }

    // Generate download
    const blob = new Blob([generatedContract.content], { 
      type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${generatedContract.title}.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to generate contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => blink.auth.login()} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                {currentStep !== 'select' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (currentStep === 'form') setCurrentStep('select')
                      else if (currentStep === 'preview') setCurrentStep('form')
                      else if (currentStep === 'payment') setCurrentStep('preview')
                    }}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                )}
                <h1 className="text-3xl font-bold">Contract Generator</h1>
              </div>
              <p className="text-gray-600">
                Generate professional legal contracts with AI assistance
              </p>
            </div>
            
            {/* Progress Indicator */}
            {currentStep !== 'select' && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    ['form', 'preview', 'payment', 'complete'].includes(currentStep) 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="text-sm">Form</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-200">
                  <div className={`h-full bg-blue-600 transition-all ${
                    ['preview', 'payment', 'complete'].includes(currentStep) ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    ['preview', 'payment', 'complete'].includes(currentStep) 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    2
                  </div>
                  <span className="text-sm">Preview</span>
                </div>
                <div className="w-8 h-0.5 bg-gray-200">
                  <div className={`h-full bg-blue-600 transition-all ${
                    ['complete'].includes(currentStep) ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === 'complete' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    3
                  </div>
                  <span className="text-sm">Complete</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Template Selection */}
        {currentStep === 'select' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search contract templates..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Templates Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{template.name}</CardTitle>
                        <CardDescription className="text-sm mb-3">
                          {template.description}
                        </CardDescription>
                      </div>
                      <Badge variant={template.complexity === 'simple' ? 'default' : 
                                   template.complexity === 'medium' ? 'secondary' : 'destructive'}>
                        {template.complexity}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{template.estimatedPages} pages</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>${(template.estimatedPages * 0.80).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium mb-1">Supported Jurisdictions:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.jurisdictions.slice(0, 3).map(jurisdictionCode => {
                            const jurisdiction = JURISDICTIONS.find(j => j.code === jurisdictionCode)
                            return jurisdiction ? (
                              <Badge key={jurisdictionCode} variant="outline" className="text-xs">
                                {jurisdiction.flag} {jurisdiction.name.split(' ')[0]}
                              </Badge>
                            ) : null
                          })}
                          {template.jurisdictions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.jurisdictions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-1">Risk Areas:</p>
                        <div className="flex flex-wrap gap-1">
                          {template.riskAreas.slice(0, 2).map(risk => (
                            <Badge key={risk} variant="outline" className="text-xs">
                              {risk}
                            </Badge>
                          ))}
                          {template.riskAreas.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.riskAreas.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTemplates.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No templates found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search or filter criteria
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Contract Form */}
        {currentStep === 'form' && selectedTemplate && (
          <ContractForm
            template={selectedTemplate}
            jurisdiction={selectedJurisdiction}
            onJurisdictionChange={setSelectedJurisdiction}
            onSubmit={handleFormSubmit}
            isGenerating={isGenerating}
          />
        )}

        {/* Contract Preview */}
        {currentStep === 'preview' && generatedContract && (
          <ContractPreview
            contract={generatedContract}
            onPurchase={() => setShowPaymentModal(true)}
            onDownload={handleDownload}
          />
        )}

        {/* Completion */}
        {currentStep === 'complete' && generatedContract && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Contract Generated Successfully!</CardTitle>
                <CardDescription>
                  Your {generatedContract.title} is ready for download
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Contract Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Template:</span>
                        <span>{selectedTemplate?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jurisdiction:</span>
                        <span>{JURISDICTIONS.find(j => j.code === generatedContract.jurisdiction)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span>{generatedContract.language.toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pages:</span>
                        <span>{generatedContract.pageCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Generated:</span>
                        <span>{new Date(generatedContract.generatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Download Options</h3>
                    <div className="space-y-3">
                      <Button 
                        onClick={() => handleDownload('pdf')}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button 
                        onClick={() => handleDownload('docx')}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Word (with Track Changes)
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep('select')
                        setSelectedTemplate(null)
                        setGeneratedContract(null)
                        setFormData({})
                      }}
                    >
                      Generate Another Contract
                    </Button>
                    
                    <div className="flex items-center space-x-3">
                      <Button 
                        onClick={() => navigate(`/signatures?contractId=${generatedContract.id}&action=sign`)}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        <PenTool className="h-4 w-4 mr-2" />
                        Add Signatures
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Collaborate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && generatedContract && (
          <PaymentModal
            contract={generatedContract}
            onClose={() => setShowPaymentModal(false)}
            onPurchase={handlePurchase}
          />
        )}

        {/* Legal Disclaimer Modal */}
        {showDisclaimerModal && (
          <LegalDisclaimerModal
            onClose={() => setShowDisclaimerModal(false)}
            onAccept={() => {
              setHasAcceptedTerms(true)
              setShowDisclaimerModal(false)
              if (selectedTemplate) {
                setCurrentStep('form')
              }
            }}
          />
        )}
      </div>
    </div>
  )
}