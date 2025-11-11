
import React from 'react';
import { Folder, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isCategoryGVEligible, getGVIneligibilityWarning } from '../../data/services/gv-eligibility-service';

interface CategoryPageHeaderProps {
  categoryName: string;
}

const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({ categoryName }) => {
  const isGVEligible = isCategoryGVEligible(categoryName as any);
  
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
      <div className="flex items-center justify-center mb-4">
        <Folder className="w-6 h-6 text-primary mr-2" />
        <span className="text-sm bg-muted px-3 py-1 rounded-full">Category</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center" itemProp="name">
        {categoryName} Portugal Investment Funds
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center" itemProp="description">
        Explore {categoryName} investment funds for Golden Visa applications and compare available options. 
        Browse our <Link to="/" className="text-primary hover:text-primary/80 underline">
          complete fund database
        </Link> or explore other <Link to="/categories" className="text-primary hover:text-primary/80 underline">
          investment categories
        </Link> to find the perfect fund for your Golden Visa application.
      </p>
    </div>
  );
};

export default CategoryPageHeader;
