import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { COMPANY_INFO } from '@/config/company';

const Disclaimer = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="disclaimer" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="bg-card p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Legal Disclaimer</h1>
          
          <p className="text-sm text-muted-foreground mb-8">
            <strong>Effective Date:</strong> 1st January, 2026
          </p>

          {/* 1. Overview */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Overview</h2>
            <p className="mb-4">
              This website, funds.movingto.com (the "Site"), is operated by {COMPANY_INFO.legalName}, 
              trading as {COMPANY_INFO.tradingName} ("we," "our," "us"). The Site provides information 
              and tools related to investment funds, including those that may be relevant to the Portugal 
              Golden Visa program.
            </p>
            <p className="mb-4">
              This page contains important legal disclosures that govern your use of the Site. By accessing 
              or using this Site, you agree to the terms of this disclaimer. If you do not agree, you must 
              immediately stop using the Site.
            </p>
          </section>

          {/* 2. No Advice / No Recommendations */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. No Advice / No Recommendations</h2>
            <p className="mb-4">
              {COMPANY_INFO.tradingName} provides information and tools only. We do <strong>NOT</strong> provide:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Financial advice</li>
              <li>Investment advice</li>
              <li>Legal advice</li>
              <li>Tax advice</li>
              <li>Immigration advice</li>
              <li>Accounting advice</li>
            </ul>
            <p className="mb-4">
              Nothing on this Site constitutes a recommendation to buy, sell, or hold any investment, or to 
              pursue any particular investment strategy or visa pathway. All information is for general 
              informational purposes only.
            </p>
            <p>
              You should always consult qualified professionals—including licensed financial advisers, 
              immigration lawyers, and tax accountants—before making any investment or visa-related decisions.
            </p>
          </section>

          {/* 3. Not an Offer / No Solicitation */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Not an Offer / No Solicitation</h2>
            <p className="mb-4">
              The content on this Site does not constitute an offer, solicitation, or invitation to invest 
              in any fund, product, or service. We do not solicit investments or act as an intermediary 
              for any securities transactions.
            </p>
            <p>
              Any investment transactions are conducted directly between you and the relevant fund manager 
              or service provider. We are not a party to any such transactions and have no responsibility 
              for their terms, execution, or outcomes.
            </p>
          </section>

          {/* 4. Commercial Relationships and Conflicts of Interest */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Commercial Relationships and Conflicts of Interest</h2>
            <p className="mb-4">
              We may receive commissions, referral fees, affiliate compensation, or other fees from third 
              parties, including fund managers, service providers, and partners. These fees may be triggered 
              when users enquire about funds, are introduced to providers, click on links, or proceed with 
              services via our Site.
            </p>
            <p className="mb-4 font-semibold">
              This means we are NOT independent.
            </p>
            <p>
              However, compensation does not guarantee coverage, verification status, ranking, placement, 
              or any particular outcome. Compensation arrangements do not change our stated methodology for 
              presenting information on the Site.
            </p>
          </section>

          {/* 5. Verification and Labels */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Verification and Labels</h2>
            <p className="mb-4">
              Where a fund displays a "Verified" label on this Site, this indicates that the fund has 
              completed our document-check process. This is a limited review of submitted documentation 
              conducted according to our <Link to="/verification-program" className="text-primary hover:underline">Verification Program</Link> methodology.
            </p>
            <p className="mb-4">
              <strong>"Verified" is NOT:</strong>
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Certification or accreditation</li>
              <li>Regulatory approval by any government authority</li>
              <li>An endorsement or recommendation</li>
              <li>A guarantee of fund performance or returns</li>
              <li>A legal determination of Portugal Golden Visa eligibility</li>
              <li>A guarantee that information is complete, accurate, or current</li>
            </ul>
            <p>
              Verification status may be revoked or changed at any time. You must conduct your own 
              due diligence regardless of any labels displayed on the Site.
            </p>
          </section>

          {/* 6. Portugal Golden Visa Eligibility */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Portugal Golden Visa Eligibility</h2>
            <p className="mb-4 font-semibold">
              We do NOT determine whether any fund is eligible for the Portugal Golden Visa.
            </p>
            <p className="mb-4">
              Golden Visa eligibility depends on multiple factors including current Portuguese law, 
              regulatory interpretation, fund structure and documentation, and your individual circumstances. 
              Laws and regulations change frequently; past eligibility does not guarantee future eligibility.
            </p>
            <p>
              Before investing for Golden Visa purposes, you must verify eligibility with qualified 
              professionals including immigration lawyers authorised in Portugal and the fund manager directly. 
              We accept no responsibility for any visa application outcomes.
            </p>
          </section>

          {/* 7. Accuracy, Third-Party Information, and Links */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Accuracy, Third-Party Information, and Links</h2>
            <p className="mb-4">
              Information on this Site may be incomplete, outdated, or incorrect. We make no warranties 
              or representations regarding the completeness, accuracy, reliability, or timeliness of any 
              information.
            </p>
            <p className="mb-4">
              Much of the information displayed is provided by third parties, including fund managers. 
              We do not independently verify third-party information and are not responsible for errors, 
              omissions, or misrepresentations in such content.
            </p>
            <p className="mb-4">
              This Site may contain links to third-party websites. We have no control over their content, 
              security, or practices. Accessing such websites is at your own risk.
            </p>
            <p>
              All content is provided on an "as is" and "as available" basis. You must conduct your own 
              due diligence before making any decisions based on information found on this Site.
            </p>
          </section>

          {/* 8. Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="mb-4">
              To the fullest extent permitted by law, {COMPANY_INFO.legalName} and its directors, officers, 
              employees, and agents shall not be liable for any direct, indirect, incidental, consequential, 
              special, or exemplary damages arising out of or in connection with your use of the Site.
            </p>
            <p className="mb-4">This includes, without limitation:</p>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              <li>Investment losses or diminution in value</li>
              <li>Visa application refusals or delays</li>
              <li>Loss of profits, revenue, or anticipated savings</li>
              <li>Business interruption</li>
              <li>Data loss or corruption</li>
              <li>Reputational harm</li>
              <li>Legal, regulatory, or tax consequences</li>
            </ul>
            <p className="mb-4 font-semibold">
              You use this Site at your own risk.
            </p>
            <p>
              In any event, our total liability to you for all claims arising from your use of the Site 
              shall not exceed the amount you have paid to us (if any) or AUD $100, whichever is less.
            </p>
          </section>

          {/* 9. Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Intellectual Property</h2>
            <p className="mb-4">
              All content on this Site, including text, graphics, logos, and software, is owned by or 
              licensed to {COMPANY_INFO.legalName} and is protected by copyright and other intellectual 
              property laws.
            </p>
            <p>
              You may not reproduce, distribute, or create derivative works from any content without 
              our prior written consent. Third-party trademarks belong to their respective owners.
            </p>
          </section>

          {/* 10. Changes to This Disclaimer */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Changes to This Disclaimer</h2>
            <p>
              We may modify this disclaimer at any time without prior notice. Updated versions will be 
              posted on this page with a revised effective date. Your continued use of the Site following 
              any changes constitutes acceptance of those changes.
            </p>
          </section>

          {/* 11. About the Operator */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. About the Operator</h2>
            <div className="bg-muted p-5 rounded-lg">
              <p className="font-semibold mb-2">{COMPANY_INFO.legalName}</p>
              <p className="text-muted-foreground mb-1">Trading as: {COMPANY_INFO.tradingName}</p>
              <p className="text-muted-foreground mb-1">
                {COMPANY_INFO.address.city}, {COMPANY_INFO.address.suburb}, {COMPANY_INFO.address.state} {COMPANY_INFO.address.postcode}
              </p>
              <p className="text-muted-foreground mb-3">{COMPANY_INFO.address.country}</p>
              <p className="text-sm text-muted-foreground mb-3">
                Part of{' '}
                <a 
                  href="https://group.movingto.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline"
                >
                  Movingto Group
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary hover:underline">
                  {COMPANY_INFO.email}
                </a>
              </p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {COMPANY_INFO.legalName} is not licensed as a financial institution, financial adviser, 
              investment adviser, or broker-dealer under the laws of Australia or any other jurisdiction.
            </p>
          </section>

          {/* 12. Governing Law */}
          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-4">12. Governing Law</h2>
            <p className="mb-4">
              This disclaimer and any disputes arising from your use of this Site shall be governed by 
              the laws of Victoria, Australia. By using this Site, you submit to the exclusive jurisdiction 
              of the courts of Victoria, Australia.
            </p>
            <p className="text-sm text-muted-foreground">
              Nothing in this disclaimer excludes, restricts, or modifies any consumer guarantee, right, 
              or remedy conferred by the Australian Consumer Law or any other applicable mandatory law 
              that cannot be excluded, restricted, or modified by agreement.
            </p>
          </section>

          {/* Related Links */}
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Related: <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link> · <Link to="/verification-program" className="text-primary hover:underline">Verification Program</Link>
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Disclaimer;
