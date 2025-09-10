
import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { Facebook, Linkedin, ExternalLink } from "lucide-react";
import RecentlyViewedFunds from "./RecentlyViewedFunds";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
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
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              Helping investors navigate the Portuguese Golden Visa investment funds
            </p>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Moving To Global Pte Ltd</p>
              <p className="text-sm text-muted-foreground">160 Robinson Road, #14-04</p>
              <p className="text-sm text-muted-foreground">Singapore Business Federation Center</p>
              <p className="text-sm text-muted-foreground">Singapore 068914</p>
            </div>
            <div className="flex items-center mt-4 space-x-3">
              <a 
                href="https://www.facebook.com/groups/zoark" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/company/90556445" 
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
                <Link to="/index" className="text-muted-foreground hover:text-accent text-sm transition-colors">Fund Index</Link>
              </li>
              <li>
                <Link to="/fund-quiz" className="text-muted-foreground hover:text-accent text-sm transition-colors">Fund Quiz</Link>
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
                <Link to="/comparisons" className="text-muted-foreground hover:text-accent text-sm transition-colors">Fund Comparisons</Link>
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
                <a 
                  href="https://www.movingto.com/pt/portugal-golden-visa" 
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
              Are you a fund manager? Submit your fund to our platform.
            </p>
            <a 
              href="https://www.movingto.com/contact/submit-fund" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Submit Your Fund
              <ExternalLink size={14} className="ml-2" />
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
          <p className="text-muted-foreground text-sm">© {currentYear} Moving To Global Pte Ltd. All rights reserved.</p>
          <p className="text-muted-foreground text-sm mt-2 md:mt-0">This website is for informational purposes only and does not constitute investment information.</p>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <div className="bg-destructive/10 border border-destructive/20 p-6 rounded-lg">
            <h4 className="text-destructive font-semibold text-sm mb-3 text-center">⚠️ IMPORTANT RISK DISCLAIMER</h4>
            <div className="space-y-3 text-xs text-muted-foreground">
              <p className="text-center">
                <strong>Investment involves substantial risk of loss.</strong> All investments in Portugal Golden Visa funds carry significant financial risks, including the potential for total loss of invested capital. Past performance does not guarantee future results.
              </p>
              <p className="text-center">
                <strong>No Investment Advice:</strong> This website provides general information only and does not constitute financial, legal, tax, or immigration consultation. We are not licensed financial professionals or immigration consultants.
              </p>
              <p className="text-center">
                <strong>Professional Consultation Required:</strong> Before making any investment or immigration decisions, you must consult with qualified professionals including licensed financial professionals, immigration lawyers, tax specialists, and Portugal Golden Visa experts.
              </p>
              <p className="text-center">
                <strong>Data Accuracy:</strong> While we strive for accuracy, fund information may be outdated, incomplete, or contain errors. Always verify all information directly with fund managers and regulatory authorities.
              </p>
              <p className="text-center">
                <strong>Regulatory Compliance:</strong> Ensure all investments comply with regulations in your jurisdiction and Portugal. Moving To Global Pte Ltd disclaims all liability for investment decisions or outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
