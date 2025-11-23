import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, FileText, Scale } from 'lucide-react';

const ManagerRelatedLinks: React.FC = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/20 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-6">Related Resources</h3>
        
        <div className="grid sm:grid-cols-3 gap-4">
          {/* Main Funds Hub */}
          <Link 
            to="/portugal-golden-visa-funds"
            className="group bg-background border border-border rounded-lg p-4 hover:shadow-md transition-all hover:border-primary/50"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  All Golden Visa Funds
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Browse the complete directory of Portugal Golden Visa eligible funds
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </Link>

          {/* Main GV Hub */}
          <a 
            href="https://www.movingto.com/portugal-golden-visa"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-background border border-border rounded-lg p-4 hover:shadow-md transition-all hover:border-primary/50"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  Portugal Golden Visa Guide
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Learn about requirements, process, and eligibility for Portuguese residency
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </a>

          {/* Law Firms */}
          <a 
            href="https://www.movingto.com/best-golden-visa-law-firms"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-background border border-border rounded-lg p-4 hover:shadow-md transition-all hover:border-primary/50"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Scale className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  Best Golden Visa Lawyers
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Find qualified immigration lawyers for your Golden Visa application
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ManagerRelatedLinks;
