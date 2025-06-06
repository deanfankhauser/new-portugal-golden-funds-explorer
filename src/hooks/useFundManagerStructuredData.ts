
import { useEffect } from 'react';
import { FundManagerStructuredDataService } from '../services/fundManagerStructuredDataService';
import { StructuredDataService } from '../services/structuredDataService';

// Import from the new types file
export type { FundManagerData } from '../types/fundManagerTypes';
import type { FundManagerData } from '../types/fundManagerTypes';

export const useFundManagerStructuredData = (managerData: FundManagerData) => {
  useEffect(() => {
    // Generate all structured data schemas for the fund manager
    const schemas = [
      FundManagerStructuredDataService.generateWebSiteSchema(),
      FundManagerStructuredDataService.generateMovingtoOrganizationSchema(),
      FundManagerStructuredDataService.generateFundManagerOrganizationSchema(managerData),
      FundManagerStructuredDataService.generateManagerFundsCollectionSchema(managerData),
      FundManagerStructuredDataService.generateManagerPageSchema(managerData),
      FundManagerStructuredDataService.generateManagerArticleSchema(managerData),
      FundManagerStructuredDataService.generateFinancialServiceSchema(managerData)
    ];

    // Add structured data to page
    StructuredDataService.addStructuredData(schemas, 'fund-manager-page-schema');

    // Cleanup function to remove structured data when component unmounts
    return () => {
      StructuredDataService.removeStructuredData('fund-manager-page-schema');
    };
  }, [managerData]);
};
