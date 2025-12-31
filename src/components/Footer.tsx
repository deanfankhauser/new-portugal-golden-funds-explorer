
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Facebook, Linkedin, ExternalLink } from "lucide-react";
import RecentlyViewedFunds from "./RecentlyViewedFunds";
import { COMPANY_INFO } from '@/config/company';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    // Set current year on client-side only
    setCurrentYear(new Date().getFullYear());
    
    // Load Fillout script if not already loaded
    if (!document.querySelector('script[src="https://server.fillout.com/embed/v1/"]')) {
      const script = document.createElement('script');
      script.src = 'https://server.fillout.com/embed/v1/';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <footer className="bg-secondary py-10 mt-12 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Recently Viewed Funds Section */}
        <RecentlyViewedFunds />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/lovable-uploads/9bdf45a5-6a2f-466e-8c2d-b8ba65863e8a.png" 
                alt="Movingto Logo" 
                className="h-8"
                width="155"
                height="32"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Helping investors navigate the Portuguese Golden Visa investment funds
            </p>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">{COMPANY_INFO.legalName}</p>
              <p className="text-sm text-muted-foreground">{COMPANY_INFO.address.city}, {COMPANY_INFO.address.state}</p>
              <p className="text-sm text-muted-foreground">{COMPANY_INFO.address.country}</p>
            </div>
            <div className="flex items-center mt-4 space-x-3">
              <a 
                href={COMPANY_INFO.socialLinks.facebook}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href={COMPANY_INFO.socialLinks.linkedin}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent text-sm transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/" className="text-muted-foreground hover:text-accent text-sm transition-colors">
                  Browse All Golden Visa Funds
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-accent text-sm transition-colors">About</Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-accent text-sm transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/tags" className="text-muted-foreground hover:text-accent text-sm transition-colors">Tags</Link>
              </li>
              <li>
                <Link to="/managers" className="text-muted-foreground hover:text-accent text-sm transition-colors">Fund Managers</Link>
              </li>
              <li>
                <Link to="/comparisons" className="text-muted-foreground hover:text-accent text-sm transition-colors">Compare Funds</Link>
              </li>
              <li>
                <Link to="/alternatives" className="text-muted-foreground hover:text-accent text-sm transition-colors">Fund Alternatives</Link>
              </li>
              <li>
                <Link to="/roi-calculator" className="text-muted-foreground hover:text-accent text-sm transition-colors">ROI Calculator</Link>
              </li>
              <li>
                <a 
                  href="https://www.movingto.com/tools/golden-visa-cost-calculator" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center"
                >
                  <span>Golden Visa Cost Calculator</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
              <li>
                <Link to="/faqs" className="text-muted-foreground hover:text-accent text-sm transition-colors">FAQs</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/verified-funds" className="text-muted-foreground hover:text-accent text-sm transition-colors">Verified Funds</Link>
              </li>
              <li>
                <Link to="/verification-program" className="text-muted-foreground hover:text-accent text-sm transition-colors">Verification Program</Link>
              </li>
              <li>
                <a 
                  href="https://movingto.com/pt/portugal-golden-visa" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center"
                >
                  <span>Portugal Golden Visa</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.movingto.com/pt/best-portugal-golden-visa-law-firms" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center"
                >
                  <span>Best Golden Visa Law Firms</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.movingto.com/statistics/portugal-golden-visa-statistics" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center"
                >
                  <span>Golden Visa Statistics</span>
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4">Fund Managers</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you a fund manager? Get your fund listed on our platform.
            </p>
            <a 
              href="mailto:funds@movingto.com?subject=Fund%20Submission%20Inquiry"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </a>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-base font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/disclaimer" className="text-muted-foreground hover:text-accent text-sm transition-colors">Disclaimer</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-accent text-sm transition-colors">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">© {currentYear} {COMPANY_INFO.legalName}. All rights reserved.</p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">This website is for informational purposes only and does not constitute investment information.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
