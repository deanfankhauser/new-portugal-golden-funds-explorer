
import React from 'react';
import { Link } from 'react-router-dom';
import { GitCompare } from 'lucide-react';

const ComparisonsHubHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <GitCompare className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Portugal Golden Visa Fund Comparisons</h1>
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
        Compare different Portugal Golden Visa investment funds side by side. 
        Analyze fees, returns, minimum investments, and more to make informed decisions.
        View our comprehensive <Link to="/" className="text-primary hover:underline">complete fund list</Link> for rankings.
      </p>
    </div>
  );
};

export default ComparisonsHubHeader;
