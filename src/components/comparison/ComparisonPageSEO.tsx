
import React from 'react';
import PageSEO from '../common/PageSEO';
import { StructuredDataService } from '../../services/structuredDataService';
import { EnhancedStructuredDataService } from '../../services/enhancedStructuredDataService';
import { URL_CONFIG } from '../../utils/urlConfig';

const ComparisonPageSEO = () => {
  const currentUrl = URL_CONFIG.buildUrl('comparison');

  // Generate structured data schemas
  const schemas = [
    EnhancedStructuredDataService.generateWebSiteSchema(),
    EnhancedStructuredDataService.generateOrganizationSchema(),
    EnhancedStructuredDataService.generateArticleSchema(
      'Portugal Golden Visa Fund Comparison Tool',
      'Compare investment funds for Portugal Golden Visa eligibility with our comprehensive comparison tool',
      currentUrl
    )
  ];

  return (
    <PageSEO
      title="Compare Portugal Golden Visa Investment Funds | Fund Comparison Tool"
      description="Compare Portugal Golden Visa investment funds side-by-side. Analyze fees, returns, and requirements to find the best fund for your EU residency investment."
      keywords="Portugal Golden Visa Comparison, Investment Fund Comparison, Golden Visa Tool, Fund Analysis, EU Residency"
      canonicalUrl={currentUrl}
      ogTitle="Portugal Golden Visa Fund Comparison Tool"
      ogDescription="Compare Golden Visa investment funds for Portugal residency. Side-by-side analysis of fees, returns, and requirements."
      twitterTitle="Golden Visa Fund Comparison Tool"
      twitterDescription="Compare Golden Visa investment funds for Portugal residency. Side-by-side analysis of fees, returns, and requirements."
      imageAlt="Portugal Golden Visa Fund Comparison Tool"
      schemas={schemas}
      schemaId="comparison-page"
    />
  );
};

export default ComparisonPageSEO;
