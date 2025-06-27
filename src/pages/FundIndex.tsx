
import React from 'react';
import { funds } from '../data/funds';
import { FundScoringService } from '../services/fundScoringService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundIndexHeader from '../components/fund-index/FundIndexHeader';
import FundIndexBreadcrumbs from '../components/fund-index/FundIndexBreadcrumbs';
import FundIndexNavigation from '../components/fund-index/FundIndexNavigation';
import TopFiveFunds from '../components/fund-index/TopFiveFunds';
import IndexVisualization from '../components/fund-index/IndexVisualization';
import InteractiveFundComparison from '../components/fund-index/InteractiveFundComparison';
import FullIndexTable from '../components/fund-index/FullIndexTable';
import MethodologySection from '../components/fund-index/MethodologySection';
import IndexCTA from '../components/fund-index/IndexCTA';
import TrustSignals from '../components/fund-index/TrustSignals';

const FundIndex: React.FC = () => {
  const allFundScores = FundScoringService.getAllFundScores(funds);
  const topFiveScores = allFundScores.slice(0, 5);

  return (
    <>
      <PageSEO pageType="fund-index" />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="space-y-0">
          <FundIndexBreadcrumbs />
          
          <FundIndexHeader />
          
          <FundIndexNavigation />
          
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <TopFiveFunds scores={topFiveScores} />
              <IndexVisualization scores={topFiveScores} />
            </div>
            
            {/* Enhanced Interactive Comparison */}
            <div id="comparison">
              <InteractiveFundComparison scores={allFundScores} />
            </div>
            
            <FullIndexTable scores={allFundScores} />
            
            <div id="methodology">
              <MethodologySection />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <IndexCTA />
              <TrustSignals />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default FundIndex;
