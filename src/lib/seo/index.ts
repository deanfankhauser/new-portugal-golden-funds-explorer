// Main SEO module exports
export * from './types';
export * from './constants';
export * from './utils';
export * from './pages';
export * from './schemas';

// Re-export for convenient access
export {
  getHomeSeo,
  getFundSeo,
  getFundFallbackSeo,
  getFundAlternativesSeo,
  getComparisonSeo,
  getFundComparisonSeo,
  getFundComparisonFallbackSeo,
  getCategorySeo,
  getTagSeo,
  getManagerSeo,
  getFAQsSeo,
  getROICalculatorSeo,
  getVerifiedFundsSeo,
  getNotFoundSeo,
  getTeamMemberSeo,
  getBestFundsSeo,
  getUSCitizensFundsSeo
} from './pages';
