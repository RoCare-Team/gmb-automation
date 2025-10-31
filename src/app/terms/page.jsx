"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 py-10 px-6 flex flex-col items-center">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-4 text-center">
          Terms & Conditions
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Effective Date: 31 October 2025
        </p>

        {/* INTRODUCTION */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            1. Introduction
          </h2>
          <p>
            Welcome to our SaaS Platform (“we”, “our”, “us”). By accessing or
            using our services, website, or mobile applications, you agree to
            comply with and be bound by these Terms and Conditions. If you do
            not agree, please discontinue using our services immediately.
          </p>
        </section>

        {/* SERVICES */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            2. Services
          </h2>
          <p>
            Our SaaS platform provides AI-powered automation tools and digital
            solutions for business management and analytics. These services are
            offered on a subscription or usage basis as per the plan selected by
            the customer.
          </p>
        </section>

        {/* ACCOUNT */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            3. User Account
          </h2>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and all activities under your account. We
            reserve the right to suspend or terminate accounts that violate our
            terms or engage in fraudulent activity.
          </p>
        </section>

        {/* PAYMENTS */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            4. Payments and Billing
          </h2>
          <p>
            Payments for our services are securely processed through{" "}
            <strong>Razorpay</strong>. By completing a payment, you authorize
            Razorpay to debit your account for the selected plan or service. We
            do not store or have access to your credit/debit card details.
          </p>
          <p className="mt-2">
            For Razorpay’s terms, visit{" "}
            <a
              href="https://razorpay.com/terms/"
              target="_blank"
              className="text-blue-600 underline"
            >
              https://razorpay.com/terms/
            </a>
          </p>
        </section>

        {/* REFUND POLICY */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            5. Refund & Cancellation Policy
          </h2>
          <p>
            All payments made towards subscription or service activation are
            final and non-refundable. In case of duplicate charges or
            transaction errors, please contact our support team within 7 working
            days for review and resolution.
          </p>
        </section>

        {/* INTELLECTUAL PROPERTY */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            6. Intellectual Property
          </h2>
          <p>
            All content, trademarks, software, and data available on our SaaS
            platform are owned by or licensed to us. Users are not allowed to
            copy, modify, distribute, or use any part of our platform without
            prior written permission.
          </p>
        </section>

        {/* LIMITATION OF LIABILITY */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            7. Limitation of Liability
          </h2>
          <p>
            We strive to provide uninterrupted services but do not guarantee
            error-free or continuous operation. We are not liable for any loss
            of profits, data, or indirect damages resulting from the use of our
            services.
          </p>
        </section>

        {/* TERMINATION */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            8. Termination of Service
          </h2>
          <p>
            We reserve the right to suspend or terminate user accounts that
            violate these terms or misuse our platform. Upon termination, your
            access to all paid features will be revoked.
          </p>
        </section>

        {/* GOVERNING LAW */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            9. Governing Law
          </h2>
          <p>
            These Terms and Conditions shall be governed by and construed in
            accordance with the laws of India. Any disputes will be subject to
            the exclusive jurisdiction of courts located in New Delhi, India.
          </p>
        </section>

        {/* CONTACT DETAILS */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            10. Contact Us
          </h2>
          <p>
            For any questions or concerns regarding these Terms & Conditions,
            please contact us:
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
                http://limbu.ai/contact
              </a>
            </p>
          </div>
        </section>

        {/* CONSENT */}
        <section className="mt-8 border-t pt-4 text-sm text-gray-600">
          <p>
            By using our SaaS platform and making payments through Razorpay, you
            acknowledge that you have read, understood, and agreed to these
            Terms & Conditions.
          </p>
          <p className="mt-2 text-center text-gray-500">
            © {new Date().getFullYear()} Your SaaS Platform. All rights reserved.
          </p>
        </section>
      </div>
    </div>
  );
}
