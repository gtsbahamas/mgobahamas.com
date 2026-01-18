import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Mobile Go Bahamas",
  description: "Privacy Policy for Mobile Go Bahamas app and services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-r from-[#7cb342] to-[#558b2f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/90">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 prose prose-gray max-w-none">
            <h2>Introduction</h2>
            <p>
              Mobile Go Bahamas (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), operated by Connectiva Ltd & OSA Enterprises Ltd, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </p>

            <h2>Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect personal information that you voluntarily provide to us when you:</p>
            <ul>
              <li>Register for an account</li>
              <li>Make a purchase or transaction</li>
              <li>Contact us for support</li>
              <li>Sign up for our merchant program</li>
            </ul>
            <p>This information may include:</p>
            <ul>
              <li>Name and contact information (email, phone number)</li>
              <li>Billing and payment information</li>
              <li>Transaction history</li>
              <li>Device and usage information</li>
            </ul>

            <h3>Automatically Collected Information</h3>
            <p>
              When you use our app, we may automatically collect certain information about your device, including information about your mobile device, operating system, and app usage patterns.
            </p>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process transactions and send related information</li>
              <li>Provide customer support and respond to inquiries</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Improve our app and services</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>We may share your information with:</p>
            <ul>
              <li><strong>Service Providers:</strong> Third-party vendors who assist in providing our services (payment processors, mobile carriers)</li>
              <li><strong>Business Partners:</strong> Mobile carriers (Aliv, BTC, Digicel, Natcom) for topup services</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
            <p>We do not sell your personal information to third parties.</p>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent where applicable</li>
            </ul>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Our services are not intended for children under 18 years of age. We do not knowingly collect personal information from children.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>

            <h2>Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:info@mgobahamas.com" className="text-[#7cb342]">info@mgobahamas.com</a></li>
              <li><strong>Address:</strong> Les Fountains Plaza, E Sunrise Highway, Freeport, Grand Bahama, Bahamas</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
