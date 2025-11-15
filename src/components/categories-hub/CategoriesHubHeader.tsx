
import React from 'react';
import { Link } from 'react-router-dom';
import { Folder } from 'lucide-react';

const CategoriesHubHeader = () => {
  return (
    <div className="bg-card p-8 rounded-xl border border-border mb-8">
      <div className="flex items-center justify-center mb-4">
        <Folder className="w-6 h-6 text-primary mr-2" />
        <span className="text-sm bg-muted px-3 py-1 rounded-full">Directory</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center" itemProp="name">
        Portugal Golden Visa Fund Categories
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center" itemProp="description">
        Browse all investment categories for Portugal Golden Visa Funds. 
        Visit our <Link to="/" className="text-primary hover:underline">complete fund list</Link> to see rankings and comparisons.
      </p>
    </div>
  );
};

export default CategoriesHubHeader;
