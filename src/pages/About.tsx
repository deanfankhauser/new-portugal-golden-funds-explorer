import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { 
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ExternalLink, ArrowRight } from 'lucide-react';
import PageSEO from '../components/common/PageSEO';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <PageSEO pageType="about" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-12 flex-1 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-red-700 bg-clip-text text-transparent">About Portugal Golden Visa Funds</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your comprehensive guide to navigating qualified investment funds for the Portugal Golden Visa program.
          </p>
        </div>
        
        {/* Mission Section */}
        <Card className="mb-10 overflow-hidden border-none shadow-lg">
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 p-8">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-4 text-lg">
                MovingTo is dedicated to providing comprehensive, up-to-date information 
                on qualified investment funds available for the Portugal Golden Visa program. 
              </p>
              <p className="text-gray-700 mb-6">
                Our goal is to help investors navigate the complex landscape of investment options 
                with clear, organized, and detailed information, making the process more transparent 
                and accessible.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  className="group"
                  onClick={() => window.open("https://www.movingto.com/pt/portugal-golden-visa", "_blank")}
                >
                  Learn more about Golden Visa
                  <ExternalLink className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                
                <Button 
                  variant="secondary"
                  className="group"
                  onClick={() => window.open("https://www.movingto.com/contact/contact-movingto", "_blank")}
                >
                  Get in touch
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
            <div className="md:col-span-2 bg-[#f8f9fa] flex items-center justify-center p-6">
              <img 
                src="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/680c9bea4508a80787679af3_algarve.webp" 
                alt="Algarve, Portugal" 
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </Card>
        
        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">The Portugal Golden Visa Program</h2>
              <p className="text-gray-700 mb-2">
                The Portugal Golden Visa program is one of Europe's most popular residency-by-investment 
                schemes. Launched in 2012, it allows non-EU nationals to obtain residency permits in 
                Portugal through various investment options, including investment funds.
              </p>
              <p className="text-gray-700">
                As of 2022, real estate investments in high-density areas like Lisbon, Porto, and coastal 
                regions are no longer eligible for the Golden Visa. This has increased interest in alternative 
                investment routes, particularly investment funds, which remain eligible across the entire country.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">Investment Fund Option</h2>
              <p className="text-gray-700 mb-4">
                The investment fund route requires a minimum investment of €500,000 in a qualified Portuguese 
                investment fund. These funds must be approved by the Portuguese Securities Market Commission (CMVM),
                have a maturity of at least 5 years, and invest at least 60% of their assets in Portuguese companies.
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Fund advantages include:</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Professional management</li>
                  <li>Diversified investment portfolio</li>
                  <li>No property management required</li>
                  <li>Potentially easier exit strategy</li>
                  <li>Nationwide eligibility</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Directory Section */}
        <Card className="mb-12 shadow-md overflow-hidden">
          <div className="bg-gray-50 p-6 border-b">
            <h2 className="text-2xl font-bold">Our Directory</h2>
            <p className="text-gray-600">
              MovingTo provides comprehensive information on funds eligible for the Portugal Golden Visa program.
            </p>
          </div>
          <CardContent className="p-6">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { title: "Investment Focus", description: "Understand each fund's unique investment strategy" },
                { title: "Minimum Investment", description: "Clear information on required capital" },
                { title: "Fund Size & Term", description: "Total fund size and investment duration" },
                { title: "Fees Structure", description: "Management and performance fees" },
                { title: "Target Returns", description: "Expected performance metrics" },
                { title: "Management Team", description: "Information on fund managers" }
              ].map((item, index) => (
                <div key={index} className="bg-white shadow rounded-md p-4 hover:shadow-md transition-shadow border border-gray-100">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="max-w-3xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the minimum investment amount?</AccordionTrigger>
              <AccordionContent>
                The investment fund route requires a minimum investment of €500,000 in a qualified Portuguese 
                investment fund. This amount must be maintained for at least 5 years.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How long does the Golden Visa process take?</AccordionTrigger>
              <AccordionContent>
                The process typically takes between 8-12 months from application to approval, 
                though processing times can vary based on application volume and other factors.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Do I need to live in Portugal?</AccordionTrigger>
              <AccordionContent>
                No, the Golden Visa has very minimal stay requirements. You need to spend just 7 days in Portugal 
                during the first year, and 14 days in each subsequent two-year period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* Disclaimer */}
        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">Disclaimer</h2>
            <p className="text-gray-700 text-sm">
              The information provided on this website is for general informational purposes only. 
              It should not be considered as legal, tax, or investment advice. Before making any 
              investment decisions, we strongly recommend consulting with qualified financial advisors, 
              immigration consultants, and legal professionals specialized in the Portugal Golden Visa program.
            </p>
          </CardContent>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
