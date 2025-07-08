
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class ComparisonPageSEOService extends BaseSEOService {
  static getComparisonPageSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: 'Compare Funds | Portugal Golden Visa Investment Funds',
      description: 'Compare Portugal Golden Visa investment funds side-by-side. Analyze fees, returns, minimum investments, and more.',
      url: `${baseUrl}/compare`,
      structuredData: {}
    };
  }

  static getComparisonsHubSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: 'Fund Comparisons Hub | Portugal Golden Visa Investment Funds',
      description: 'Browse detailed fund comparisons for Portugal Golden Visa investment funds.',
      url: `${baseUrl}/comparisons`,
      structuredData: {}
    };
  }

  static getFundComparisonSEO(comparisonTitle: string): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: `${comparisonTitle} | Fund Comparison`,
      description: `Detailed comparison of Portugal Golden Visa investment funds: ${comparisonTitle}`,
      url: `${baseUrl}/compare/${this.slugify(comparisonTitle)}`,
      structuredData: {}
    };
  }

  static getROICalculatorSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: 'ROI Calculator | Portugal Golden Visa Investment Funds',
      description: 'Calculate potential returns on Portugal Golden Visa fund investments with our free ROI calculator.',
      url: `${baseUrl}/roi-calculator`,
      structuredData: {}
    };
  }

  static getFundQuizSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: 'Fund Quiz | Find Your Perfect Golden Visa Investment',
      description: 'Take our quiz to get personalized Portugal Golden Visa fund recommendations based on your investment profile.',
      url: `${baseUrl}/fund-quiz`,
      structuredData: {}
    };
  }
}
