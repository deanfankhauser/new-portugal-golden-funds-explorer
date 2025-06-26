
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Home, TrendingUp, Users, Folder, Tags, GitCompare, Calculator, ClipboardCheck } from 'lucide-react';

const FundIndexNavigation: React.FC = () => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Home className="h-4 w-4 text-[#EF4444]" />
              Browse Funds
            </h3>
            <div className="space-y-2">
              <Link to="/" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-[#EF4444]">
                  All Funds List
                </Button>
              </Link>
              <Link to="/categories" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-[#EF4444]">
                  <Folder className="h-3 w-3 mr-2" />
                  Categories
                </Button>
              </Link>
              <Link to="/tags" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-[#EF4444]">
                  <Tags className="h-3 w-3 mr-2" />
                  Tags
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#EF4444]" />
              Analysis
            </h3>
            <div className="space-y-2">
              <Link to="/compare" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-[#EF4444]">
                  <GitCompare className="h-3 w-3 mr-2" />
                  Compare Funds
                </Button>
              </Link>
              <Link to="/comparisons" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-[#EF4444]">
                  Popular Comparisons
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-[#EF4444]" />
              Managers
            </h3>
            <div className="space-y-2">
              <Link to="/managers" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-[#EF4444]">
                  All Managers
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[#EF4444]" />
              Tools
            </h3>
            <div className="space-y-2">
              <Link to="/fund-quiz" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-[#EF4444]">
                  <ClipboardCheck className="h-3 w-3 mr-2" />
                  Fund Quiz
                </Button>
              </Link>
              <Link to="/roi-calculator" className="block">
                <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600 hover:text-[#EF4444]">
                  <Calculator className="h-3 w-3 mr-2" />
                  ROI Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundIndexNavigation;
