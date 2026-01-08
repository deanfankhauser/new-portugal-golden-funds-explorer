
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calculator, ClipboardCheck, Users, BarChart3, ExternalLink, FileText } from 'lucide-react';

const HomepageInfoSections = () => {
  return (
    <div className="space-y-12">
      {/* Browse Funds CTA Section */}
      <section className="bg-[hsl(40,40%,92%)] rounded-xl p-12 border border-[hsl(40,20%,80%)]">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top Badge / Eyebrow */}
          <div className="inline-block mb-6">
            <span className="text-xs tracking-[0.2em] uppercase text-[hsl(40,15%,40%)] font-semibold">
              Independent Market Analysis
            </span>
          </div>
          
          {/* Main Headline */}
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-3 font-cheltenham">
            Portugal Golden Visa Investment Funds
          </h2>
          
          {/* Sub-Headline */}
          <p className="text-2xl md:text-3xl italic text-foreground mb-8 font-cheltenham">
            Compare Fees, Performance, and Risk.
          </p>
          
          {/* Body Text */}
          <p className="text-base md:text-lg text-[hsl(40,15%,35%)] mb-8 leading-relaxed max-w-3xl mx-auto">
            The only independent directory of CMVM-regulated investment funds marketed for the Portugal Golden Visa route. 
            We analyze the market to help you compare strategies, scrutinize management fees, and verify track records. 
            Use our data to shortlist the best funds before you invest.
          </p>
          
          {/* CTA Button */}
          <div className="flex justify-center">
            <Button asChild size="lg" variant="default" className="text-base">
              <Link to="/" className="flex items-center gap-2">
                Compare All Portugal Funds
                <span>→</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools and Resources Grid */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Golden Visa Investment Tools & Resources</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Use our specialized tools to find the perfect Golden Visa investment fund for your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                ROI Calculator
              </CardTitle>
              <CardDescription>
                Calculate potential returns on your Golden Visa investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/roi-calculator">Calculate Returns</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                ROI Calculator
              </CardTitle>
              <CardDescription>
                Calculate potential returns on your Golden Visa investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/roi-calculator">Calculate Returns</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                Fund Managers
              </CardTitle>
              <CardDescription>
                Explore the teams behind each investment fund
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/managers">Browse Managers</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-warning" />
                List Your Fund
              </CardTitle>
              <CardDescription>
                Fund managers: Submit your fund for inclusion in our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="bg-secondary/30 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Learn More</h2>
          <p className="text-muted-foreground">
            Get comprehensive information about the Portugal Golden Visa program
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button asChild variant="outline" className="h-auto p-4 text-left">
            <a 
              href="https://www.movingto.com/pt/portugal-golden-visa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-3"
            >
              <ExternalLink className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Golden Visa Guide</div>
                <div className="text-sm text-muted-foreground">Complete program overview</div>
              </div>
            </a>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4 text-left">
            <a 
              href="https://www.movingto.com/pt/best-portugal-golden-visa-law-firms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-3"
            >
              <ExternalLink className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Best Law Firms</div>
                <div className="text-sm text-muted-foreground">Top legal professionals</div>
              </div>
            </a>
          </Button>
          
          <Button asChild variant="outline" className="h-auto p-4 text-left">
            <a 
              href="https://www.movingto.com/statistics/portugal-golden-visa-statistics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start gap-3"
            >
              <ExternalLink className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Statistics</div>
                <div className="text-sm text-muted-foreground">Program data & trends</div>
              </div>
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomepageInfoSections;
