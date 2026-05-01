import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-3xl mx-auto px-5 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/40 mb-12">Last updated: January 2026</p>

        <div className="space-y-8 text-sm text-white/60 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold mb-3">1. Introduction</h2>
            <p>
              At ValiSearch, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">2. Information We Collect</h2>
            <p className="space-y-2">
              <p>We collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-white">Account information:</strong> Email address and authentication data when you create an account</li>
                <li><strong className="text-white">Usage data:</strong> How you interact with our service</li>
                <li><strong className="text-white">Payment information:</strong> Processed securely through our payment providers</li>
                <li><strong className="text-white">Ideas and content:</strong> Startup concepts you submit for analysis</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">3. How We Use Your Information</h2>
            <p className="space-y-2">
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide and improve our services</li>
                <li>Process your payments and deduct credits</li>
                <li>Send important account notifications</li>
                <li>Respond to your inquiries and support requests</li>
                <li>Analyze usage patterns to improve user experience</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">4. Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share data with service providers who assist in operating our platform (e.g., payment processors, cloud hosting). All such parties are bound by confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data, including encryption in transit and at rest, regular security assessments, and access controls. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">6. Cookies and Tracking</h2>
            <p>
              We use cookies to maintain your session and improve your experience. You can disable cookies in your browser settings, but this may affect functionality.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">7. Your Rights</h2>
            <p className="space-y-2">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your account and data</li>
                <li>Export your data in a portable format</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">8. Data Retention</h2>
            <p>
              We retain your account information for as long as your account is active. You can request deletion at any time. Analysis data is retained for 2 years after last activity, unless you request earlier deletion.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">9. Children's Privacy</h2>
            <p>
              Our service is not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected from a child, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">10. Third-Party Links</h2>
            <p>
              Our service may contain links to third-party websites. We are not responsible for their privacy practices. We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">11. Changes to This Policy</h2>
            <p>
              We may update this policy periodically. We will notify you of material changes via email or in-app notification at least 30 days before they take effect.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">12. Contact Us</h2>
            <p>
              For questions about this Privacy Policy, please contact us at support@valisearch.app
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06]">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}