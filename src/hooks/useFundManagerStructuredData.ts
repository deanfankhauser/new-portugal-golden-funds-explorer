
import { useEffect } from 'react';
import { FundManagerStructuredDataService, FundManagerData } from '../services/fundManagerStructuredDataService';
import { StructuredDataService } from '../services/structuredDataService';

export { FundManagerData } from '../services/fundManagerStructuredDataService';

export const useFundManagerStructuredData = (managerData: FundManagerData) => {
  useEffect(() => {
    // Generate all structured data schemas for the fund manager
    const schemas = [
      FundManagerStructuredDataService.generateFundManagerOrganizationSchema(managerData),
      FundManagerStructuredDataService.generateManagerFundsCollectionSchema(managerData),
      FundManagerStructuredDataService.generateManagerPageSchema(managerData),
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
