
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class FundPageSEOService extends BaseSEOService {
  static getFundPageSEO(fundName: string): SEOData {
    console.log('FundPageSEOService: Generating SEO for fund:', fundName);
    
    if (!fundName || fundName.trim() === '') {
      console.error('FundPageSEOService: Empty or invalid fund name provided:', fundName);
      return this.getHomepageSEO(); // Fallback to homepage SEO
    }

    const cleanFundName = fundName.trim();
    const title = `${cleanFundName} | Investment Fund Details | Movingto`;
    
    console.log('FundPageSEOService: Generated fund page title:', title);
    
    const seoData = {
      title: title,
      description: `${cleanFundName} - Detailed information about this Golden Visa investment fund. Min investment, fees, returns and more.`,
      url: `${this.baseUrl}/funds/${this.slugify(cleanFundName)}`,
      structuredData: {
        ...this.createBaseStructuredData(),
        '@type': 'FinancialProduct',
        'name': cleanFundName,
        'description': `Golden Visa investment fund: ${cleanFundName}`,
        'provider': {
          '@type': 'Organization',
          'name': 'Fund Manager'
        }
      }
    };

    console.log('FundPageSEOService: Final fund SEO data:', seoData);
    return seoData;
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
