import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="disclaimer" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Link to Main Hub */}
        <div className="mb-8 text-center">
          <a 
            href="https://www.movingto.com/portugal-golden-visa-funds" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
          >
            Browse All Portugal Golden Visa Funds
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
        
        <div className="bg-card p-6 rounded-lg shadow-md max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Legal Disclaimer</h1>
          
          <p className="text-sm text-muted-foreground mb-6">
            <strong>Effective Date:</strong> 23rd August, 2025
          </p>

          <p className="mb-6">
            This website, including the domain funds.movingto.com (the "Site"), is owned and operated by Moving To Global Pty Ltd, 
            a company incorporated in Australia ("we," "our," "us").
          </p>

          <p className="mb-6">
            By accessing or using this Site, you agree to the terms of this disclaimer. If you do not agree, you must immediately stop using the Site.
          </p>

          <h2 className="text-xl font-semibold mb-4">1. No Financial, Legal, or Tax Advice</h2>
          <p className="mb-4">
            All information on this Site is provided for general informational purposes only. It does not constitute:
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
            Always consult a qualified financial, legal, or tax advisor before making any decision related to investments, visas, or residency.
          </p>

          <h2 className="text-xl font-semibold mb-4">2. Accuracy & Reliability of Information</h2>
          <p className="mb-4">We strive to keep content accurate and up to date, but we:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Make no warranties or representations as to the completeness, reliability, or accuracy of any information.</li>
            <li>May update, change, or remove content at any time without notice.</li>
            <li>Are not responsible for errors, omissions, outdated information, or third-party data inaccuracies.</li>
          </ul>
          <p className="mb-6">
            All content is provided on an "as is" and "as available" basis, without warranties of any kind, express or implied.
          </p>

          <h2 className="text-xl font-semibold mb-4">3. Past & Future Performance</h2>
          <p className="mb-6">
            Any references to fund performance, projections, or potential returns are illustrative only and do not guarantee future outcomes. Past performance is not indicative of future results.
          </p>

          <h2 className="text-xl font-semibold mb-4">4. No Endorsement or Verification</h2>
          <p className="mb-4">Listings of funds, managers, service providers, or other third-party content:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Do not imply endorsement, affiliation, partnership, or recommendation.</li>
            <li>Are provided strictly for reference.</li>
            <li>Have not been independently verified by us for accuracy, legality, or performance.</li>
          </ul>
          <p className="mb-6">You are solely responsible for conducting your own due diligence.</p>

          <h2 className="text-xl font-semibold mb-4">5. Compensation Disclosure</h2>
          <p className="mb-6">
            We may receive fees, commissions, or other compensation from third parties featured on or linked through this Site. 
            Such compensation does not constitute an endorsement or recommendation and does not influence the information provided.
          </p>

          <h2 className="text-xl font-semibold mb-4">6. Limitation of Liability</h2>
          <p className="mb-4">
            To the fullest extent permitted by law, Moving To Global Pty Ltd and its directors, officers, employees, and agents 
            shall not be liable for any direct, indirect, incidental, consequential, or special damages, including but not limited to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Loss of profits, revenue, or savings</li>
            <li>Investment or business losses</li>
            <li>Business interruption</li>
            <li>Data loss</li>
            <li>Reputational harm</li>
            <li>Legal, regulatory, or tax consequences</li>
          </ul>
          <p className="mb-6">arising out of or in connection with:</p>
          <ul className="list-disc pl-6 mb-6 space-y-1">
            <li>Your use of the Site</li>
            <li>Reliance on any information contained herein</li>
            <li>Interactions with any third-party fund, provider, or platform</li>
          </ul>
          <p className="mb-6">You assume full responsibility for any reliance placed on Site content.</p>

          <h2 className="text-xl font-semibold mb-4">7. Third-Party Websites</h2>
          <p className="mb-6">
            This Site may contain links to third-party websites. We have no control over their content, security, or practices. 
            Accessing such websites is at your own risk.
          </p>

          <h2 className="text-xl font-semibold mb-4">8. Regulatory Status</h2>
          <p className="mb-4">
            Moving To Global Pty Ltd is not licensed as a financial institution, financial adviser, investment adviser, or broker-dealer 
            under the laws of Australia or any other jurisdiction.
          </p>
          <p className="mb-4">
            Nothing on this Site should be construed as regulated financial activity or as creating any fiduciary duty on our part.
          </p>
          <p className="mb-6">
            We do not manage, operate, or custody any investments. All transactions are strictly between you and the relevant third-party provider.
          </p>

          <h2 className="text-xl font-semibold mb-4">9. Compliance With Local Laws</h2>
          <p className="mb-6">
            Access to this Site may be unlawful in certain jurisdictions. It is your responsibility to ensure that use of this Site 
            and reliance on its information complies with the laws applicable to you.
          </p>

          <h2 className="text-xl font-semibold mb-4">10. Data & Security</h2>
          <p className="mb-6">
            We do not warrant that the Site will be free from errors, viruses, or security vulnerabilities, and we disclaim liability 
            for any damages arising from such issues.
          </p>

          <h2 className="text-xl font-semibold mb-4">11. Governing Law & Jurisdiction</h2>
          <p className="mb-4">
            This disclaimer and any disputes arising in connection with it shall be governed by the laws of Victoria, Australia.
          </p>
          <p className="mb-6">
            By using this Site, you submit to the exclusive jurisdiction of the courts of Victoria, Australia, without prejudice to any 
            mandatory laws of your country of residence.
          </p>

          <h2 className="text-xl font-semibold mb-4">12. Changes to This Disclaimer</h2>
          <p className="mb-6">
            We may modify this disclaimer at any time. Updated versions will be posted on this page with the revised effective date.
          </p>

          <h2 className="text-xl font-semibold mb-4">13. Contact</h2>
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Moving To Global Pty Ltd</p>
            <p>Melbourne, Victoria</p>
            <p>Australia</p>
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
