import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLanguage } from '@/hooks/useLanguage'

interface TermsModalProps {
  children: React.ReactNode
}

export function TermsModal({ children }: TermsModalProps) {
  const { t } = useLanguage()

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using LegalAI's contract analysis platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">2. Service Description</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                LegalAI provides AI-powered legal contract analysis, risk assessment, translation services, and contract generation tools. Our services include:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Automated contract analysis and risk scoring</li>
                <li>Multilingual translation across 11 supported languages</li>
                <li>Contract generation and template services</li>
                <li>Digital signature tools and document management</li>
                <li>Legal recommendations and clause suggestions</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. User Accounts and Responsibilities</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li>Provide accurate and complete information when creating an account</li>
                <li>Maintain the security of your login credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>Use the service only for lawful purposes and in accordance with these terms</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Payment Terms and Billing</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Our pricing structure includes subscription plans and pay-per-use options:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                <li><strong>Basic Plan:</strong> $5 USD/month for unlimited contract analysis</li>
                <li><strong>AI+ Plan:</strong> $15 USD/month with advanced features and 5 included contract generations</li>
                <li><strong>Team Plan:</strong> $40 USD/month with collaboration tools and 10 included contract generations</li>
                <li><strong>Unlimited Plan:</strong> $100 USD/month with unlimited contract generation</li>
                <li><strong>Pay-per-use:</strong> $1 USD per document analysis for non-subscribers</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                All payments are processed securely through Stripe. Subscriptions automatically renew unless cancelled. Refunds are provided in accordance with our refund policy.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Intellectual Property Rights</h3>
              <p className="text-gray-700 leading-relaxed">
                Users retain ownership of their uploaded contracts and generated documents. LegalAI retains ownership of its proprietary AI technology, algorithms, and platform. Users grant LegalAI a limited license to process their documents for the purpose of providing the requested services.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Data Privacy and Security</h3>
              <p className="text-gray-700 leading-relaxed">
                We implement bank-level security measures including end-to-end encryption, SOC2 compliance, and secure data processing. User documents are processed securely and are not shared with third parties except as necessary to provide our services. For detailed information, please refer to our Privacy Policy.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">7. Limitation of Liability</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                <strong>IMPORTANT LEGAL DISCLAIMER:</strong> LegalAI provides AI-powered analysis tools for informational purposes only. Our service does not constitute legal advice, and users should always consult with qualified legal professionals for specific legal matters.
              </p>
              <p className="text-gray-700 leading-relaxed">
                LegalAI's liability is limited to the amount paid for the service in the preceding 12 months. We are not liable for any indirect, incidental, special, or consequential damages arising from the use of our service.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">8. Service Availability and Modifications</h3>
              <p className="text-gray-700 leading-relaxed">
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted service availability. We reserve the right to modify, suspend, or discontinue any aspect of the service with reasonable notice to users.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">9. Termination</h3>
              <p className="text-gray-700 leading-relaxed">
                Either party may terminate this agreement at any time. Users may cancel their subscription through their account settings. Upon termination, access to the service will cease, but previously generated documents remain accessible for download for 30 days.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">10. Governing Law and Jurisdiction</h3>
              <p className="text-gray-700 leading-relaxed">
                These terms are governed by the laws of the jurisdiction where LegalAI is incorporated. Any disputes will be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">11. Contact Information</h3>
              <p className="text-gray-700 leading-relaxed">
                For questions about these terms or our service, please contact us at:
              </p>
              <div className="mt-2 text-gray-700">
                <p>Email: support@legalai.com</p>
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