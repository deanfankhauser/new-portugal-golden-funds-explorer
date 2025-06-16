
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Shield, TrendingUp, ClipboardCheck, Calculator, Users } from 'lucide-react';

interface HomepageInfoSectionsProps {
  onInternalLinkClick?: () => void;
}

const HomepageInfoSections: React.FC<HomepageInfoSectionsProps> = ({ onInternalLinkClick }) => {
  const handleLinkClick = () => {
    if (onInternalLinkClick) {
      onInternalLinkClick();
    }
  };

  return (
    <div className="mt-16 space-y-12">
      {/* Quick Actions Section */}
      <section className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Started with Your Investment Journey</h2>
          <p className="text-lg text-gray-600">Choose the path that's right for you</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-blue-200 bg-blue-50 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <ClipboardCheck className="h-12 w-12 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-blue-900">Take Our Quiz</CardTitle>
              <CardDescription className="text-blue-700">
                Get personalized fund recommendations in 2 minutes
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/fund-quiz" onClick={handleLinkClick}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Quiz
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Calculator className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-green-900">ROI Calculator</CardTitle>
              <CardDescription className="text-green-700">
                Calculate potential returns on your investment
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/roi-calculator" onClick={handleLinkClick}>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Calculate ROI
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50 hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-purple-900">Fund Managers</CardTitle>
              <CardDescription className="text-purple-700">
                Explore funds by their management companies
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/managers" onClick={handleLinkClick}>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  View Managers
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why Choose Portugal Golden Visa Funds section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <CardHeader>
            <Building2 className="h-8 w-8 text-[#EF4444] mb-2" />
            <CardTitle>Qualified Investment Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              All funds listed are approved by CMVM (Portuguese Securities Market Commission) and qualify for the Portugal Golden Visa program.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <CardHeader>
            <Shield className="h-8 w-8 text-[#EF4444] mb-2" />
            <CardTitle>Regulated & Secure</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              Benefit from Portugal's robust regulatory framework ensuring transparency and investor protection in all Golden Visa investments.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="shadow-md hover:shadow-lg transition-shadow border border-gray-100">
          <CardHeader>
            <TrendingUp className="h-8 w-8 text-[#EF4444] mb-2" />
            <CardTitle>Growth Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600">
              Access diverse investment opportunities across various sectors including technology, real estate, and renewable energy.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* About Portugal Golden Visa section */}
      <section className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">About Portugal Golden Visa Investment Funds</h2>
        <div className="prose max-w-none text-gray-700">
          <p className="text-lg leading-relaxed mb-4">
            Portugal's Golden Visa program offers a pathway to European residency through qualifying investments. 
            Investment funds represent one of the most popular and accessible routes, requiring a minimum investment 
            of €500,000 in approved funds.
          </p>
          <p className="text-lg leading-relaxed mb-4">
            These funds are carefully regulated by the Portuguese Securities Market Commission (CMVM) and must meet 
            specific criteria to qualify for the Golden Visa program. They offer investors the opportunity to 
            diversify their portfolio while obtaining European residency rights.
          </p>
          <p className="text-lg leading-relaxed">
            Our comprehensive directory helps you navigate the available options, compare fund performance, 
            and make informed investment decisions for your Golden Visa application.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomepageInfoSections;
