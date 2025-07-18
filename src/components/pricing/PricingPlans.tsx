import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, CreditCard, Smartphone, Shield, Users, Zap, Crown, Infinity as InfinityIcon } from 'lucide-react'
import { PaymentMethodSelector } from './PaymentMethodSelector'
import { useLanguage } from '@/hooks/useLanguage'

interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  period: 'month' | 'document'
  popular?: boolean
  premium?: boolean
  features: string[]
  icon: React.ReactNode
}

export function PricingPlans() {
  const { t } = useLanguage()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)

  const plans: PricingPlan[] = [
    {
      id: 'basic',
      name: t('basicPlan'),
      description: t('basicPlanDesc'),
      price: 5,
      period: 'month',
      features: [
        t('unlimitedAnalysis'),
        t('noContractGeneration'),
        t('contractGenerationCost'),
        t('cancelAnytime')
      ],
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: 'ai-plus',
      name: t('aiPlusTitle'),
      description: t('aiPlusDesc'),
      price: 15,
      period: 'month',
      popular: true,
      features: [
        t('unlimitedAnalysis'),
        t('pdfWordExport'),
        t('fiveContractsIncluded'),
        t('additionalContracts'),
        t('flexibleCancellation')
      ],
      icon: <Crown className="h-6 w-6" />
    },
    {
      id: 'team',
      name: t('teamTitle'),
      description: t('teamDesc'),
      price: 40,
      period: 'month',
      features: [
        t('unlimitedAnalysis'),
        t('pdfWordExport'),
        t('tenContractsIncluded'),
        t('additionalContractsTeam'),
        t('multiUserCollaboration'),
        t('cancelAnytime')
      ],
      icon: <Users className="h-6 w-6" />
    },
    {
      id: 'unlimited',
      name: t('unlimitedPlan'),
      description: t('unlimitedPlanDesc'),
      price: 100,
      period: 'month',
      premium: true,
      features: [
        t('unlimitedGeneration'),
        t('unlimitedAnalysis'),
        t('pdfWordExport'),
        t('fullCollaborativeAccess'),
        t('cancelAnytime')
      ],
      icon: <InfinityIcon className="h-6 w-6" />
    }
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setShowPaymentMethods(true)
  }

  const handlePaymentComplete = () => {
    setShowPaymentMethods(false)
    setSelectedPlan(null)
    // Handle successful payment
  }

  if (showPaymentMethods && selectedPlan) {
    const plan = plans.find(p => p.id === selectedPlan)
    if (plan) {
      return (
        <PaymentMethodSelector
          plan={plan}
          onBack={() => setShowPaymentMethods(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )
    }
  }

  return (
    <section id="pricing" className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('pricingTitle')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('pricingSubtitle')}</p>
          
          {/* New Contract Types Section */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              📄 {t('termsAndConditions')} & {t('privacyNotice')}
            </h3>
            <p className="text-blue-700 text-sm">
              {t('legalContextSupport')}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-lg transition-all duration-300 ${
                plan.popular ? 'border-blue-200 scale-105' : ''
              } ${plan.premium ? 'border-purple-200' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600">
                  {t('mostPopular')}
                </Badge>
              )}
              {plan.premium && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600">
                  Premium
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4 ${
                  plan.popular ? 'bg-blue-100 text-blue-600' : 
                  plan.premium ? 'bg-purple-100 text-purple-600' : 
                  'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className={`text-3xl font-bold mt-4 ${
                  plan.popular ? 'text-blue-600' : 
                  plan.premium ? 'text-purple-600' : 
                  'text-gray-900'
                }`}>
                  ${plan.price} 
                  <span className="text-lg text-gray-500 ml-1">
                    {plan.period === 'month' ? t('perMonth') : t('perDocument')}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full ${
                    plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 
                    plan.premium ? 'bg-purple-600 hover:bg-purple-700' : 
                    'bg-gray-900 hover:bg-gray-800'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Choose Plan
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Internationalization Notice */}
        <div className="text-center mt-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold text-green-900 mb-3">
              🌍 Internacionalização e Acessibilidade
            </h3>
            <div className="text-green-700 text-sm space-y-2">
              <p>• Não é necessário registro (e-mail) para acessar o site ou navegar por suas funções</p>
              <p>• Jurisprudência específica para: Brasil, Portugal, EUA, México, Canadá, Reino Unido, Espanha, Alemanha, França, Índia</p>
              <p>• Tradução completa ao português brasileiro na interface e documentos gerados</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Multiple Payment Methods</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-4 w-4" />
              <span>Mobile Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}