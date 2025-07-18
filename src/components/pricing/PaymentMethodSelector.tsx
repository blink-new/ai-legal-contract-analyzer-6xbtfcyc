import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CreditCard, Smartphone, Shield, Bitcoin, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  popular?: boolean
  mobile?: boolean
  crypto?: boolean
}

interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  period: 'month' | 'document'
  features: string[]
  icon: React.ReactNode
}

interface PaymentMethodSelectorProps {
  plan: PricingPlan
  onBack: () => void
  onPaymentComplete: () => void
}

export function PaymentMethodSelector({ plan, onBack, onPaymentComplete }: PaymentMethodSelectorProps) {
  const { t } = useLanguage()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'stripe',
      name: t('creditCard'),
      description: 'Visa, Mastercard, American Express',
      icon: <CreditCard className="h-5 w-5" />,
      popular: true
    },
    {
      id: 'paypal',
      name: t('paypal'),
      description: 'Pay with your PayPal account',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.79A.859.859 0 0 1 5.79 2h8.263c3.401 0 5.662 1.515 5.662 4.695 0 1.662-.79 3.064-2.1 3.784 1.457.72 2.343 2.031 2.343 3.784 0 3.18-2.261 4.695-5.662 4.695H9.283l-.69 2.378a.641.641 0 0 1-.633.501z"/>
        </svg>
      )
    },
    {
      id: 'apple-pay',
      name: t('applePay'),
      description: 'Touch ID or Face ID',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
        </svg>
      ),
      mobile: true
    },
    {
      id: 'google-pay',
      name: t('googlePay'),
      description: 'One-click mobile payments',
      icon: (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      mobile: true
    },
    {
      id: 'crypto',
      name: t('crypto'),
      description: 'Bitcoin, Ethereum, USDC',
      icon: <Bitcoin className="h-5 w-5" />,
      crypto: true
    }
  ]

  const handlePayment = async (methodId: string) => {
    setSelectedMethod(methodId)
    setProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false)
      onPaymentComplete()
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plans
        </Button>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('paymentMethods')}</h2>
          <p className="text-gray-600">Choose your preferred payment method</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Plan Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                {plan.icon}
                <span>{plan.name}</span>
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                ${plan.price}
                <span className="text-lg text-gray-500 ml-1">
                  /{plan.period === 'month' ? t('perMonth') : t('perDocument')}
                </span>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <h4 className="font-medium">Included features:</h4>
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 text-green-700">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Methods */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedMethod === method.id ? 'ring-2 ring-blue-500' : ''
                } ${processing && selectedMethod === method.id ? 'opacity-50' : ''}`}
                onClick={() => !processing && handlePayment(method.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${
                        method.popular ? 'bg-blue-100 text-blue-600' :
                        method.mobile ? 'bg-green-100 text-green-600' :
                        method.crypto ? 'bg-orange-100 text-orange-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {method.icon}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{method.name}</h3>
                          {method.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                          {method.mobile && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              Mobile
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    
                    {processing && selectedMethod === method.id ? (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Processing...</span>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900">Security & Privacy</h4>
                <p className="text-sm text-gray-600 mt-1">
                  All payments are processed securely through industry-standard encryption. 
                  We never store your payment information on our servers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}