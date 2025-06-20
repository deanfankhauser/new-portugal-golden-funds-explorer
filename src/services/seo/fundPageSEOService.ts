
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class FundPageSEOService extends BaseSEOService {
  static getFundPageSEO(fundName: string): SEOData {
    console.log('FundPageSEOService: Generating SEO for fund:', fundName);
    
    // Detect proxy context for better debugging
    const proxyContext = this.detectProxyContext();
    console.log('FundPageSEOService: Proxy context:', proxyContext);
    
    if (!fundName || fundName.trim() === '') {
      console.error('FundPageSEOService: Empty or invalid fund name provided:', fundName);
      console.log('FundPageSEOService: Falling back to homepage SEO');
      return this.getHomepageSEO(); // Fallback to homepage SEO
    }

    const cleanFundName = fundName.trim();
    const title = `${cleanFundName} | Investment Fund Details | Movingto`;
    
    // Use contextual base URL
    const contextualBaseUrl = this.getContextualBaseUrl();
    
    console.log('FundPageSEOService: Generated fund page SEO details:', {
      originalFundName: fundName,
      cleanFundName,
      title,
      contextualBaseUrl,
      proxyContext
    });
    
    const seoData = {
      title: title,
      description: `${cleanFundName} - Detailed information about this Golden Visa investment fund. Min investment, fees, returns and more.`,
      url: `${contextualBaseUrl}/funds/${this.slugify(cleanFundName)}`,
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
    const contextualBaseUrl = this.getContextualBaseUrl();
    
    console.log('FundPageSEOService: Generating homepage SEO with contextual URL:', contextualBaseUrl);
    
    return {
      title: 'Portugal Golden Visa Investment Funds | Eligible Investments 2025',
      description: 'Explore our Portugal Golden Visa Investment Funds List for 2025. Find eligible investment funds to secure residency with a €500,000 investment.',
      url: contextualBaseUrl,
      structuredData: this.createWebSiteSchema()
    };
  }
}
