import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  AlertTriangle, 
  Shield, 
  Scale,
  FileText,
  Users,
  Globe
} from 'lucide-react'

interface LegalDisclaimerModalProps {
  onClose: () => void
  onAccept: () => void
}

export function LegalDisclaimerModal({ onClose, onAccept }: LegalDisclaimerModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false)

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10
    if (isAtBottom) {
      setHasScrolledToBottom(true)
    }
  }

  const canProceed = hasScrolledToBottom && acceptedTerms && acceptedPrivacy

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Scale className="h-5 w-5 text-blue-600" />
            <span>Legal Terms & Conditions</span>
          </DialogTitle>
          <DialogDescription>
            Please read and accept our terms before using the contract generation service
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Important Notice */}
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Important:</strong> By using this service, you acknowledge that all generated 
              documents are for informational purposes only and should be reviewed by a qualified 
              attorney before use.
            </AlertDescription>
          </Alert>

          {/* Terms Content */}
          <ScrollArea 
            className="h-96 border rounded-lg p-4" 
            onScrollCapture={handleScroll}
          >
            <div className="space-y-6 text-sm">
              {/* Company Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Service Provider</h3>
                </div>
                <p className="text-blue-800">
                  This platform is owned and operated by <strong>Guiflo Inc.</strong>, 
                  a Delaware C Corporation governed under U.S. law.
                </p>
              </div>

              {/* Legal Disclaimer */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-gray-900">Legal Disclaimer</h3>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <p className="text-red-800 leading-relaxed">
                    <strong>All documents and analyses provided on this platform are for 
                    informational purposes only and are generated using AI technology.</strong> 
                    The output may not accurately reflect local laws, enforceability, or legal 
                    standards in your jurisdiction. Use of these documents is at the user's sole risk. 
                    Guiflo Inc. assumes no responsibility or legal liability for any use, damages, 
                    losses, or outcomes resulting from the use of these materials. 
                    <strong>We strongly recommend that all users consult with a qualified attorney 
                    licensed in their specific jurisdiction before using or executing any document.</strong>
                  </p>
                </div>
              </div>

              {/* Terms of Service */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Terms of Service</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">1. Service Description</h4>
                    <p className="text-gray-700">
                      Our AI-powered contract generation service provides legal document templates 
                      and analysis tools. The service includes contract generation, risk assessment, 
                      multilingual translation, and comparison tools.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">2. User Responsibilities</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>You must be at least 18 years old to use this service</li>
                      <li>You are responsible for the accuracy of information provided</li>
                      <li>You must comply with all applicable laws in your jurisdiction</li>
                      <li>You agree not to use the service for illegal or unauthorized purposes</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">3. Intellectual Property</h4>
                    <p className="text-gray-700">
                      Generated documents become your property upon purchase. However, the underlying 
                      templates, AI technology, and platform remain the intellectual property of Guiflo Inc.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">4. Limitation of Liability</h4>
                    <p className="text-gray-700">
                      In no event shall Guiflo Inc. be liable for any indirect, incidental, special, 
                      consequential, or punitive damages, including without limitation, loss of profits, 
                      data, use, goodwill, or other intangible losses.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">5. Payment Terms</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Pay-per-use: $0.80 per page, payment required before download</li>
                      <li>Monthly subscription: $5.00 per month, cancel anytime</li>
                      <li>All payments processed securely through Stripe</li>
                      <li>Refunds available within 7 days for subscription plans only</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Privacy Policy */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Privacy Policy</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Data Collection</h4>
                    <p className="text-gray-700">
                      We collect information you provide directly (contract data, personal information), 
                      usage information (how you interact with our service), and technical information 
                      (IP address, browser type, device information).
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Data Use</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>To provide and improve our contract generation services</li>
                      <li>To process payments and manage your account</li>
                      <li>To communicate with you about our services</li>
                      <li>To comply with legal obligations</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Data Security</h4>
                    <p className="text-gray-700">
                      We implement industry-standard security measures including encryption at rest 
                      and in transit, secure data centers, regular security audits, and access controls. 
                      We are SOC2 compliant and GDPR compliant.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Data Retention</h4>
                    <p className="text-gray-700">
                      Contract data is retained for as long as your account is active or as needed 
                      to provide services. You can request deletion of your data at any time.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Your Rights</h4>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Access your personal data</li>
                      <li>Correct inaccurate data</li>
                      <li>Delete your data</li>
                      <li>Export your data</li>
                      <li>Opt out of marketing communications</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Jurisdiction and Governing Law */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Globe className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Governing Law</h3>
                </div>
                <p className="text-gray-700">
                  These terms are governed by the laws of the State of Delaware, United States, 
                  without regard to conflict of law principles. Any disputes will be resolved 
                  in the courts of Delaware.
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <p className="text-gray-700">
                  For questions about these terms or our privacy practices, contact us at:
                  <br />
                  <strong>Email:</strong> legal@guiflo.com
                  <br />
                  <strong>Address:</strong> Guiflo Inc., 1234 Legal Street, Wilmington, DE 19801
                </p>
              </div>

              {/* Last Updated */}
              <div className="text-center text-gray-500 text-xs">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>
          </ScrollArea>

          {/* Scroll Indicator */}
          {!hasScrolledToBottom && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please scroll to the bottom to read all terms and conditions.
              </AlertDescription>
            </Alert>
          )}

          {/* Acceptance Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={!hasScrolledToBottom}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <label htmlFor="terms" className="text-sm">
                <strong>I have read and agree to the Terms of Service</strong>
                <br />
                <span className="text-gray-600">
                  I understand that all generated documents are for informational purposes only 
                  and require legal review before use.
                </span>
              </label>
            </div>
            
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="privacy"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                disabled={!hasScrolledToBottom}
                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
              />
              <label htmlFor="privacy" className="text-sm">
                <strong>I have read and agree to the Privacy Policy</strong>
                <br />
                <span className="text-gray-600">
                  I consent to the collection and processing of my data as described in the Privacy Policy.
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            <Button 
              onClick={onAccept} 
              disabled={!canProceed}
              className="min-w-32"
            >
              Accept & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}