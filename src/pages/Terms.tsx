import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { COMPANY_INFO } from '@/config/company';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO pageType="terms" />
      <Header />
      
      <main className="flex-1 py-8 px-4">
        <div className="bg-card p-6 md:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <p className="text-sm text-muted-foreground mb-8">
            Effective Date: January 1, 2026
          </p>

          {/* Section 1: Overview */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Overview</h2>
            <p className="text-foreground/80 mb-4">
              Welcome to {COMPANY_INFO.website.replace('https://', '')} (the "Site"), operated by {COMPANY_INFO.legalName}, 
              trading as {COMPANY_INFO.tradingName} ("we", "us", or "our").
            </p>
            <p className="text-foreground/80 mb-4">
              By accessing or using the Site, you agree to be bound by these Terms of Service ("Terms"). If you do not 
              agree to these Terms, you must not use the Site.
            </p>
            <p className="text-foreground/80">
              These Terms should be read in conjunction with our <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link> and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which together govern your use of the Site.
            </p>
          </section>

          {/* Section 2: Eligibility and Access */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Eligibility and Access</h2>
            <p className="text-foreground/80 mb-4">
              The Site is intended for users who are at least 18 years of age. By using the Site, you warrant that you 
              have the legal capacity to enter into these Terms and to comply with all applicable laws and regulations.
            </p>
            <p className="text-foreground/80">
              Access to the Site may be restricted in certain jurisdictions. You are responsible for ensuring that your 
              use of the Site complies with the laws of your jurisdiction.
            </p>
          </section>

          {/* Section 3: Account Registration */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Account Registration</h2>
            <p className="text-foreground/80 mb-4">
              Certain features of the Site may require you to create an account. When creating an account, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Provide accurate, current, and complete registration information</li>
              <li>Maintain and promptly update your registration information</li>
              <li>Keep your login credentials confidential and secure</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
            </ul>
            <p className="text-foreground/80">
              We reserve the right to suspend or terminate accounts at our sole discretion, including for breach of 
              these Terms or suspected fraudulent activity.
            </p>
          </section>

          {/* Section 4: User Conduct */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. User Conduct</h2>
            <p className="text-foreground/80 mb-4">
              When using the Site, you agree NOT to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Use the Site for any unlawful purpose or in violation of any applicable laws</li>
              <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Interfere with or disrupt the Site's security, functionality, or servers</li>
              <li>Attempt to gain unauthorised access to any systems, accounts, or data</li>
              <li>Use automated tools, bots, or scrapers without our express written permission</li>
              <li>Harass, abuse, threaten, or harm other users</li>
              <li>Infringe upon the intellectual property rights of others</li>
              <li>Transmit viruses, malware, or other harmful code</li>
            </ul>
          </section>

          {/* Section 5: Acceptable Use */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Acceptable Use</h2>
            <p className="text-foreground/80 mb-4">
              The Site is provided for personal, non-commercial informational purposes. You may:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Browse and view fund information</li>
              <li>Compare funds using our comparison tools</li>
              <li>Submit enquiries to fund managers through our platform</li>
              <li>Save funds to your shortlist (account required)</li>
            </ul>
            <p className="text-foreground/80 mb-4">
              You must NOT:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Republish, redistribute, or commercially exploit Site content</li>
              <li>Use Site content to create competing products or services</li>
              <li>Frame, embed, or mirror Site content without permission</li>
              <li>Systematically download or collect data from the Site</li>
            </ul>
          </section>

          {/* Section 6: Enquiries and Introductions */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Enquiries and Introductions</h2>
            <p className="text-foreground/80 mb-4">
              When you submit an enquiry through the Site, your contact information and enquiry details may be shared 
              with the relevant fund manager or our commercial partners.
            </p>
            <p className="text-foreground/80 mb-4">
              We facilitate introductions between you and fund managers only. We are NOT a party to any investment 
              transactions, negotiations, or agreements that may result from such introductions.
            </p>
            <p className="text-foreground/80">
              You are solely responsible for conducting your own due diligence before making any investment decisions. 
              Please refer to our <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link> for 
              important information about the limitations of our service.
            </p>
          </section>

          {/* Section 7: Content and Information */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Content and Information</h2>
            <p className="text-foreground/80 mb-4">
              While we strive to provide accurate and up-to-date information, we make no guarantees regarding the 
              accuracy, completeness, or timeliness of any content on the Site.
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Information may be incomplete, outdated, or contain errors</li>
              <li>Fund details are provided by fund managers and may change without notice</li>
              <li>You must independently verify all information before making decisions</li>
              <li>Third-party content is not controlled or endorsed by us</li>
            </ul>
            <p className="text-foreground/80">
              For full disclaimers regarding content accuracy, please see our{' '}
              <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>.
            </p>
          </section>

          {/* Section 8: Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="text-foreground/80 mb-4">
              All content on the Site, including but not limited to text, graphics, logos, images, data compilations, 
              and software, is the property of {COMPANY_INFO.legalName} or its licensors and is protected by 
              Australian and international copyright laws.
            </p>
            <p className="text-foreground/80 mb-4">
              You are granted a limited, non-exclusive, non-transferable license to access and use the Site for 
              personal, non-commercial purposes only. This license does not include:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Any right to copy, modify, or distribute Site content</li>
              <li>Permission to create derivative works</li>
              <li>Any transfer of intellectual property rights</li>
            </ul>
            <p className="text-foreground/80">
              Trademarks, service marks, and logos displayed on the Site belong to their respective owners.
            </p>
          </section>

          {/* Section 9: User-Generated Content */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. User-Generated Content</h2>
            <p className="text-foreground/80 mb-4">
              If you submit any content to the Site (including enquiries, feedback, suggestions, or reviews), you:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Grant us a worldwide, royalty-free, perpetual license to use, reproduce, modify, and distribute such content</li>
              <li>Warrant that you own or have the right to submit the content</li>
              <li>Warrant that the content does not infringe any third-party rights</li>
              <li>Acknowledge that we may remove or modify content at our sole discretion</li>
            </ul>
          </section>

          {/* Section 10: Third-Party Links and Services */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Third-Party Links and Services</h2>
            <p className="text-foreground/80 mb-4">
              The Site may contain links to external websites and services operated by third parties. We do not 
              control, endorse, or assume responsibility for any third-party sites or their content.
            </p>
            <p className="text-foreground/80">
              Your use of third-party websites is at your own risk and subject to the terms and policies of those 
              sites. We encourage you to review the terms and privacy policies of any external sites you visit.
            </p>
          </section>

          {/* Section 11: Disclaimers and Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Disclaimers and Limitation of Liability</h2>
            <p className="text-foreground/80 mb-4">
              Please refer to our comprehensive <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link> for 
              detailed information about the limitations of our service.
            </p>
            <p className="text-foreground/80 mb-4">
              THE SITE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR 
              IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
              OR NON-INFRINGEMENT.
            </p>
            <p className="text-foreground/80 mb-4">
              TO THE FULLEST EXTENT PERMITTED BY LAW, WE EXCLUDE ALL LIABILITY FOR:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Any indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Any investment losses or financial decisions made based on Site content</li>
              <li>Any damages arising from your use of or inability to use the Site</li>
            </ul>
            <p className="text-foreground/80">
              Our total liability for any claims arising from your use of the Site shall not exceed AUD $100 or the 
              amount you have paid to us (if any), whichever is less.
            </p>
          </section>

          {/* Section 12: Indemnification */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Indemnification</h2>
            <p className="text-foreground/80 mb-4">
              You agree to indemnify, defend, and hold harmless {COMPANY_INFO.legalName}, its directors, officers, 
              employees, agents, and affiliates from and against any claims, liabilities, damages, losses, costs, or 
              expenses (including reasonable legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Your use of the Site</li>
              <li>Your breach of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit to the Site</li>
            </ul>
          </section>

          {/* Section 13: Termination */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">13. Termination</h2>
            <p className="text-foreground/80 mb-4">
              We may terminate or suspend your access to the Site at any time, without prior notice or liability, 
              for any reason, including but not limited to:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-1 text-foreground/80">
              <li>Breach of these Terms</li>
              <li>Suspected fraudulent or illegal activity</li>
              <li>Request by law enforcement or government agencies</li>
              <li>Extended periods of inactivity</li>
              <li>Technical or security issues</li>
            </ul>
            <p className="text-foreground/80">
              Upon termination, your right to use the Site will immediately cease. Provisions of these Terms that by 
              their nature should survive termination shall remain in effect, including intellectual property, 
              disclaimers, limitation of liability, and indemnification.
            </p>
          </section>

          {/* Section 14: Dispute Resolution */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">14. Dispute Resolution</h2>
            <p className="text-foreground/80 mb-4">
              If you have any dispute or concern regarding the Site or these Terms, we encourage you to first 
              contact us at <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary hover:underline">{COMPANY_INFO.email}</a> to 
              seek an informal resolution.
            </p>
            <p className="text-foreground/80 mb-4">
              We will attempt to resolve any dispute within 30 days. If a resolution cannot be reached informally, 
              any legal proceedings must be brought in the courts of Victoria, Australia.
            </p>
            <p className="text-foreground/80">
              Nothing in these Terms affects your rights under the Australian Consumer Law or any other consumer 
              protection legislation that cannot be excluded.
            </p>
          </section>

          {/* Section 15: Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">15. Changes to Terms</h2>
            <p className="text-foreground/80 mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon 
              posting to the Site with an updated effective date.
            </p>
            <p className="text-foreground/80">
              Your continued use of the Site after any changes constitutes your acceptance of the revised Terms. 
              We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* Section 16: About the Operator */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">16. About the Operator</h2>
            <p className="text-foreground/80 mb-4">
              The Site is operated by:
            </p>
            <p className="text-foreground/80 mb-4">
              <strong>{COMPANY_INFO.legalName}</strong><br />
              Trading as: {COMPANY_INFO.tradingName}<br />
              {COMPANY_INFO.address.city}, {COMPANY_INFO.address.suburb}, {COMPANY_INFO.address.state}, {COMPANY_INFO.address.postcode} {COMPANY_INFO.address.country}
            </p>
            <p className="text-foreground/80 mb-4">
              Part of the Movingto Group. Learn more at{' '}
              <a 
                href="https://group.movingto.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                group.movingto.com
              </a>
            </p>
            <p className="text-foreground/80">
              For enquiries regarding these Terms, please contact us at{' '}
              <a href={`mailto:${COMPANY_INFO.email}`} className="text-primary hover:underline">{COMPANY_INFO.email}</a>.
            </p>
          </section>

          {/* Section 17: Severability and Entire Agreement */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">17. Severability and Entire Agreement</h2>
            <p className="text-foreground/80 mb-4">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be 
              limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in 
              full force and effect.
            </p>
            <p className="text-foreground/80">
              These Terms, together with our <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link> and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, constitute the entire 
              agreement between you and {COMPANY_INFO.legalName} regarding your use of the Site. No waiver of any 
              provision shall be effective unless in writing and signed by an authorised representative.
            </p>
          </section>

          {/* Related Policies */}
          <section className="border-t border-border pt-6">
            <h2 className="text-lg font-semibold mb-4">Related Policies</h2>
            <ul className="space-y-2 text-foreground/80">
              <li>
                <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                {' '}- How we collect, use, and protect your information
              </li>
              <li>
                <Link to="/disclaimer" className="text-primary hover:underline">Disclaimer</Link>
                {' '}- Important limitations and disclosures
              </li>
              <li>
                <Link to="/verification-program" className="text-primary hover:underline">Verification Program</Link>
                {' '}- Our fund verification process
              </li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
