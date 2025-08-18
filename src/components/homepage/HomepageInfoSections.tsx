
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calculator, ClipboardCheck, Users, BarChart3, ExternalLink, FileText } from 'lucide-react';

const HomepageInfoSections = () => {
  return (
    <div className="space-y-12">
      {/* Fund Index CTA Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            2025 Portugal Golden Visa Investment Fund Index
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Discover our comprehensive, data-driven ranking of all Golden Visa-eligible investment funds. 
            Compare performance, fees, regulatory compliance, and investor protection scores in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/index" className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                View Fund Index
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/compare" className="flex items-center gap-2">
                Compare Funds
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Tools and Resources Grid */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Golden Visa Investment Tools & Resources</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Use our specialized tools to find the perfect Golden Visa investment fund for your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-green-600" />
                Fund Quiz
              </CardTitle>
              <CardDescription>
                Answer a few questions to get personalized fund recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/fund-quiz">Take Quiz</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
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
                <Users className="h-5 w-5 text-purple-600" />
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
                <FileText className="h-5 w-5 text-orange-600" />
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
      <section className="bg-gray-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Learn More</h2>
          <p className="text-gray-600">
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
                <div className="text-sm text-gray-500">Complete program overview</div>
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
                <div className="text-sm text-gray-500">Top legal advisors</div>
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
                <div className="text-sm text-gray-500">Program data & trends</div>
              </div>
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomepageInfoSections;
