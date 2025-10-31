"use client";

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Contact Us
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Have questions or need help? We’re here for you. Reach out to us
          anytime using the details below.
        </p>

        <div className="space-y-4 text-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Phone</h2>
            <p className="text-gray-600">+91 8506097730</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Email</h2>
            <p className="text-gray-600">Manoj.asharma2016@gmail.com</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700">Address</h2>
            <p className="text-gray-600">
              Unit No. 831, 8th Floor, JMD MEGAPOLIS, Sector 48, Gurugram, Haryana 122018 <br />
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Business Hours
          </h2>
          <p className="text-gray-600">Monday – Saturday: 9:00 AM – 7:00 PM</p>
          <p className="text-gray-600">Sunday: Closed</p>
        </div>

        <div className="mt-10 text-center">
          <a
            href="mailto:Manoj.asharma2016@gmail.com"
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Send us an Email
          </a>
        </div>
      </div>
    </div>
  );
}
