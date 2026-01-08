
import React from 'react';
import { Link } from 'react-router-dom';
import { isCategoryGVEligible, getGVIneligibilityWarning } from '../../data/services/gv-eligibility-service';

interface CategoryPageHeaderProps {
  categoryName: string;
}

const CategoryPageHeader: React.FC<CategoryPageHeaderProps> = ({ categoryName }) => {
  const isGVEligible = isCategoryGVEligible(categoryName as any);
  
  return (
    <div className="bg-card p-8 rounded-xl border border-border mb-8">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-center" itemProp="name">
        {categoryName} Portugal Golden Visa Investment Funds
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center" itemProp="description">
        Explore {categoryName} investment funds for Golden Visa applications and compare available options.
      </p>
    </div>
  );
};

export default CategoryPageHeader;
