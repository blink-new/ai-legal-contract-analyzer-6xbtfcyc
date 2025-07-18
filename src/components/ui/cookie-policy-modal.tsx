import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Cookie, Shield, Eye, BarChart3, Settings } from 'lucide-react'

interface CookiePolicyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CookiePolicyModal({ isOpen, onClose }: CookiePolicyModalProps) {
  const [acceptedCategories, setAcceptedCategories] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false
  })

  const handleAcceptAll = () => {
    setAcceptedCategories({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    })
    // Save preferences to localStorage
    localStorage.setItem('cookie-preferences', JSON.stringify({
      ...acceptedCategories,
      analytics: true,
      marketing: true,
      preferences: true,
      timestamp: Date.now()
    }))
    onClose()
  }

  const handleAcceptSelected = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookie-preferences', JSON.stringify({
      ...acceptedCategories,
      timestamp: Date.now()
    }))
    onClose()
  }

  const handleRejectAll = () => {
    const minimalSettings = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    }
    setAcceptedCategories(minimalSettings)
    localStorage.setItem('cookie-preferences', JSON.stringify({
      ...minimalSettings,
      timestamp: Date.now()
    }))
    onClose()
  }

  const toggleCategory = (category: keyof typeof acceptedCategories) => {
    if (category === 'necessary') return // Cannot disable necessary cookies
    
    setAcceptedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Cookie className="h-5 w-5 text-amber-600" />
            <span>Cookie Policy</span>
          </DialogTitle>
          <DialogDescription>
            We use cookies to enhance your experience and analyze our website traffic. 
            Please review our cookie policy and choose your preferences.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Introduction */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">About Our Cookies</h3>
              <p className="text-sm text-gray-600">
                This Cookie Policy explains how AI Legal Contract Analyzer ("we", "us", or "our") 
                uses cookies and similar technologies when you visit our website and use our services. 
                This policy describes what cookies are, how we use them, and your choices regarding cookies.
              </p>
            </div>

            <Separator />

            {/* What are cookies */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">What Are Cookies?</h3>
              <p className="text-sm text-gray-600">
                Cookies are small text files that are placed on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences, 
                analyzing how you use our site, and personalizing content.
              </p>
            </div>

            <Separator />

            {/* Cookie Categories */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cookie Categories</h3>
              
              {/* Necessary Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium">Necessary Cookies</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Required</span>
                  </div>
                  <div className="w-10 h-6 bg-green-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  These cookies are essential for the website to function properly. They enable core functionality 
                  such as security, network management, and accessibility.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Examples:</strong> Authentication tokens, session management, security preferences
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <h4 className="font-medium">Analytics Cookies</h4>
                  </div>
                  <button
                    onClick={() => toggleCategory('analytics')}
                    className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                      acceptedCategories.analytics 
                        ? 'bg-blue-600 justify-end' 
                        : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  These cookies help us understand how visitors interact with our website by collecting 
                  and reporting information anonymously.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Examples:</strong> Google Analytics, page views, user behavior analysis
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-purple-600" />
                    <h4 className="font-medium">Marketing Cookies</h4>
                  </div>
                  <button
                    onClick={() => toggleCategory('marketing')}
                    className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                      acceptedCategories.marketing 
                        ? 'bg-purple-600 justify-end' 
                        : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  These cookies are used to track visitors across websites to display relevant 
                  and engaging advertisements.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Examples:</strong> Advertising networks, retargeting pixels, conversion tracking
                </div>
              </div>

              {/* Preferences Cookies */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Settings className="h-4 w-4 text-orange-600" />
                    <h4 className="font-medium">Preference Cookies</h4>
                  </div>
                  <button
                    onClick={() => toggleCategory('preferences')}
                    className={`w-10 h-6 rounded-full flex items-center px-1 transition-colors ${
                      acceptedCategories.preferences 
                        ? 'bg-orange-600 justify-end' 
                        : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  These cookies remember your preferences and choices to provide a more personalized experience.
                </p>
                <div className="text-xs text-gray-500">
                  <strong>Examples:</strong> Language preferences, theme settings, region selection
                </div>
              </div>
            </div>

            <Separator />

            {/* Data Processing */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Data Processing and Legal Basis</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Legal Basis:</strong> We process cookie data based on your consent (Article 6(1)(a) GDPR) 
                  for non-essential cookies, and legitimate interests (Article 6(1)(f) GDPR) for essential cookies.
                </p>
                <p>
                  <strong>Data Retention:</strong> Cookie data is retained for different periods depending on the type:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Session cookies: Deleted when you close your browser</li>
                  <li>Persistent cookies: Up to 2 years or until you delete them</li>
                  <li>Analytics data: Up to 26 months (Google Analytics default)</li>
                </ul>
              </div>
            </div>

            <Separator />

            {/* Third-Party Services */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Third-Party Services</h3>
              <p className="text-sm text-gray-600">
                We use the following third-party services that may set cookies:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-sm text-gray-600">
                <li><strong>Google Analytics:</strong> Website traffic analysis and user behavior insights</li>
                <li><strong>Stripe:</strong> Payment processing and fraud prevention</li>
                <li><strong>Blink Platform:</strong> Authentication and application functionality</li>
              </ul>
            </div>

            <Separator />

            {/* Your Rights */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Your Rights and Choices</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>You have the following rights regarding cookies:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li><strong>Consent Withdrawal:</strong> You can withdraw your consent at any time</li>
                  <li><strong>Browser Settings:</strong> Configure your browser to block or delete cookies</li>
                  <li><strong>Opt-out:</strong> Use opt-out mechanisms provided by third-party services</li>
                  <li><strong>Data Access:</strong> Request information about cookies we've set</li>
                </ul>
                <p className="mt-2">
                  <strong>Note:</strong> Disabling certain cookies may affect website functionality and your user experience.
                </p>
              </div>
            </div>

            <Separator />

            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Contact Us</h3>
              <p className="text-sm text-gray-600">
                If you have questions about our Cookie Policy or data processing practices, please contact us:
              </p>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Email:</strong> privacy@ai-legal-analyzer.com</p>
                <p><strong>Address:</strong> AI Legal Contract Analyzer, Data Protection Office</p>
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button 
            onClick={handleRejectAll}
            variant="outline" 
            className="flex-1"
          >
            Reject All
          </Button>
          <Button 
            onClick={handleAcceptSelected}
            variant="outline" 
            className="flex-1"
          >
            Accept Selected
          </Button>
          <Button 
            onClick={handleAcceptAll}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Accept All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}