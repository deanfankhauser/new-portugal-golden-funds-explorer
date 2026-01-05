import React from 'react';
import Header from '../Header';
import Footer from '../Footer';
import FAQSection from '../common/FAQSection';

interface HomepageLayoutProps {
  children: React.ReactNode;
}

const HomepageLayout: React.FC<HomepageLayoutProps> = ({ children }) => {
  const homepageFAQs = [
    {
      question: "What's the minimum for the fund route?",
      answer: "€500,000 total investment required for Golden Visa fund route, with no real-estate exposure permitted (post-October 2023 regulatory changes). A fund's subscription minimum can be lower, but you still need €500,000 across one or more qualifying funds. Source: IMI Daily"
    },
    {
      question: "How long does the Golden Visa application process take?",
      answer: "The application process typically takes 6-12 months from investment to visa approval, depending on the fund and documentation completeness."
    },
    {
      question: "Are these funds regulated by Portuguese authorities?",
      answer: "We source from CMVM-regulated managers where applicable. Verify each fund's registration and GV suitability with counsel."
    },
    {
      question: "Can I compare different fund options?",
      answer: "Movingto clients get access to comprehensive fund comparison tools, detailed performance data, and personalized recommendations based on risk tolerance and investment goals."
    }
  ];

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
                Compare Portugal investment funds for Golden Visa applications. Our directory includes 
                funds from top managers. Golden Visa fund route requires a total €500,000 investment. 
                Note: Some funds may be structured to meet GV rules; eligibility depends on current law and fund strategy.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Fund Categories</h2>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Technology & Innovation Funds</li>
                <li>• Renewable Energy Funds</li>
                <li>• Diversified Investment Funds</li>
                <li>• Private Equity Funds</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Why Choose Movingto</h2>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Expert Golden Visa information</li>
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
          <FAQSection 
            faqs={homepageFAQs}
            title="Frequently Asked Questions"
            schemaId="homepage-faq"
          />
        </section>
      </main>
      <Footer showBrowseSitemap={true} />
    </div>
  );
};

export default HomepageLayout;
