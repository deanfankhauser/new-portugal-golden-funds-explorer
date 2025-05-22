
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

const FAQs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>FAQs - Portugal Golden Visa Investment Funds</title>
        <meta 
          name="description" 
          content="Frequently asked questions about Portugal Golden Visa Investment Funds. Learn about eligibility, requirements, and how to invest." 
        />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
          <p className="text-gray-700 mb-10">
            Find answers to common questions about Portugal Golden Visa Investment Funds.
          </p>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What is the Portugal Golden Visa Program?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                The Portugal Golden Visa Program is a residency-by-investment scheme that allows non-EU nationals to obtain 
                residency permits in Portugal by making a qualifying investment in the country. One of the qualifying 
                investment options is investing in regulated investment funds focused on the capitalization of companies.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                How much do I need to invest in a fund to qualify for a Golden Visa?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Currently, the minimum investment required in qualifying investment funds is €500,000. This investment 
                must be maintained for a minimum period of 5 years from the date the residence permit is granted.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What types of investment funds qualify for the Golden Visa?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Qualifying funds must be regulated by the Portuguese Securities Market Commission (CMVM) and must have at 
                least 60% of their investments in companies with a head office in Portugal. These can include venture capital 
                funds, private equity funds, and other regulated investment funds that meet the specific requirements set by 
                the immigration authorities.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What are the benefits of investing in funds compared to other Golden Visa options?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                <p>Investing in funds offers several advantages:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Professional management of your investment</li>
                  <li>Diversification across multiple assets or companies</li>
                  <li>No need to directly manage property or a business</li>
                  <li>Potential for financial returns along with residency benefits</li>
                  <li>Lower administrative burden compared to other investment options</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                What are the residency requirements after obtaining a Golden Visa?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Golden Visa holders are required to spend a minimum of just 7 days in Portugal during the first year, 
                and 14 days in subsequent periods of two years. This is significantly lower than other residency programs, 
                making it attractive for investors who cannot or do not wish to relocate permanently.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                Can my family also get residency if I invest in a fund?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Yes, the main applicant can include family members in the Golden Visa application. Eligible family 
                members typically include the spouse or legal partner, children under 18, dependent children under 26 
                (if they are students and unmarried), and dependent parents of the main applicant or spouse.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                How long does the Golden Visa application process take?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                The process typically takes between 6-12 months from the time of investment until the residence permit 
                is issued. However, this can vary based on the current application volume and individual circumstances. 
                The investment must be completed before the residency application is submitted.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8" className="border rounded-lg px-6 py-2 border-gray-200">
              <AccordionTrigger className="text-lg font-medium">
                Can I eventually apply for Portuguese citizenship?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pt-4">
                Yes, after holding a Golden Visa for 5 years, you become eligible to apply for permanent residency or 
                Portuguese citizenship. Requirements include passing a basic Portuguese language test (A2 level) and 
                demonstrating links to the country. Portugal allows dual citizenship, which is an attractive feature 
                for many investors.
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
