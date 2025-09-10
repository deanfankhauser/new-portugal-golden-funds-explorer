import React from 'react';
import { funds } from '../data/funds';
import { FundScoringService } from '../services/fundScoringService';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundIndexHeader from '../components/fund-index/FundIndexHeader';
import FundIndexBreadcrumbs from '../components/fund-index/FundIndexBreadcrumbs';
import TopFiveFunds from '../components/fund-index/TopFiveFunds';
import FullIndexTable from '../components/fund-index/FullIndexTable';
import MethodologySection from '../components/fund-index/MethodologySection';
import TrustSignals from '../components/fund-index/TrustSignals';
import IndexSummaryWidgets from '../components/fund-index/IndexSummaryWidgets';
import FundIndexFAQ from '../components/fund-index/FundIndexFAQ';
import { Card, CardContent } from '../components/ui/card';

const FundIndex: React.FC = () => {
  // Calculate scores for all funds
  const allFundScores = FundScoringService.getAllFundScores(funds);
  const topFiveScores = allFundScores.slice(0, 5);

  // Remove component-level schema injection - ConsolidatedSEOService handles page-level schemas

  return (
    <>
      <PageSEO pageType="fund-index" />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="space-y-0" itemScope itemType="https://schema.org/WebPage">
          <meta itemProp="lastReviewed" content={new Date().toISOString()} />
          <meta itemProp="reviewedBy" content="Dean Fankhauser, Anna Luisa Lacerda" />
          
          <FundIndexBreadcrumbs />
          
          <FundIndexHeader />
          
          {/* Eligibility Notice */}
          <div className="max-w-7xl mx-auto px-6 py-4">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="text-center">
                  <h3 className="font-semibold text-foreground mb-1">Golden Visa Eligible Funds</h3>
                  <p className="text-sm text-muted-foreground">
                    All funds in our index are eligible for Portugal Golden Visa applications.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
            <TopFiveFunds scores={topFiveScores} />
            
            <IndexSummaryWidgets scores={allFundScores} />
            
            <FullIndexTable scores={allFundScores} />
            
            <div id="methodology">
              <MethodologySection />
            </div>
            
            <TrustSignals />
            
            <FundIndexFAQ />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default FundIndex;
