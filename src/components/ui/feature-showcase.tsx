import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  FileText, 
  Globe, 
  Shield, 
  Zap, 
  Users, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'

interface Feature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  demo?: string
  benefits: string[]
}

const features: Feature[] = [
  {
    id: 'analysis',
    title: 'AI Risk Analysis',
    description: 'Advanced AI algorithms analyze your contracts for potential risks and legal issues',
    icon: <BarChart3 className="h-6 w-6" />,
    color: 'bg-blue-500',
    demo: 'Analyze 50+ risk factors in seconds',
    benefits: [
      'Identifies hidden clauses',
      'Risk scoring 0-100',
      'Jurisdiction-specific analysis',
      'Actionable recommendations'
    ]
  },
  {
    id: 'translation',
    title: 'Multilingual Translation',
    description: 'Translate contracts across 11 languages while preserving legal context',
    icon: <Globe className="h-6 w-6" />,
    color: 'bg-green-500',
    demo: 'Support for 11 languages',
    benefits: [
      'Legal context preservation',
      'Professional terminology',
      'Cultural adaptation',
      'Instant translation'
    ]
  },
  {
    id: 'generation',
    title: 'Contract Generation',
    description: 'Generate professional contracts using AI with jurisdiction-specific templates',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-purple-500',
    demo: '50+ contract templates',
    benefits: [
      'Jurisdiction compliance',
      'Custom clauses',
      'Professional formatting',
      'Export to PDF/Word'
    ]
  },
  {
    id: 'collaboration',
    title: 'Team Collaboration',
    description: 'Work together on contracts with real-time collaboration and version control',
    icon: <Users className="h-6 w-6" />,
    color: 'bg-orange-500',
    demo: 'Real-time collaboration',
    benefits: [
      'Multi-user editing',
      'Version history',
      'Comment system',
      'Role-based access'
    ]
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description: 'Bank-level encryption and SOC2 compliance for your sensitive legal documents',
    icon: <Shield className="h-6 w-6" />,
    color: 'bg-red-500',
    demo: 'SOC2 Type II Certified',
    benefits: [
      'End-to-end encryption',
      'SOC2 compliance',
      'GDPR compliant',
      'Secure document storage'
    ]
  },
  {
    id: 'automation',
    title: 'Smart Automation',
    description: 'Automate contract workflows with AI-powered clause suggestions and approvals',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-yellow-500',
    demo: '90% faster processing',
    benefits: [
      'Automated workflows',
      'Smart suggestions',
      'Approval routing',
      'Integration APIs'
    ]
  }
]

export function FeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(features[0])

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="h-4 w-4 mr-2" />
            Powered by Advanced AI
          </Badge>
          <h2 className="text-4xl font-bold mb-4">
            Everything You Need for Legal Excellence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From analysis to generation, our comprehensive platform handles every aspect 
            of legal contract management with cutting-edge AI technology.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature List */}
          <div className="space-y-4">
            {features.map((feature) => (
              <Card 
                key={feature.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeFeature.id === feature.id 
                    ? 'ring-2 ring-blue-500 shadow-lg' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => setActiveFeature(feature)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center text-white flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                        {feature.demo && (
                          <Badge variant="outline" className="text-xs">
                            {feature.demo}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                      
                      {activeFeature.id === feature.id && (
                        <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                          {feature.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                              <span className="text-gray-700">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {activeFeature.id === feature.id && (
                      <ArrowRight className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Demo */}
          <div className="lg:sticky lg:top-8">
            <Card className="overflow-hidden shadow-2xl">
              <div className={`h-2 ${activeFeature.color}`} />
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-full ${activeFeature.color} flex items-center justify-center text-white mx-auto mb-4`}>
                    {activeFeature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{activeFeature.title}</h3>
                  <p className="text-gray-600">{activeFeature.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 text-center">Key Benefits</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {activeFeature.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Try {activeFeature.title}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}