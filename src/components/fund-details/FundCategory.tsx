
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { Folder, ExternalLink } from 'lucide-react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryToSlug } from '@/lib/utils';

interface FundCategoryProps {
  category: Fund['category'];
}

const FundCategory: React.FC<FundCategoryProps> = ({ category }) => {
  return (
    <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Fund Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Link 
          to={`/categories/${categoryToSlug(category)}`}
          className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40 transition-all group"
        >
          <div>
            <Badge className="mb-2 text-xs">{category}</Badge>
            <p className="text-sm text-muted-foreground">View all funds in this category</p>
          </div>
          <ExternalLink className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default FundCategory;
