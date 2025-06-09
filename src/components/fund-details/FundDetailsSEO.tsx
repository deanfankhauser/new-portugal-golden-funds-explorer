
import React from 'react';
import PageSEO from '../common/PageSEO';
import { Fund } from '../../data/funds';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { FUND_META_DATA } from '../../data/metaData';
import { URL_CONFIG } from '../../utils/urlConfig';

interface FundDetailsSEOProps {
  fund: Fund;
}

const FundDetailsSEO: React.FC<FundDetailsSEOProps> = ({ fund }) => {
  const currentUrl = URL_CONFIG.buildFundUrl(fund.id);
  const metaData = FUND_META_DATA[fund.id];

  if (!metaData) {
    console.error('FundDetailsSEO: No meta data found for fund:', fund.id);
    return null;
  }

  // Generate comprehensive structured data
  const schemas = [
    StructuredDataService.generateFundProductSchema(fund),
    StructuredDataService.generateFundManagerSchema(fund),
    StructuredDataService.generateInvestmentSchema(fund),
    StructuredDataService.generateFundPageSchema(fund),
    ...EnhancedStructuredDataService.generateComprehensiveFundSchemas(fund),
    EnhancedStructuredDataService.generateWebSiteSchema(),
    EnhancedStructuredDataService.generateOrganizationSchema(),
    EnhancedStructuredDataService.generateArticleSchema(
      metaData.title,
      metaData.description,
      currentUrl
    )
  ];

  return (
    <PageSEO
      title={metaData.title}
      description={metaData.description}
      keywords={metaData.keywords}
      canonicalUrl={currentUrl}
      ogTitle={metaData.ogTitle}
      ogDescription={metaData.ogDescription}
      twitterTitle={metaData.twitterTitle}
      twitterDescription={metaData.twitterDescription}
      imageAlt={metaData.imageAlt}
      schemas={schemas}
      schemaId="fund-page-schema"
    />
  );
};

export default FundDetailsSEO;
