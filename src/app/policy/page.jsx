"use client";

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
          Privacy Policy & Terms of Service
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Effective Date: 31 October 2025
        </p>

        {/* INTRO */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            1. Introduction
          </h2>
          <p>
            Welcome to our SaaS Platform (“we”, “our”, “us”). We value your
            privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and safeguard your
            data when you use our services, including any payments made through
            Razorpay.
          </p>
        </section>

        {/* INFORMATION COLLECTION */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            2. Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Personal details such as name, email, phone number, and address.</li>
            <li>Billing and payment details when you make payments via Razorpay.</li>
            <li>Usage data like IP address, browser type, and device information.</li>
          </ul>
        </section>

        {/* USAGE */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            3. How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To provide and manage our SaaS platform services.</li>
            <li>To process secure online payments via Razorpay.</li>
            <li>To send updates, invoices, and important account information.</li>
            <li>To improve our services and customer experience.</li>
          </ul>
        </section>

        {/* PAYMENT SECURITY */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            4. Payment and Security
          </h2>
          <p>
            All payments are processed securely through{" "}
            <strong>Razorpay</strong>. We do not store your card or bank details
            on our servers. Razorpay’s secure gateway encrypts your sensitive
            information using SSL encryption and PCI DSS compliance.
          </p>
          <p className="mt-2">
            For Razorpay’s privacy policy, visit:{" "}
            <a
              href="https://razorpay.com/privacy/"
              target="_blank"
              className="text-blue-600 underline"
            >
              https://razorpay.com/privacy/
            </a>
          </p>
        </section>

        {/* REFUND POLICY */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            5. Refund & Cancellation Policy
          </h2>
          <p>
            Payments made for our SaaS platform are non-refundable once the
            service has been activated. In case of duplicate transactions or
            billing errors, please contact our support team within 7 working
            days for resolution.
          </p>
        </section>

        {/* DATA SECURITY */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            6. Data Protection
          </h2>
          <p>
            We follow industry-standard practices to protect your personal
            information from unauthorized access, alteration, or disclosure.
            However, no online platform can guarantee 100% security.
          </p>
        </section>

        {/* THIRD PARTY */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            7. Third-Party Services
          </h2>
          <p>
            Our SaaS platform may contain links or integrations to third-party
            services such as Razorpay, Google APIs, or analytics tools. We are
            not responsible for their content or privacy practices.
          </p>
        </section>

        {/* CONTACT */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            8. Contact Information
          </h2>
          <p>
            If you have any questions about our Privacy Policy or Razorpay
            verification, please contact us:
          </p>

          <div className="mt-3 space-y-1">
            <p>
              📧 <strong>Email:</strong> info@limbo.ai.com
            </p>
            <p>
              📞 <strong>Phone:</strong> 8506097730
            </p>
            <p>
              🌐 <strong>Website:</strong>{" "}
              <a
                href="https://yourdomain.com"
                target="_blank"
                className="text-blue-600 underline"
              >
                https://limbu.ai
              </a>
            </p>
          </div>
        </section>

        {/* CONSENT */}
        <section className="mt-8 border-t pt-4 text-sm text-gray-600">
          <p>
            By using our SaaS platform and making payments through Razorpay, you
            consent to our Privacy Policy and Terms of Service.
          </p>
          <p className="mt-2 text-center text-gray-500">
            © {new Date().getFullYear()} Your SaaS Platform. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  );
}
