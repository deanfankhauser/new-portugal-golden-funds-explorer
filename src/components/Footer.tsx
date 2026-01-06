
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Facebook, Linkedin, ExternalLink } from "lucide-react";
import { COMPANY_INFO } from '@/config/company';

const Footer: React.FC = () => {
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
    <footer className="bg-secondary py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img 
                src="/lovable-uploads/9bdf45a5-6a2f-466e-8c2d-b8ba65863e8a.png" 
                alt="Movingto Logo" 
                className="h-8"
                width="155"
                height="32"
              />
            </Link>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Helping investors navigate Portuguese Golden Visa investment funds
            </p>
            <div className="flex items-center space-x-3">
              <a 
                href={COMPANY_INFO.socialLinks.facebook}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href={COMPANY_INFO.socialLinks.linkedin}
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          {/* Directory Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Directory</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary text-sm transition-colors">All Funds</Link>
              </li>
              <li>
                <Link to="/managers" className="text-muted-foreground hover:text-primary text-sm transition-colors">Fund Managers</Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-primary text-sm transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/tags" className="text-muted-foreground hover:text-primary text-sm transition-colors">Themes</Link>
              </li>
              <li>
                <Link to="/comparisons" className="text-muted-foreground hover:text-primary text-sm transition-colors">Comparisons</Link>
              </li>
              <li>
                <Link to="/verified-funds" className="text-muted-foreground hover:text-primary text-sm transition-colors">Verified Funds</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/faqs" className="text-muted-foreground hover:text-primary text-sm transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/verification-program" className="text-muted-foreground hover:text-primary text-sm transition-colors">Verification Program</Link>
              </li>
              <li>
                <a 
                  href="https://movingto.com/pt/portugal-golden-visa" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center gap-1"
                >
                  Portugal Golden Visa
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.movingto.com/pt/best-portugal-golden-visa-law-firms" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center gap-1"
                >
                  Best Law Firms
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.movingto.com/statistics/portugal-golden-visa-statistics" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-primary text-sm transition-colors inline-flex items-center gap-1"
                >
                  GV Statistics
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
          
          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary text-sm transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">Privacy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">Terms</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-muted-foreground hover:text-primary text-sm transition-colors">Disclaimer</Link>
              </li>
            </ul>
            
            <div className="mt-6">
              <a
                href="mailto:info@movingto.com?subject=Fund%20Submission%20-%20Movingto"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Submit Your Fund
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs">
            © {currentYear} {COMPANY_INFO.legalName}. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs text-center sm:text-right max-w-md">
            For informational purposes only. Not investment advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
