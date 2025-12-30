import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles } from 'lucide-react';
import QuizFlow from '@/components/quiz/QuizFlow';
import QuizIntroSection from '@/components/quiz/QuizIntroSection';
import QuizPageFAQ from '@/components/quiz/QuizPageFAQ';
import { trackQuizEventExtended } from '@/services/quizAnalyticsExtended';

const FundMatcher: React.FC = () => {
  // Track page view
  useEffect(() => {
    trackQuizEventExtended('quiz_page_view', { source: 'direct' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PageSEO pageType="fund-matcher" />
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Personalized Fund Matching</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Find Your Perfect <span className="text-primary">Golden Visa Fund</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Answer 5 simple questions to get personalized recommendations from our directory 
            of CMVM-regulated Portugal Golden Visa investment funds.
          </p>
        </div>

        {/* Quiz Card */}
        <Card className="max-w-3xl mx-auto p-6 md:p-8 mb-16 border-2 border-primary/20 bg-card">
          <QuizFlow isEmbedded />
        </Card>

        {/* Intro Content (for SEO) */}
        <section className="max-w-4xl mx-auto mb-16">
          <QuizIntroSection />
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-16">
          <QuizPageFAQ />
        </section>

        {/* Category Links */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6">Prefer to Browse?</h2>
          <p className="text-muted-foreground mb-6">
            Explore our fund directory by investment strategy:
          </p>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Private Equity', slug: 'private-equity', desc: 'Higher growth potential' },
              { name: 'Real Estate', slug: 'real-estate', desc: 'Stable, tangible assets' },
              { name: 'Venture Capital', slug: 'venture-capital', desc: 'Emerging companies' },
              { name: 'Debt Funds', slug: 'debt', desc: 'Fixed income focus' },
              { name: 'Infrastructure', slug: 'infrastructure', desc: 'Long-term stability' },
              { name: 'All Funds', slug: '', desc: 'Complete directory' },
            ].map((cat) => (
              <Link 
                key={cat.slug} 
                to={cat.slug ? `/categories/${cat.slug}` : '/'}
                className="group"
              >
                <Card className="p-4 hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{cat.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundMatcher;
