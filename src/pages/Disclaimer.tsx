import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PageSEO pageType="disclaimer" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Legal Disclaimer</h1>
          
          <p className="text-sm text-muted-foreground mb-6">
            <strong>Effective Date:</strong> 23rd August, 2025
          </p>

          <p className="mb-6">
            This website, including the domain funds.movingto.com (the "Site"), is owned and operated by Moving To Global Pte Ltd, 
            a company incorporated in Singapore ("we," "our," "us").
          </p>

          <p className="mb-6">
            By accessing or using this Site, you acknowledge and agree to the terms of this disclaimer. 
            If you do not agree, you must immediately stop using the Site.
          </p>

          <h2 className="text-xl font-semibold mb-4">1. No Financial or Legal Advice</h2>
          <p className="mb-4">
            The information provided on this Site is for general informational purposes only. It does not constitute:
          </p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Financial advice</li>
            <li>Investment advice</li>
            <li>Legal advice</li>
            <li>Tax advice</li>
            <li>A recommendation, solicitation, or offer to invest in any product or service</li>
          </ul>
          <p className="mb-6">
            You should not rely on the information on this Site as a substitute for professional advice. 
            Always consult a qualified financial advisor, legal advisor, or tax professional before making any decision related to investments, visas, or residency.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Accuracy of Information</h2>
          <p className="mb-4">We strive to ensure that the information presented is accurate and up to date. However, we:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Make no guarantees or warranties as to the completeness, accuracy, reliability, suitability, or availability of any content.</li>
            <li>May update, change, or remove content at any time without notice.</li>
            <li>Are not responsible for errors, omissions, outdated information, or third-party data inaccuracies.</li>
          </ul>
          <p className="mb-6">
            All information is provided on an "as is" basis without any warranties of any kind, express or implied.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. No Endorsement or Affiliation</h2>
          <p className="mb-4">The listing of funds, managers, service providers, or any third-party content on this Site:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Does not imply endorsement, affiliation, partnership, or recommendation.</li>
            <li>Is provided for reference only.</li>
            <li>Does not mean we have independently verified the claims, performance, or legality of such entities.</li>
          </ul>
          <p className="mb-6">You are solely responsible for conducting your own due diligence.</p>

          <h2 className="text-xl font-semibold mb-4">4. Limitation of Liability</h2>
          <p className="mb-4">
            To the fullest extent permitted by law, Moving To Global Pte Ltd and its directors, officers, employees, and agents 
            shall not be liable for any direct, indirect, incidental, consequential, or special damages, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Loss of profits, revenue, or savings</li>
            <li>Investment losses</li>
            <li>Business interruption</li>
            <li>Reputational harm</li>
            <li>Data loss</li>
            <li>Legal or regulatory consequences</li>
          </ul>
          <p className="mb-6">arising from or in connection with:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Your use of the Site</li>
            <li>Reliance on any information provided herein</li>
            <li>Interactions with any third-party fund, service provider, or platform referenced</li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">5. Third-Party Links</h2>
          <p className="mb-6">
            This Site may contain links to third-party websites. We have no control over the content, practices, or accuracy of third-party sites. 
            Accessing third-party websites is at your own risk.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Regulatory Status</h2>
          <p className="mb-4">
            Moving To Global Pte Ltd is not licensed as a financial institution, financial adviser, investment adviser, or broker-dealer 
            under the laws of Singapore or any other jurisdiction.
          </p>
          <p className="mb-6">Nothing on this Site should be construed as regulated financial activity.</p>

          <h2 className="text-xl font-semibold mb-4">7. Governing Law & Jurisdiction</h2>
          <p className="mb-4">
            This disclaimer and any disputes arising out of or in connection with it shall be governed by the laws of Singapore.
          </p>
          <p className="mb-6">
            By using this Site, you submit to the exclusive jurisdiction of the courts of Singapore.
          </p>

          <h2 className="text-xl font-semibold mb-4">8. Changes to This Disclaimer</h2>
          <p className="mb-6">
            We reserve the right to modify this disclaimer at any time. Updated versions will be posted on this page with the revised effective date.
          </p>

          <h2 className="text-xl font-semibold mb-4">9. Contact</h2>
          <p className="mb-4">For any questions regarding this disclaimer, please contact:</p>
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Moving To Global Pte Ltd</p>
            <p>160 Robinson Road, #14-04</p>
            <p>Singapore Business Federation Center</p>
            <p>Singapore 068914</p>
            <p>Singapore</p>
            <p className="mt-2">
              <strong>Email:</strong> <a href="mailto:info@movingto.com" className="text-primary hover:underline">info@movingto.com</a>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;
