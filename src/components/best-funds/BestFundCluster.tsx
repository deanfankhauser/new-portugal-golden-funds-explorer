import React from 'react';
import { FundCluster } from '@/utils/fundScoring';
import BestFundCard from './BestFundCard';

interface BestFundClusterProps {
  cluster: FundCluster;
}

const BestFundCluster: React.FC<BestFundClusterProps> = ({ cluster }) => {
  if (cluster.funds.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-12">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-foreground mb-2">
          {cluster.title}
        </h3>
        <p className="text-muted-foreground">
          {cluster.description}
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cluster.funds.map((scoredFund, index) => (
          <BestFundCard 
            key={scoredFund.fund.id} 
            scoredFund={scoredFund}
            rank={index + 1}
          />
        ))}
      </div>
    </section>
  );
};

export default BestFundCluster;
