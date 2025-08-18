import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="privacy" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Privacy Policy - Portugal Golden Visa Investment Fund Platform</h1>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Portugal Golden Visa Investment Fund Platform Privacy</h2>
            <p className="text-gray-700">
              Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you use our website.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li><strong>Personal Information:</strong> We may collect your name, email address, and contact details when you subscribe to our newsletter or contact us.</li>
              <li><strong>Usage Data:</strong> We collect information about how you use our website, including pages visited, links clicked, and other actions taken.</li>
              <li><strong>Cookies:</strong> We use cookies to enhance your experience and gather data about website traffic and usage.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc pl-5 text-gray-700">
              <li>To provide and improve our services.</li>
              <li>To personalize your experience.</li>
              <li>To send you newsletters and updates (if you have subscribed).</li>
              <li>To analyze website usage and trends.</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Sharing</h2>
            <p className="text-gray-700">
              We do not sell or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website and providing our services.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Security</h2>
            <p className="text-gray-700">
              We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Your Rights</h2>
            <p className="text-gray-700">
              You have the right to access, correct, or delete your personal information. You may also unsubscribe from our newsletter at any time.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Contact Us</h2>
            <p className="text-gray-700">
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:info@movingto.com">info@movingto.com</a>.
            </p>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
