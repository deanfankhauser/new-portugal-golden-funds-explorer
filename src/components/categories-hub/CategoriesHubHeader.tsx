
import React from 'react';
import { Folder } from 'lucide-react';

const CategoriesHubHeader = () => {
  return (
    <div className="bg-card p-8 rounded-xl border border-border mb-8">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center" itemProp="name">
        Portugal Golden Visa Fund Categories
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center" itemProp="description">
        Browse all investment categories for Portugal Golden Visa Funds. Visit our complete fund list to see rankings and comparisons.
      </p>
    </div>
  );
};

export default CategoriesHubHeader;
