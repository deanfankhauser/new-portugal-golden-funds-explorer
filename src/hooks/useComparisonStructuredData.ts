
import { useEffect } from 'react';
import { Fund } from '../data/funds';
import { StructuredDataService } from '../services/structuredDataService';
import { ComparisonStructuredDataService } from '../services/comparisonStructuredDataService';

export const useComparisonStructuredData = (
  funds: Fund[], 
  pageType: 'comparison' | 'fund-vs-fund' = 'comparison'
) => {
  useEffect(() => {
    if (funds.length === 0) return;

    // Generate all structured data schemas for the comparison
    const schemas = [
      ComparisonStructuredDataService.generateComparisonPageSchema(funds, pageType),
      ComparisonStructuredDataService.generateComparisonItemListSchema(funds),
      ComparisonStructuredDataService.generateCompareActionSchema(funds)
    ];

    // Add structured data to page
    StructuredDataService.addStructuredData(schemas, 'comparison-page-schema');

    // Cleanup function to remove structured data when component unmounts
    return () => {
      StructuredDataService.removeStructuredData('comparison-page-schema');
    };
  }, [funds, pageType]);
};
