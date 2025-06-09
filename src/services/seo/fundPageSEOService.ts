
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class FundPageSEOService extends BaseSEOService {
  static getFundPageSEO(fundName: string): SEOData {
    return {
      title: `${fundName} | Investment Fund Details | Movingto`,
      description: `${fundName} - Detailed information about this Golden Visa investment fund. Min investment, fees, returns and more.`,
      url: `${this.baseUrl}/funds/${this.slugify(fundName)}`,
      structuredData: {
        ...this.createBaseStructuredData(),
        '@type': 'FinancialProduct',
        'name': fundName,
        'description': `Golden Visa investment fund: ${fundName}`,
        'provider': {
          '@type': 'Organization',
          'name': 'Fund Manager'
        }
      }
    };
  }

  static getHomepageSEO(): SEOData {
    return {
      title: 'Portugal Golden Visa Investment Funds | Eligible Investments 2025',
      description: 'Explore our Portugal Golden Visa Investment Funds List for 2025. Find eligible investment funds to secure residency with a €500,000 investment.',
      url: this.baseUrl,
      structuredData: this.createWebSiteSchema()
    };
  }
}
