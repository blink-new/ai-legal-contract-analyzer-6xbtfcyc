import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, CreditCard, Smartphone, Shield, Users, Zap, Crown, Infinity as InfinityIcon, ArrowLeft } from 'lucide-react'
import { PaymentMethodSelector } from '@/components/pricing/PaymentMethodSelector'
import { useLanguage } from '@/hooks/useLanguage'
import { blink } from '@/blink/client'

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

export function PricingPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPaymentMethods, setShowPaymentMethods] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
    })
    return unsubscribe
  }, [])

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
    if (!user) {
      blink.auth.login()
      return
    }
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
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <Button 
              variant="ghost" 
              onClick={() => setShowPaymentMethods(false)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>
            <PaymentMethodSelector
              plan={plan}
              onBack={() => setShowPaymentMethods(false)}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 px-4">{t('pricingTitle')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg px-4">{t('pricingSubtitle')}</p>
          
          {/* Current Plan Display */}
          {user && (
            <div className="mt-6 sm:mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
                Your Current Plan
              </h3>
              <p className="text-blue-700 text-sm">
                Free Plan - Upgrade to unlock premium features
              </p>
            </div>
          )}
          
          {/* New Contract Types Section */}
          <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg border border-blue-200 max-w-4xl mx-auto">
            <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">
              📄 {t('termsAndConditions')} & {t('privacyNotice')}
            </h3>
            <p className="text-blue-700 text-xs sm:text-sm">
              {t('legalContextSupport')}
            </p>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto mb-12 sm:mb-16">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-lg transition-all duration-300 ${
                plan.popular ? 'border-blue-200 sm:scale-105' : ''
              } ${plan.premium ? 'border-purple-200' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-blue-600 text-xs">
                  {t('mostPopular')}
                </Badge>
              )}
              {plan.premium && (
                <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-purple-600 text-xs">
                  Premium
                </Badge>
              )}
              
              <CardHeader className="text-center px-4 sm:px-6 py-4 sm:py-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 ${
                  plan.popular ? 'bg-blue-100 text-blue-600' : 
                  plan.premium ? 'bg-purple-100 text-purple-600' : 
                  'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm sm:text-base">{plan.description}</CardDescription>
                <div className={`text-2xl sm:text-3xl font-bold mt-3 sm:mt-4 ${
                  plan.popular ? 'text-blue-600' : 
                  plan.premium ? 'text-purple-600' : 
                  'text-gray-900'
                }`}>
                  ${plan.price} 
                  <span className="text-sm sm:text-lg text-gray-500 ml-1">
                    {plan.period === 'month' ? t('perMonth') : t('perDocument')}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent className="px-4 sm:px-6">
                <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full text-sm ${
                    plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 
                    plan.premium ? 'bg-purple-600 hover:bg-purple-700' : 
                    'bg-gray-900 hover:bg-gray-800'
                  }`}
                  size="sm"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  {user ? 'Choose Plan' : 'Sign In to Choose'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plan Comparison Table */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 sm:mb-8">Detailed Plan Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 sm:py-4 px-2 sm:px-4 text-sm sm:text-base">Features</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-sm sm:text-base">Basic</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-sm sm:text-base">AI+</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-sm sm:text-base">Team</th>
                  <th className="text-center py-3 sm:py-4 px-2 sm:px-4 text-sm sm:text-base">Unlimited</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-sm sm:text-base">Contract Analysis</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅ Unlimited</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅ Unlimited</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅ Unlimited</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅ Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-sm sm:text-base">Contract Generation</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">❌ Pay per use</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅ 5/month</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅ 10/month</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅ Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-sm sm:text-base">Export to Word/PDF</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">❌</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-sm sm:text-base">Collaboration</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">❌</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">❌</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 sm:py-4 px-2 sm:px-4 font-medium text-sm sm:text-base">Priority Support</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">❌</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅</td>
                  <td className="text-center py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Internationalization Notice */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 max-w-4xl mx-auto">
            <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-3">
              🌍 Global Accessibility & Compliance
            </h3>
            <div className="text-green-700 text-xs sm:text-sm space-y-2">
              <p>• Available in 11 languages with full UI translation</p>
              <p>• Legal jurisdiction support for: Brazil, Portugal, USA, Mexico, Canada, UK, Spain, Germany, France, India, UAE, Russia, Japan, China</p>
              <p>• GDPR compliant with SOC2 and ISO 27001 certifications</p>
              <p>• No email registration required for basic access</p>
            </div>
          </div>
        </div>

        {/* Security & Payment Info */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-xs sm:text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Multiple Payment Methods</span>
            </div>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Mobile Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}