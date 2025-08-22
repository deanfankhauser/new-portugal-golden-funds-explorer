
import React from 'react';
import Header from '../Header';
import Footer from '../Footer';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout: React.FC<HomepageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="container mx-auto container-responsive-padding py-6 sm:py-8 lg:py-12 flex-1 max-w-7xl">
        {children}
        
        {/* SEO-optimized public content sections */}
        <section className="mt-16 pt-8 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Golden Visa Investment Funds</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Compare Portugal Golden Visa qualified investment funds. Our directory includes 
                funds from top managers with minimum investments starting from €280,000. 
                All funds meet Portuguese immigration requirements for residency applications.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Fund Categories</h2>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Real Estate Investment Funds</li>
                <li>• Technology & Innovation Funds</li>
                <li>• Renewable Energy Funds</li>
                <li>• Diversified Investment Funds</li>
                <li>• Private Equity Funds</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Why Choose MovingTo</h2>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Expert Golden Visa guidance</li>
                <li>• Comprehensive fund analysis</li>
                <li>• Due diligence support</li>
                <li>• Application assistance</li>
                <li>• Ongoing portfolio monitoring</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="mt-12 pt-8 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">What is the minimum investment for Portugal Golden Visa funds?</h3>
              <p className="text-sm text-muted-foreground">
                The minimum investment for qualified investment funds is €280,000 for the Portugal Golden Visa program, 
                significantly lower than the €500,000 required for real estate investments.
                <a href="https://movingto.com/pt/portugal-golden-visa" target="_blank" rel="noopener noreferrer" 
                   className="text-primary hover:text-primary/80 ml-2 underline">
                  Learn more about Golden Visa requirements →
                </a>
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-2">How long does the Golden Visa application process take?</h3>
              <p className="text-sm text-muted-foreground">
                The application process typically takes 6-12 months from investment to visa approval, 
                depending on the fund and documentation completeness.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-2">Are these funds regulated by Portuguese authorities?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, all listed funds are regulated by the Portuguese Securities Market Commission (CMVM) 
                and approved for Golden Visa investments.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-2">Can I compare different fund options?</h3>
              <p className="text-sm text-muted-foreground">
                MovingTo clients get access to comprehensive fund comparison tools, detailed analytics, 
                and personalized recommendations based on risk tolerance and investment goals.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomepageLayout;
