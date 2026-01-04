import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { COMPANY_INFO } from '../config/company';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="cookie-policy" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Cookie Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Effective Date: January 1, 2026</p>

          {/* 1. Introduction */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
            <p className="text-gray-700 mb-3">
              This Cookie Policy explains how {COMPANY_INFO.legalName}, trading as {COMPANY_INFO.tradingName} 
              ("we", "us", "our"), uses cookies and similar tracking technologies when you visit our website 
              at {COMPANY_INFO.website} (the "Site").
            </p>
            <p className="text-gray-700">
              By continuing to use the Site, you consent to the use of cookies as described in this policy. 
              You can manage your cookie preferences at any time using the methods described below.
            </p>
          </section>

          {/* 2. What Are Cookies */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. What Are Cookies?</h2>
            <p className="text-gray-700 mb-3">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) 
              when you visit a website. They are widely used to make websites work more efficiently, provide 
              a better user experience, and give website owners useful information about how visitors use their site.
            </p>
            <p className="text-gray-700">
              Cookies can be "persistent" (remaining on your device until deleted) or "session" cookies 
              (deleted when you close your browser).
            </p>
          </section>

          {/* 3. Types of Cookies We Use */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Types of Cookies We Use</h2>
            <p className="text-gray-700 mb-3">We use the following categories of cookies:</p>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Essential Cookies</h3>
                <p className="text-gray-700 text-sm">
                  These cookies are necessary for the Site to function properly. They enable core functionality 
                  such as security, network management, and account authentication. You cannot opt out of 
                  these cookies as the Site would not function without them.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Analytics Cookies</h3>
                <p className="text-gray-700 text-sm">
                  We use analytics cookies to understand how visitors interact with the Site. These cookies 
                  help us measure traffic, identify popular pages, and improve Site performance. We use 
                  services like Google Analytics to collect this information in an aggregated, anonymous form.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Functionality Cookies</h3>
                <p className="text-gray-700 text-sm">
                  These cookies remember your preferences and choices to provide a more personalised experience. 
                  For example, they may remember your recently viewed funds, saved searches, or display preferences.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Marketing Cookies</h3>
                <p className="text-gray-700 text-sm">
                  We may use marketing cookies to deliver relevant advertisements and track the effectiveness 
                  of our marketing campaigns. These cookies may be set by third-party advertising partners 
                  and can track your browsing activity across different websites.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Specific Cookies We Use */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Specific Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-800">Cookie Name</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-800">Purpose</th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-800">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-2 text-gray-700">sb-*-auth-token</td>
                    <td className="px-4 py-2 text-gray-700">Authentication session management (Supabase)</td>
                    <td className="px-4 py-2 text-gray-700">Session</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-700">_ga, _gid</td>
                    <td className="px-4 py-2 text-gray-700">Google Analytics - visitor tracking and session management</td>
                    <td className="px-4 py-2 text-gray-700">2 years / 24 hours</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-700">recently_viewed</td>
                    <td className="px-4 py-2 text-gray-700">Stores your recently viewed funds for quick access</td>
                    <td className="px-4 py-2 text-gray-700">30 days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-gray-700">shortlist</td>
                    <td className="px-4 py-2 text-gray-700">Stores your saved/shortlisted funds</td>
                    <td className="px-4 py-2 text-gray-700">Persistent</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. Third-Party Cookies */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-3">
              Some cookies on our Site are set by third-party services. These include:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>
                <strong>Google Analytics:</strong> Provides anonymous analytics data about Site usage. 
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  Google's Privacy Policy
                </a>
              </li>
              <li>
                <strong>Supabase:</strong> Powers our authentication and database services. 
                <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  Supabase Privacy Policy
                </a>
              </li>
              <li>
                <strong>Fillout:</strong> Used for forms and data collection. 
                <a href="https://www.fillout.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  Fillout Privacy Policy
                </a>
              </li>
            </ul>
            <p className="text-gray-700 mt-3">
              We do not control cookies set by third parties. Please refer to their respective privacy 
              policies for more information about how they use cookies.
            </p>
          </section>

          {/* 6. Managing Your Cookie Preferences */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Managing Your Cookie Preferences</h2>
            <p className="text-gray-700 mb-3">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-2">
              <li>
                <strong>Browser Settings:</strong> Most browsers allow you to refuse or delete cookies 
                through their settings. The method varies by browser:
                <ul className="list-circle pl-5 mt-2 space-y-1">
                  <li>Chrome: Settings → Privacy and Security → Cookies</li>
                  <li>Firefox: Settings → Privacy & Security → Cookies</li>
                  <li>Safari: Preferences → Privacy → Manage Website Data</li>
                  <li>Edge: Settings → Cookies and Site Permissions</li>
                </ul>
              </li>
              <li>
                <strong>Google Analytics Opt-Out:</strong> Install the 
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
              <li>
                <strong>Do Not Track:</strong> We respect "Do Not Track" browser settings where technically feasible.
              </li>
            </ul>
            <p className="text-gray-700 mt-3">
              Please note that disabling certain cookies may affect the functionality of the Site and 
              your user experience.
            </p>
          </section>

          {/* 7. Local Storage */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Local Storage</h2>
            <p className="text-gray-700">
              In addition to cookies, we use browser local storage to save your preferences and enhance 
              your experience. Local storage works similarly to cookies but allows for larger amounts of 
              data to be stored. You can clear local storage through your browser's developer tools or 
              settings. We use local storage to remember your recently viewed funds, comparison selections, 
              and display preferences.
            </p>
          </section>

          {/* 8. Updates to This Policy */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Updates to This Policy</h2>
            <p className="text-gray-700">
              We may update this Cookie Policy from time to time to reflect changes in our practices or 
              for legal, operational, or regulatory reasons. When we make significant changes, we will 
              update the "Effective Date" at the top of this policy. We encourage you to review this 
              policy periodically to stay informed about our use of cookies.
            </p>
          </section>

          {/* 9. Contact Us */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact Us</h2>
            <p className="text-gray-700 mb-3">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us at:
            </p>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700">{COMPANY_INFO.legalName}</p>
              <p className="text-gray-700">{COMPANY_INFO.address.city}, {COMPANY_INFO.address.suburb}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.postcode}</p>
              <p className="text-gray-700">{COMPANY_INFO.address.country}</p>
              <p className="text-gray-700 mt-2">
                Email: <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary hover:underline">{COMPANY_INFO.email}</a>
              </p>
            </div>
          </section>

          {/* Related Links */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Related Policies</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;
