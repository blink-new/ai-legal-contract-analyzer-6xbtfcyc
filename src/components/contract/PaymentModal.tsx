import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  CreditCard, 
  DollarSign, 
  Check, 
  X, 
  Shield, 
  Zap,
  Users,
  Download,
  FileText,
  Clock
} from 'lucide-react'
import { PAYMENT_PLANS } from '@/types/contractGeneration'
import type { GeneratedContract } from '@/types/contractGeneration'

interface PaymentModalProps {
  contract: GeneratedContract
  onClose: () => void
  onPurchase: (paymentMethod: 'subscription' | 'pay-per-use') => void
}

export function PaymentModal({ contract, onClose, onPurchase }: PaymentModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<'subscription' | 'pay-per-use'>('pay-per-use')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const subscriptionPlan = PAYMENT_PLANS.find(p => p.type === 'subscription')!
  const payPerUsePlan = PAYMENT_PLANS.find(p => p.type === 'pay-per-use')!
  
  const currentPrice = selectedPlan === 'subscription' 
    ? subscriptionPlan.price 
    : contract.price

  const handlePurchase = async () => {
    if (!acceptedTerms) {
      setShowTerms(true)
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      onPurchase(selectedPlan)
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Purchase Contract</span>
          </DialogTitle>
          <DialogDescription>
            Choose your payment option to download the complete contract
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contract Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contract Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Document:</span>
                    <span className="font-medium">{contract.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pages:</span>
                    <span className="font-medium">{contract.pageCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">{contract.language.toUpperCase()}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Generated:</span>
                    <span className="font-medium">{new Date(contract.generatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jurisdiction:</span>
                    <span className="font-medium">{contract.jurisdiction}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Format:</span>
                    <span className="font-medium">PDF + Word</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          <Tabs value={selectedPlan} onValueChange={(value) => setSelectedPlan(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pay-per-use">Pay Per Document</TabsTrigger>
              <TabsTrigger value="subscription">Monthly Subscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pay-per-use" className="space-y-4">
              <Card className="border-2 border-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <FileText className="h-5 w-5" />
                        <span>Pay Per Document</span>
                      </CardTitle>
                      <CardDescription>
                        One-time payment for this contract only
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        ${contract.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${payPerUsePlan.price.toFixed(2)} per page
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payPerUsePlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {payPerUsePlan.limitations && payPerUsePlan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <X className="h-4 w-4 text-gray-400" />
                        <span>{limitation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-4">
              <Card className="border-2 border-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span>Monthly Subscription</span>
                        <Badge className="bg-green-100 text-green-800">Best Value</Badge>
                      </CardTitle>
                      <CardDescription>
                        Unlimited contract generation and analysis
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${subscriptionPlan.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        per month
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subscriptionPlan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Check className="h-4 w-4 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Alert className="mt-4">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      Cancel anytime. No long-term commitment required.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax:</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${currentPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-blue-600 hover:underline"
                >
                  Terms & Conditions
                </button>{' '}
                and{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-blue-600 hover:underline"
                >
                  Privacy Policy
                </button>
              </label>
            </div>
            
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                <strong>Secure Payment:</strong> Your payment is processed securely through Stripe. 
                We never store your payment information.
              </AlertDescription>
            </Alert>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            
            <Button 
              onClick={handlePurchase} 
              disabled={!acceptedTerms || isProcessing}
              className="min-w-32"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase ${currentPrice.toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Terms Modal */}
        {showTerms && (
          <Dialog open={showTerms} onOpenChange={setShowTerms}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Terms & Conditions</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <h3 className="font-medium mb-2">1. Service Description</h3>
                  <p className="text-gray-600">
                    Our AI-powered contract generation service provides legal document templates 
                    for informational purposes only. All documents are generated using artificial 
                    intelligence technology.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">2. Legal Disclaimer</h3>
                  <p className="text-gray-600">
                    All documents and analyses provided on this platform are for informational 
                    purposes only and are generated using AI technology. The output may not 
                    accurately reflect local laws, enforceability, or legal standards in your 
                    jurisdiction. Use of these documents is at the user's sole risk.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">3. Limitation of Liability</h3>
                  <p className="text-gray-600">
                    Guiflo Inc. assumes no responsibility or legal liability for any use, damages, 
                    losses, or outcomes resulting from the use of these materials. We strongly 
                    recommend that all users consult with a qualified attorney licensed in their 
                    specific jurisdiction before using or executing any document.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">4. Payment Terms</h3>
                  <p className="text-gray-600">
                    All payments are processed securely through Stripe. Subscription plans can be 
                    cancelled at any time. Pay-per-use purchases are final and non-refundable.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">5. Data Privacy</h3>
                  <p className="text-gray-600">
                    We are committed to protecting your privacy and handle all data in accordance 
                    with GDPR and other applicable privacy laws. Your contract data is encrypted 
                    and stored securely.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setShowTerms(false)}>Close</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}