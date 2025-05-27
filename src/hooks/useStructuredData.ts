
import { useEffect } from 'react';
import { Fund } from '../data/funds';
import { StructuredDataService, StructuredDataSchema } from '../services/structuredDataService';

export const useFundStructuredData = (fund: Fund) => {
  useEffect(() => {
    // Generate all structured data schemas for the fund
    const schemas: StructuredDataSchema[] = [
      StructuredDataService.generateFundProductSchema(fund),
      StructuredDataService.generateFundManagerSchema(fund),
      StructuredDataService.generateInvestmentSchema(fund),
      StructuredDataService.generateFundPageSchema(fund)
    ];

    // Add structured data to page
    StructuredDataService.addStructuredData(schemas, 'fund-page-schema');

    // Cleanup function to remove structured data when component unmounts
    return () => {
      StructuredDataService.removeStructuredData('fund-page-schema');
    };
  }, [fund]);
};
