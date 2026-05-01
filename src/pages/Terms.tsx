import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-white/40 mb-12">Last updated: January 2026</p>

        <div className="space-y-8 text-sm text-white/60 leading-relaxed">
          <section>
            <h2 className="text-white font-semibold mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using ValiSearch, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">2. Description of Service</h2>
            <p>
              ValiSearch provides AI-powered startup validation and analysis tools. We reserve the right to modify or discontinue the service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">3. User Accounts</h2>
            <p className="space-y-2">
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">4. Credits and Payments</h2>
            <p className="space-y-2">
              <p>ValiSearch uses a credit-based system:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Each analysis consumes 1-2 credits depending on type</li>
                <li>Credits are non-refundable unless required by law</li>
                <li>Pricing is subject to change with 30 days notice</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">5. Intellectual Property</h2>
            <p>
              All content, features, and functionality are owned by ValiSearch and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">6. User Content</h2>
            <p>
              You retain ownership of content you submit to ValiSearch. By submitting content, you grant us a license to use, modify, and display it as necessary to provide our service.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">7. Prohibited Use</h2>
            <p className="space-y-2">
              <p>You may not use our service to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Submit false or misleading information</li>
              </ul>
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">8. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">9. Limitation of Liability</h2>
            <p>
              VALISEARCH SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE PAST 12 MONTHS.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">10. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless ValiSearch from any claims, damages, losses, or expenses arising from your use of the service or violation of these terms.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">11. Termination</h2>
            <p>
              We may terminate your access to the service at any time for any reason. Upon termination, your right to use the service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">12. Governing Law</h2>
            <p>
              These terms shall be governed by the laws of the jurisdiction in which ValiSearch operates, without regard to conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-white font-semibold mb-3">13. Contact Information</h2>
            <p>
              For questions about these terms, please contact us at support@valisearch.app
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