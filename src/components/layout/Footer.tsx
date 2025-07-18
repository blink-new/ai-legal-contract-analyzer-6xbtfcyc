import { Scale, Mail, MapPin, Phone, Globe, Shield, Award, Users } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { TermsModal } from '@/components/ui/terms-modal'
import { PrivacyModal } from '@/components/ui/privacy-modal'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="space-y-3 sm:space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2">
              <Scale className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400" />
              <span className="text-lg sm:text-xl font-semibold">LegalAI</span>
            </div>
            <p className="text-gray-300 text-xs sm:text-sm">
              AI-powered legal contract analysis and generation platform for startups and growing businesses worldwide.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>SOC2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-400">
                <Award className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>ISO 27001</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Product</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">Contract Analyzer</a></li>
              <li><a href="/generate" className="hover:text-white transition-colors">Contract Generator</a></li>
              <li><a href="/signatures" className="hover:text-white transition-colors">Signature Tool</a></li>
              <li><a href="/dashboard" className="hover:text-white transition-colors">Dashboard</a></li>
              <li><a href="/#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Legal & Support</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-300">
              <li>
                <TermsModal>
                  <button className="hover:text-white transition-colors text-left">
                    Terms and Conditions
                  </button>
                </TermsModal>
              </li>
              <li>
                <PrivacyModal>
                  <button className="hover:text-white transition-colors text-left">
                    Privacy Policy
                  </button>
                </PrivacyModal>
              </li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/help" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Contact</h3>
            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>support@legalai.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Available in 11 languages</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-400">
              <span>© 2024 LegalAI. All rights reserved.</span>
              <div className="flex items-center space-x-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Trusted by 500+ companies</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-xs sm:text-sm text-gray-400">
                Supported Languages:
              </div>
              <div className="flex items-center space-x-1 flex-wrap justify-center">
                <span>🇺🇸</span>
                <span>🇪🇸</span>
                <span>🇨🇳</span>
                <span>🇸🇦</span>
                <span>🇫🇷</span>
                <span>🇩🇪</span>
                <span>🇵🇹</span>
                <span>🇧🇷</span>
                <span>🇯🇵</span>
                <span>🇮🇳</span>
                <span>🇷🇺</span>
                <span>🇮🇹</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}