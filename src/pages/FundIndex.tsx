
import React from 'react';
import { funds } from '../data/funds';
import { FundScoringService } from '../services/fundScoringService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundIndexHeader from '../components/fund-index/FundIndexHeader';
import TopFiveFunds from '../components/fund-index/TopFiveFunds';
import IndexVisualization from '../components/fund-index/IndexVisualization';
import FullIndexTable from '../components/fund-index/FullIndexTable';
import MethodologySection from '../components/fund-index/MethodologySection';
import IndexCTA from '../components/fund-index/IndexCTA';
import TrustSignals from '../components/fund-index/TrustSignals';

const FundIndex: React.FC = () => {
  const allFundScores = FundScoringService.getAllFundScores(funds);
  const topFiveScores = allFundScores.slice(0, 5);

  return (
    <>
      <PageSEO 
        pageType="fund-index"
        title="2025 Golden Visa Fund Index | Portugal Investment Rankings"
        description="The definitive, data-driven ranking of Golden Visa-eligible investment funds in Portugal. Compare performance, fees, and regulation scores."
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container mx-auto px-4 py-8 space-y-12">
          <FundIndexHeader />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopFiveFunds scores={topFiveScores} />
            <IndexVisualization scores={topFiveScores} />
          </div>
          
          <FullIndexTable scores={allFundScores} />
          
          <MethodologySection />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <IndexCTA />
            <TrustSignals />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default FundIndex;
