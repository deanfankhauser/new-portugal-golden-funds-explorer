
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Linkedin, ExternalLink } from "lucide-react";
import RecentlyViewedFunds from "./RecentlyViewedFunds";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const handleInternalLinkClick = (to: string) => {
    // Scroll to top before navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Small delay to allow scroll animation to start, then navigate
    setTimeout(() => {
      navigate(to);
    }, 100);
  };

  const handleExternalLinkClick = (url: string) => {
    // Scroll to top before opening external link
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Small delay to allow scroll animation to start, then open link
    setTimeout(() => {
      window.open(url, '_blank', 'noopener,noreferrer');
    }, 100);
  };

  return (
    <footer className="bg-gray-100 py-10 mt-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        {/* Recently Viewed Funds Section */}
        <RecentlyViewedFunds />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <button onClick={() => handleInternalLinkClick("/")} className="inline-block mb-4">
              <img 
                src="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/65bf8dcb56803298881e81c7_movingto-logo-full.svg" 
                alt="MovingTo Logo" 
                className="h-8"
              />
            </button>
            <p className="text-sm text-gray-600 mb-4">
              Helping investors navigate the Portuguese Golden Visa investment funds
            </p>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Moving To Global Pte Ltd</p>
              <p className="text-sm text-gray-600">160 Robinson Road, #14-04</p>
              <p className="text-sm text-gray-600">Singapore Business Federation Center</p>
              <p className="text-sm text-gray-600">Singapore 068914</p>
            </div>
            <div className="flex items-center mt-4 space-x-3">
              <button 
                onClick={() => handleExternalLinkClick("https://www.facebook.com/groups/zoark")}
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </button>
              <button 
                onClick={() => handleExternalLinkClick("https://www.linkedin.com/company/90556445")}
                className="text-gray-600 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </button>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleInternalLinkClick("/")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">Home</button>
              </li>
              <li>
                <button onClick={() => handleInternalLinkClick("/fund-quiz")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">Fund Quiz</button>
              </li>
              <li>
                <button onClick={() => handleInternalLinkClick("/about")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">About</button>
              </li>
              <li>
                <button onClick={() => handleInternalLinkClick("/categories")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">Categories</button>
              </li>
              <li>
                <button onClick={() => handleInternalLinkClick("/tags")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">Tags</button>
              </li>
              <li>
                <button onClick={() => handleInternalLinkClick("/managers")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">Fund Managers</button>
              </li>
              <li>
                <button onClick={() => handleInternalLinkClick("/comparisons")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">Fund Comparisons</button>
              </li>
              <li>
                <button onClick={() => handleInternalLinkClick("/roi-calculator")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">ROI Calculator</button>
              </li>
              <li>
                <button onClick={() => handleInternalLinkClick("/faqs")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">FAQs</button>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleExternalLinkClick("https://www.movingto.com/pt/portugal-golden-visa")}
                  className="text-gray-600 hover:text-primary text-sm transition-colors inline-flex items-center"
                >
                  <span>Portugal Golden Visa</span>
                  <ExternalLink size={14} className="ml-1" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLinkClick("https://www.movingto.com/pt/best-portugal-golden-visa-law-firms")}
                  className="text-gray-600 hover:text-primary text-sm transition-colors inline-flex items-center"
                >
                  <span>Best Golden Visa Law Firms</span>
                  <ExternalLink size={14} className="ml-1" />
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleExternalLinkClick("https://www.movingto.com/statistics/portugal-golden-visa-statistics")}
                  className="text-gray-600 hover:text-primary text-sm transition-colors inline-flex items-center"
                >
                  <span>Golden Visa Statistics</span>
                  <ExternalLink size={14} className="ml-1" />
                </button>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleInternalLinkClick("/disclaimer")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">Disclaimer</button>
              </li>
              <li>
                <button onClick={() => handleInternalLinkClick("/privacy")} className="text-gray-600 hover:text-primary text-sm transition-colors text-left">Privacy Policy</button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">© {currentYear} Moving To Global Pte Ltd. All rights reserved.</p>
          <p className="text-gray-600 text-sm mt-2 md:mt-0">This website is for informational purposes only and does not constitute investment advice.</p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600 text-sm text-center">
              The information provided on this website is for general informational purposes only. It should not be considered as legal, tax, or investment advice. Before making any investment decisions, we strongly recommend consulting with qualified financial advisors, immigration consultants, and legal professionals specialized in the Portugal Golden Visa program.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
