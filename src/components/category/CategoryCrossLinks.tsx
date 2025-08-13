
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { TrendingUp, GitCompare, Users, Calculator } from 'lucide-react';

interface CategoryCrossLinksProps {
  categoryName: string;
}

const CategoryCrossLinks: React.FC<CategoryCrossLinksProps> = ({ categoryName }) => {
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-lg">Explore More</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/index">
            <Button variant="outline" className="w-full h-auto flex-col items-center gap-2 p-4 hover:border-[#EF4444] hover:text-[#EF4444]">
              <TrendingUp className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Fund Index</div>
                <div className="text-xs text-gray-500">See all funds ranked</div>
              </div>
            </Button>
          </Link>

          <Link to="/compare">
            <Button variant="outline" className="w-full h-auto flex-col items-center gap-2 p-4 hover:border-[#EF4444] hover:text-[#EF4444]">
              <GitCompare className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Compare</div>
                <div className="text-xs text-gray-500">Compare {categoryName} funds</div>
              </div>
            </Button>
          </Link>

          <Link to="/managers">
            <Button variant="outline" className="w-full h-auto flex-col items-center gap-2 p-4 hover:border-[#EF4444] hover:text-[#EF4444]">
              <Users className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Managers</div>
                <div className="text-xs text-gray-500">Browse fund managers</div>
              </div>
            </Button>
          </Link>

          <Link to="/fund-quiz">
            <Button variant="outline" className="w-full h-auto flex-col items-center gap-2 p-4 hover:border-[#EF4444] hover:text-[#EF4444]">
              <Calculator className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium">Find My Fund</div>
                <div className="text-xs text-gray-500">Take the quiz</div>
              </div>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryCrossLinks;
