
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Folder } from 'lucide-react';
import { Fund } from '../../data/funds';
import { Card, CardContent } from "@/components/ui/card";
import { categoryToSlug } from '@/lib/utils';

interface FundCategoryProps {
  category: Fund['category'];
}

const FundCategory: React.FC<FundCategoryProps> = ({ category }) => {
  return (
    <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <Folder className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-xl font-bold">Fund Category</h2>
        </div>
        <Link to={`/categories/${categoryToSlug(category)}`}>
          <Badge className="px-3 py-1.5 text-base bg-primary hover:bg-primary/80 shadow-sm cursor-pointer">
            {category}
          </Badge>
        </Link>
      </CardContent>
    </Card>
  );
};

export default FundCategory;
