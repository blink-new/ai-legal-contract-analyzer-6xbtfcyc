import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PenTool, Users, Shield, Zap, CreditCard } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { blink } from '@/blink/client'
import { useToast } from '@/hooks/use-toast'

interface SignatureModalProps {
  isOpen: boolean
  onClose: () => void
  contractId: string
  contractTitle: string
  userPlan: 'basic' | 'premium'
  onStartSigning: () => void
}

export function SignatureModal({ 
  isOpen, 
  onClose, 
  contractId, 
  contractTitle, 
  userPlan,
  onStartSigning 
}: SignatureModalProps) {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const handleStartSigning = async () => {
    if (userPlan === 'basic') {
      // Process $1 payment for basic users
      setIsProcessingPayment(true)
      try {
        // TODO: Integrate with Stripe for $1 payment
        // For now, simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        toast({
          title: "Payment Successful",
          description: "$1.00 charged for signature service",
        })
        
        onStartSigning()
      } catch (error) {
        toast({
          title: "Payment Failed",
          description: "Unable to process payment. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsProcessingPayment(false)
      }
    } else {
      // Premium users get it free
      onStartSigning()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <PenTool className="h-5 w-5 text-blue-600" />
            <span>Contract Signature Service</span>
          </DialogTitle>
          <DialogDescription>
            Add electronic signatures to your contract: {contractTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pricing Info */}
          <Card className={userPlan === 'premium' ? 'border-green-200 bg-green-50' : 'border-blue-200 bg-blue-50'}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {userPlan === 'premium' ? 'Premium Plan' : 'Basic Plan'}
                </CardTitle>
                <Badge variant={userPlan === 'premium' ? 'default' : 'secondary'}>
                  {userPlan === 'premium' ? 'FREE' : '$1.00 USD'}
                </Badge>
              </div>
              <CardDescription>
                {userPlan === 'premium' 
                  ? 'Signature service included in your Premium plan'
                  : 'One-time charge for signature service'
                }
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Multi-Party Signing</h4>
                    <p className="text-sm text-gray-600">Add multiple signers and approvers</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Legally Binding</h4>
                    <p className="text-sm text-gray-600">ESIGN & eIDAS compliant</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Real-time Tracking</h4>
                    <p className="text-sm text-gray-600">Monitor signature progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">Audit Trail</h4>
                    <p className="text-sm text-gray-600">Complete signing history</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Maybe Later
            </Button>
            
            <Button 
              onClick={handleStartSigning}
              disabled={isProcessingPayment}
              className="min-w-[140px]"
            >
              {isProcessingPayment ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <PenTool className="h-4 w-4" />
                  <span>
                    {userPlan === 'premium' ? 'Start Signing (Free)' : 'Pay $1 & Sign'}
                  </span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}