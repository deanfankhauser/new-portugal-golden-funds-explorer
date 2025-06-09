import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const FAQs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <PageSEO pageType="faqs" />
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Portugal Golden Visa Investment Funds - Frequently Asked Questions</h1>
          <p className="text-gray-700 mb-10">
            Find answers to common questions about Portugal Golden Visa Investment Funds.
          </p>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What is the Portugal Golden Visa Investment Fund route?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                The Investment Fund option allows non-EU/EEA/Swiss nationals to obtain a Portuguese residence permit by subscribing to units of qualifying Portuguese investment or venture capital funds.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What is the minimum investment required?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                A minimum capital commitment of €500,000 in one or more Portuguese-regulated funds approved for the Golden Visa is required.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What types of funds qualify for the Golden Visa?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Eligible funds include alternative investment funds, private equity funds, venture capital funds, and real-economy funds, provided they are registered with the Portuguese Securities Market Commission (CMVM) and comply with specific investment criteria (e.g., no direct real estate).
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What are the eligibility requirements for qualifying funds?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                <p>To qualify, a fund must:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Be registered with CMVM.</li>
                  <li>Not invest directly or indirectly in real estate.</li>
                  <li>Maintain at least 60% of its capital in Portuguese companies.</li>
                  <li>Have a minimum maturity of five years.</li>
                  <li>Ensure the investor's subscription is held for the duration of the Golden Visa.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                How long must I hold the investment?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                The investment must be maintained for at least five years, which corresponds to the Golden Visa program's residency requirement period.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What is the minimum stay requirement?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                You must spend at least seven days in Portugal during the first year and 14 days in each subsequent two-year period to maintain Golden Visa status.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What is the application process and typical timeline?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                After subscribing to an eligible fund, you submit your application online to AIMA (formerly SEF). Processing typically takes 10–14 months, after which you attend a biometric appointment and receive your residence card valid for two years.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What documents are required for the application?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Required documents generally include: passport copy, proof of fund subscription, criminal record certificate, health insurance, proof of address, and birth/marriage certificates for dependents.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-9" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                Can I include family members in my Golden Visa application?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Yes. Spouses, dependent children under 18, and dependent adult children or parents may be included under family reunification rules.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-10" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What fees are associated with the Investment Fund route?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                In addition to the €500,000 investment, applicants pay government processing fees (approx. €5,000–€6,000 per permit), legal or consultancy fees, and fund management or subscription costs.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-11" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What are the tax implications of the Investment Fund route?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Becoming a Golden Visa holder does not automatically confer tax residency. You pay taxes on Portuguese-source income generated by your investment even if only a legal resident; if you spend more than 183 days per fiscal year in Portugal, you become a tax resident and may apply for the Non-Habitual Resident (NHR) regime, offering preferential rates for up to 10 years.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-12" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What due diligence and compliance checks are involved?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Once you select a fund, you must complete Know Your Customer (KYC) and Anti-Money Laundering (AML) checks with the fund management company, in line with EU regulations to ensure transparency and risk management.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-13" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What are the key risks associated with this route?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Investors should be aware of potential regulatory changes—such as the removal of property investment options in October 2023—and administrative backlogs that can delay permit issuance. Fund performance is also subject to market volatility and economic conditions.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-14" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                Can I exit the fund before five years?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                While you may sell fund units early, doing so before five years typically jeopardizes your Golden Visa status. Exit strategies should be planned in consultation with your immigration advisor and the fund manager.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-15" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What happens after five years?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                After five years of maintaining your investment and meeting stay requirements, you may apply for permanent residence or Portuguese citizenship, subject to additional criteria like language proficiency.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-16" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                Are there language requirements for citizenship?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Applicants for Portuguese citizenship must demonstrate A2-level proficiency in Portuguese, typically via an exam from Instituto Camões.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-17" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                Are there reporting requirements during the investment period?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Investors must provide updated proof of their investment and residential address when renewing their permit, and file annual tax returns if they become tax residents.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-18" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                Can I apply from outside Portugal?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Yes. The initial application and fund subscription can be completed abroad; only biometric data collection and card issuance require a visit to Portugal.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-19" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                Which sectors do qualifying funds typically target?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Funds often focus on sectors such as technology startups, renewable energy, infrastructure, and small-to-medium-sized enterprises in the real economy.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-20" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What are the advantages of the Investment Fund route compared to other Golden Visa options?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                The fund route offers a lower minimum stay requirement, professional fund management, diversification across sectors, and direct support for economic growth—advantages that have made it the primary pathway since property investments were removed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQs;
