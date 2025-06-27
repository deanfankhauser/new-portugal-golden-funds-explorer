import React, { useEffect } from 'react';
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

const FundIndex: React.FC = () => {
  const allFundScores = FundScoringService.getAllFundScores(funds);
  const topFiveScores = allFundScores.slice(0, 5);

  useEffect(() => {
    // Enhanced Dataset schema for LLM consumption
    const enhancedDatasetSchema = {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      'name': 'Golden Visa Fund Comparison Data 2025',
      'description': 'Comprehensive dataset of Portugal Golden Visa investment funds with performance metrics, fees, and regulatory compliance data',
      'creator': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com'
      },
      'version': '2025.1',
      'dateCreated': '2025-01-01',
      'dateModified': new Date().toISOString(),
      'temporalCoverage': '2024/2025',
      'spatialCoverage': {
        '@type': 'Place',
        'name': 'Portugal'
      },
      'includedInDataCatalog': {
        '@type': 'DataCatalog',
        'name': 'Portugal Golden Visa Investment Data',
        'description': 'Comprehensive data catalog for Golden Visa investment opportunities'
      },
      'distribution': {
        '@type': 'DataDownload',
        'encodingFormat': 'application/ld+json',
        'name': 'Fund Performance and Ranking Data',
        'contentUrl': 'https://movingto.com/funds/index'
      },
      'variableMeasured': [
        {
          '@type': 'PropertyValue',
          'name': 'Fund Performance Score',
          'description': 'Weighted performance score based on returns and risk metrics'
        },
        {
          '@type': 'PropertyValue',
          'name': 'Regulatory Compliance Score',
          'description': 'Assessment of regulatory compliance and oversight'
        },
        {
          '@type': 'PropertyValue',
          'name': 'Fee Structure Score',
          'description': 'Evaluation of cost-effectiveness and fee transparency'
        },
        {
          '@type': 'PropertyValue',
          'name': 'Investor Protection Score',
          'description': 'Assessment of investor protection measures and governance'
        },
        {
          '@type': 'PropertyValue',
          'name': 'Overall Movingto Score',
          'description': 'Composite score combining all evaluation criteria'
        }
      ],
      'keywords': 'Portugal Golden Visa, investment funds, fund performance, regulatory compliance, investment analysis, fund rankings, financial data',
      'license': 'https://creativecommons.org/licenses/by/4.0/',
      'citation': 'Movingto Golden Visa Fund Index 2025',
      'fundingAgency': {
        '@type': 'Organization',
        'name': 'Movingto'
      }
    };

    // Temporal metadata for ranking updates
    const temporalSchema = {
      '@context': 'https://schema.org',
      '@type': 'PropertyValue',
      'name': 'Last Updated',
      'value': new Date().toISOString(),
      'description': 'Last update timestamp for fund rankings and data',
      'unitText': 'ISO 8601 DateTime'
    };

    // Statistical summary for LLM understanding
    const statisticalSchema = {
      '@context': 'https://schema.org',
      '@type': 'StatisticalSummary',
      'name': 'Fund Index Statistics',
      'description': 'Statistical overview of the Golden Visa Fund Index',
      'numberOfFunds': allFundScores.length,
      'averageScore': Math.round(allFundScores.reduce((sum, score) => sum + score.movingtoScore, 0) / allFundScores.length),
      'highestScore': Math.max(...allFundScores.map(score => score.movingtoScore)),
      'lowestScore': Math.min(...allFundScores.map(score => score.movingtoScore)),
      'dateCompiled': new Date().toISOString(),
      'methodology': 'Weighted scoring system: Performance (40%), Regulatory (25%), Fees (20%), Protection (15%)'
    };

    // Remove existing page-level schemas
    const existingSchemas = ['fund-index-page', 'fund-index-llm-data', 'fund-ranking-service', 'enhanced-dataset', 'temporal-data', 'statistical-summary'];
    existingSchemas.forEach(schemaId => {
      const existing = document.querySelector(`script[data-schema="${schemaId}"]`);
      if (existing) existing.remove();
    });

    // Add enhanced schemas
    const schemas = [
      { id: 'enhanced-dataset', data: enhancedDatasetSchema },
      { id: 'temporal-data', data: temporalSchema },
      { id: 'statistical-summary', data: statisticalSchema }
    ];

    schemas.forEach(({ id, data }) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema', id);
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    });

    // Cleanup
    return () => {
      existingSchemas.forEach(schemaId => {
        const cleanup = document.querySelector(`script[data-schema="${schemaId}"]`);
        if (cleanup) cleanup.remove();
      });
    };
  }, [allFundScores.length]);

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
