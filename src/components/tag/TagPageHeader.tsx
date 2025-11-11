
import React from 'react';
import { Tag as TagIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TagPageHeaderProps {
  tagName: string;
}

const TagPageHeader = ({ tagName }: TagPageHeaderProps) => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm mb-8 border border-border">
      <div className="flex items-center justify-center mb-4">
        <TagIcon className="w-6 h-6 text-accent mr-2" />
        <span className="text-sm bg-muted px-3 py-1 rounded-full text-muted-foreground">Tag</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center text-foreground" itemProp="name">
        {tagName} Portugal Golden Visa Investment Funds
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center" itemProp="description">
        Explore {tagName} Golden Visa Investment Funds and compare qualified options. 
        Use our <Link to="/roi-calculator" className="text-primary hover:text-primary/80 underline">
          ROI calculator</Link> to estimate potential returns, or browse <Link to="/" 
        className="text-primary hover:text-primary/80 underline">all funds</Link> to find the best match for your investment goals.
      </p>
    </div>
  );
};

export default TagPageHeader;
