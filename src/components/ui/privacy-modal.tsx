import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLanguage } from '@/hooks/useLanguage'

interface PrivacyModalProps {
  children: React.ReactNode
}

export function PrivacyModal({ children }: PrivacyModalProps) {
  const { t } = useLanguage()

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Information We Collect</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We collect information you provide directly to us, such as when you create an account, upload documents, or contact us for support:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Account Information:</strong> Email address, name, and authentication credentials</li>
                <li><strong>Document Content:</strong> Legal contracts and documents you upload for analysis</li>
                <li><strong>Usage Data:</strong> Information about how you use our service, including analysis history</li>
                <li><strong>Payment Information:</strong> Billing details processed securely through Stripe</li>
                <li><strong>Communication Data:</strong> Messages you send to our support team</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. How We Use Your Information</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Provide, maintain, and improve our AI-powered contract analysis services</li>
                <li>Process your documents and generate analysis reports, translations, and recommendations</li>
                <li>Manage your account and process payments</li>
                <li>Send you technical notices, updates, and support communications</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Improve our AI models and service quality (using anonymized data only)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. Data Security and Encryption</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We implement industry-leading security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>End-to-End Encryption:</strong> All documents are encrypted in transit and at rest</li>
                <li><strong>SOC2 Compliance:</strong> We maintain SOC2 Type II certification for data security</li>
                <li><strong>ISO 27001:</strong> Our security management system meets international standards</li>
                <li><strong>Access Controls:</strong> Strict access controls limit who can view your data</li>
                <li><strong>Regular Audits:</strong> Third-party security audits ensure ongoing protection</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Data Sharing and Disclosure</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We do not sell, trade, or otherwise transfer your personal information to third parties except in the following limited circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Service Providers:</strong> Trusted partners who assist in operating our service (e.g., cloud hosting, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Consent:</strong> When you explicitly consent to sharing your information</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                All service providers are bound by strict confidentiality agreements and data protection requirements.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. International Data Transfers</h3>
              <p className="text-gray-700 leading-relaxed">
                Our service is available globally across 11 languages and multiple jurisdictions. Data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-3">
                <li>Standard Contractual Clauses (SCCs) for EU data transfers</li>
                <li>Adequacy decisions where applicable</li>
                <li>Additional security measures for sensitive legal documents</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Data Retention</h3>
              <p className="text-gray-700 leading-relaxed">
                We retain your information for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4 mt-3">
                <li><strong>Account Data:</strong> Retained while your account is active and for 30 days after deletion</li>
                <li><strong>Document Content:</strong> Retained for the duration of your subscription plus 30 days</li>
                <li><strong>Analysis Results:</strong> Stored in your account for easy access and download</li>
                <li><strong>Payment Records:</strong> Retained for 7 years for tax and accounting purposes</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Your Rights and Choices</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Objection:</strong> Object to certain processing of your personal information</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                To exercise these rights, please contact us at privacy@legalai.com.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 leading-relaxed">
                We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our service. You can control cookie settings through your browser preferences. Essential cookies required for service functionality cannot be disabled.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">9. Children's Privacy</h3>
              <p className="text-gray-700 leading-relaxed">
                Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have collected such information, we will take steps to delete it promptly.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">10. Changes to This Privacy Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website and, where appropriate, sending you an email notification.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">11. Contact Information</h3>
              <p className="text-gray-700 leading-relaxed">
                If you have any questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="mt-2 text-gray-700">
                <p>Email: privacy@legalai.com</p>
                <p>Data Protection Officer: dpo@legalai.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: San Francisco, CA</p>
              </div>
            </section>

            <section className="border-t pt-4">
              <p className="text-xs text-gray-500">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}