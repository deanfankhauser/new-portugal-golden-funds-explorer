
import React, { useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  useEffect(() => {
    document.title = "About | Portugal Golden Visa Funds";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border p-6">
          <h1 className="text-3xl font-bold mb-6">About Portugal Golden Visa Funds</h1>
          
          <div className="prose max-w-none">
            <h2>Our Mission</h2>
            <p>
              Portugal Golden Visa Funds is dedicated to providing comprehensive, up-to-date information 
              on qualified investment funds available for the Portugal Golden Visa program. 
              Our goal is to help investors navigate the complex landscape of investment options 
              with clear, organized, and detailed information.
            </p>
            
            <h2>The Portugal Golden Visa Program</h2>
            <p>
              The Portugal Golden Visa program is one of Europe's most popular residency-by-investment 
              schemes. Launched in 2012, it allows non-EU nationals to obtain residency permits in 
              Portugal through various investment options, including investment funds.
            </p>
            
            <p>
              As of 2022, real estate investments in high-density areas like Lisbon, Porto, and coastal 
              regions are no longer eligible for the Golden Visa. This has increased interest in alternative 
              investment routes, particularly investment funds, which remain eligible across the entire country.
            </p>
            
            <h2>Investment Fund Option</h2>
            <p>
              The investment fund route requires a minimum investment of €500,000 in a qualified Portuguese 
              investment fund. These funds must be:
            </p>
            
            <ul>
              <li>Approved by the Portuguese Securities Market Commission (CMVM)</li>
              <li>Have a maturity of at least 5 years</li>
              <li>Invest at least 60% of their assets in Portuguese companies</li>
            </ul>
            
            <p>
              Funds offer several advantages over direct real estate investments, including:
            </p>
            
            <ul>
              <li>Professional management</li>
              <li>Diversified investment portfolio</li>
              <li>No need to deal with property management</li>
              <li>Potentially easier exit strategy</li>
              <li>Nationwide eligibility</li>
            </ul>
            
            <h2>Our Directory</h2>
            <p>
              Our directory includes funds that are eligible for the Portugal Golden Visa program. 
              For each fund, we provide key information including:
            </p>
            
            <ul>
              <li>Investment focus and strategy</li>
              <li>Minimum investment amount</li>
              <li>Fund size and term</li>
              <li>Management and performance fees</li>
              <li>Target returns</li>
              <li>Fund manager details</li>
            </ul>
            
            <h2>Disclaimer</h2>
            <p>
              The information provided on this website is for general informational purposes only. 
              It should not be considered as legal, tax, or investment advice. Before making any 
              investment decisions, we strongly recommend consulting with qualified financial advisors, 
              immigration consultants, and legal professionals specialized in the Portugal Golden Visa program.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
