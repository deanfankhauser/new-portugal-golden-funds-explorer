import React from 'react';
import { Link } from 'react-router-dom';

const ComparisonsHubHeader = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold mb-4">Compare Portugal Golden Visa Funds</h1>
      <h2 className="text-xl text-muted-foreground max-w-3xl mx-auto font-normal">
        Browse side-by-side comparisons of Portugal Golden Visa investment funds. 
        Analyze fees, terms, minimum investments, and more to build your shortlist.
        View our comprehensive <Link to="/" className="text-primary hover:underline">complete fund list</Link> for rankings.
      </h2>
    </div>
  );
};

export default ComparisonsHubHeader;
