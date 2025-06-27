
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
    // Comprehensive page-level schema for Fund Index
    const pageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': '2025 Golden Visa Fund Index | Portugal Investment Rankings',
      'description': 'The definitive, data-driven ranking of Golden Visa-eligible investment funds in Portugal. Compare performance, fees, and regulation scores.',
      'url': 'https://movingto.com/funds/index',
      'mainEntity': {
        '@type': 'ItemList',
        'name': '2025 Golden Visa Fund Index',
        'description': 'Comprehensive ranking of Portugal Golden Visa investment funds',
        'numberOfItems': allFundScores.length,
        'itemListOrder': 'Descending'
      },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': 'https://movingto.com/funds'
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Fund Index',
            'item': 'https://movingto.com/funds/index'
          }
        ]
      },
      'author': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com'
      },
      'datePublished': '2025-01-01',
      'dateModified': new Date().toISOString().split('T')[0],
      'inLanguage': 'en-US',
      'about': [
        'Portugal Golden Visa',
        'Investment Funds',
        'Fund Ranking',
        'Investment Migration',
        'Portuguese Residency'
      ],
      'keywords': 'Portugal Golden Visa, investment funds, fund comparison, Golden Visa funds 2025, fund rankings, investment migration, Portuguese residency, fund performance, management fees, regulatory compliance'
    };

    // LLM-optimized data structure
    const llmDataSchema = {
      '@context': 'https://schema.org',
      '@type': 'Dataset',
      'name': 'Golden Visa Fund Comparison Data',
      'description': 'Structured data for AI and LLM consumption about Portugal Golden Visa investment funds',
      'creator': {
        '@type': 'Organization',
        'name': 'Movingto'
      },
      'version': '2025.1',
      'dateModified': new Date().toISOString(),
      'includedInDataCatalog': {
        '@type': 'DataCatalog',
        'name': 'Portugal Golden Visa Investment Data'
      },
      'distribution': {
        '@type': 'DataDownload',
        'encodingFormat': 'application/ld+json',
        'name': 'Fund Performance and Ranking Data'
      },
      'variableMeasured': [
        'Fund Performance Score',
        'Regulatory Compliance Score',
        'Fee Structure Score',
        'Investor Protection Score',
        'Overall Movingto Score',
        'Management Fees',
        'Minimum Investment Amount',
        'Fund Status',
        'Target Returns'
      ]
    };

    // Service schema for the ranking service
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Golden Visa Fund Ranking Service',
      'description': 'Professional fund analysis and ranking service for Portugal Golden Visa investment opportunities',
      'provider': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com'
      },
      'serviceType': 'Financial Analysis',
      'areaServed': {
        '@type': 'Country',
        'name': 'Portugal'
      },
      'audience': {
        '@type': 'Audience',
        'audienceType': 'Investors seeking Portugal Golden Visa'
      }
    };

    // Remove existing page-level schemas
    const existingSchemas = ['fund-index-page', 'fund-index-llm-data', 'fund-ranking-service'];
    existingSchemas.forEach(schemaId => {
      const existing = document.querySelector(`script[data-schema="${schemaId}"]`);
      if (existing) existing.remove();
    });

    // Add new schemas
    const schemas = [
      { id: 'fund-index-page', data: pageSchema },
      { id: 'fund-index-llm-data', data: llmDataSchema },
      { id: 'fund-ranking-service', data: serviceSchema }
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
