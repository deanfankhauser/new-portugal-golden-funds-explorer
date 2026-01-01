import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { COMPANY_INFO } from '../config/company';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="privacy" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Effective Date: January 1, 2026</p>

          {/* 1. Overview */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Overview</h2>
            <p className="text-gray-700 mb-3">
              This Privacy Policy explains how {COMPANY_INFO.legalName}, trading as {COMPANY_INFO.tradingName} 
              ("we", "us", "our"), collects, uses, stores, and protects your personal information when you 
              use our website at {COMPANY_INFO.website} (the "Site").
            </p>
            <p className="text-gray-700">
              By using the Site, you consent to the collection and use of your information as described in 
              this policy. If you do not agree, please do not use the Site.
            </p>
          </section>

          {/* 2. Information We Collect */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
            <p className="text-gray-700 mb-3">We may collect the following types of information:</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number, and other contact 
                details you provide when submitting enquiries, subscribing to newsletters, or creating an account.
              </li>
              <li>
                <strong>Enquiry Information:</strong> Details about your investment interests, preferred 
                investment amounts, and messages you send through our enquiry forms.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with the Site, including 
                pages visited, links clicked, time spent on pages, and navigation patterns.
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating system, IP address, device 
                identifiers, and similar technical information.
              </li>
              <li>
                <strong>Cookies and Tracking:</strong> We use cookies and similar technologies to enhance 
                your experience and gather analytics data. See Section 6 for details.
              </li>
            </ul>
          </section>

          {/* 3. How We Use Your Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-3">We use the information we collect to:</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Provide, operate, and improve the Site and our services</li>
              <li>Respond to your enquiries and facilitate introductions to fund managers</li>
              <li>Send you newsletters, updates, and marketing communications (where you have consented)</li>
              <li>Personalise your experience and show relevant content</li>
              <li>Analyse usage patterns to improve Site functionality and user experience</li>
              <li>Detect, prevent, and address technical issues or fraudulent activity</li>
              <li>Comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          {/* 4. Sharing Your Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Sharing Your Information</h2>
            <p className="text-gray-700 mb-3">
              We do not sell or rent your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>
                <strong>Fund Managers and Partners:</strong> When you submit an enquiry about a fund, we 
                share your contact details and enquiry information with the relevant fund manager or their 
                representatives to facilitate your request.
              </li>
              <li>
                <strong>Service Providers:</strong> Trusted third parties who assist us in operating the 
                Site, including hosting, analytics, email delivery, and customer support services.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law, regulation, legal process, or 
                government request, or to protect our rights, safety, or property.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of 
                assets, your information may be transferred to the acquiring entity.
              </li>
            </ul>
          </section>

          {/* 5. Data Security */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Security</h2>
            <p className="text-gray-700 mb-3">
              We implement reasonable technical and organisational measures to protect your personal 
              information from unauthorised access, loss, misuse, or alteration. These include encryption, 
              secure servers, and access controls.
            </p>
            <p className="text-gray-700">
              However, no method of transmission over the internet or electronic storage is completely 
              secure. We cannot guarantee absolute security, and you provide information at your own risk.
            </p>
          </section>

          {/* 6. Cookies and Tracking Technologies */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-3">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Understand how you use the Site</li>
              <li>Analyse traffic and usage patterns</li>
              <li>Deliver relevant content and, where applicable, advertising</li>
            </ul>
            <p className="text-gray-700 mt-3">
              You can control cookies through your browser settings. Disabling cookies may affect Site 
              functionality.
            </p>
          </section>

          {/* 7. Your Rights */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Your Rights</h2>
            <p className="text-gray-700 mb-3">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal obligations</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format (where applicable)</li>
            </ul>
            <p className="text-gray-700 mt-3">
              To exercise these rights, contact us at{' '}
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-accent hover:underline">
                {COMPANY_INFO.email}
              </a>.
            </p>
          </section>

          {/* 8. Data Retention */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Data Retention</h2>
            <p className="text-gray-700">
              We retain your personal information for as long as necessary to fulfil the purposes described 
              in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. 
              When information is no longer needed, we securely delete or anonymise it.
            </p>
          </section>

          {/* 9. Third-Party Links */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Third-Party Links</h2>
            <p className="text-gray-700">
              The Site may contain links to third-party websites, including fund manager websites. We are 
              not responsible for the privacy practices of these external sites. We encourage you to review 
              their privacy policies before providing any personal information.
            </p>
          </section>

          {/* 10. International Transfers */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">10. International Transfers</h2>
            <p className="text-gray-700">
              Your information may be transferred to and processed in countries other than your country of 
              residence, including Australia and other jurisdictions where our service providers operate. 
              These countries may have different data protection laws. By using the Site, you consent to 
              such transfers.
            </p>
          </section>

          {/* 11. Children's Privacy */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">11. Children's Privacy</h2>
            <p className="text-gray-700">
              The Site is not intended for individuals under 18 years of age. We do not knowingly collect 
              personal information from children. If you believe we have collected information from a child, 
              please contact us immediately.
            </p>
          </section>

          {/* 12. Changes to This Policy */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">12. Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with 
              an updated effective date. Your continued use of the Site after changes are posted constitutes 
              acceptance of the updated policy. We encourage you to review this page periodically.
            </p>
          </section>

          {/* 13. About the Operator */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">13. About the Operator</h2>
            <p className="text-gray-700 mb-3">
              {COMPANY_INFO.tradingName} is operated by:
            </p>
            <address className="text-gray-700 not-italic mb-3">
              <strong>{COMPANY_INFO.legalName}</strong><br />
              Trading as {COMPANY_INFO.tradingName}<br />
              {COMPANY_INFO.address.city}, {COMPANY_INFO.address.suburb}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.postcode}, {COMPANY_INFO.address.country}
            </address>
            <p className="text-gray-700 mb-3">
              {COMPANY_INFO.tradingName} is part of{' '}
              <a 
                href="https://group.movingto.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                Movingto Group
              </a>.
            </p>
            <p className="text-gray-700">
              For privacy-related enquiries, contact us at{' '}
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-accent hover:underline">
                {COMPANY_INFO.email}
              </a>.
            </p>
          </section>

          {/* 14. Governing Law */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">14. Governing Law</h2>
            <p className="text-gray-700">
              This Privacy Policy is governed by the laws of Victoria, Australia. Any disputes relating to 
              this policy shall be subject to the exclusive jurisdiction of the courts of Victoria, Australia.
            </p>
          </section>

          {/* Related Links */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Policies</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/disclaimer" className="text-accent hover:underline">
                  Disclaimer and Disclosures
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
