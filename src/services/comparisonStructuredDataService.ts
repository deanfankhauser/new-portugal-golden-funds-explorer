
import { Fund } from '../data/funds';
import { StructuredDataSchema } from './structuredDataService';
import { URL_CONFIG } from '../utils/urlConfig';

export class ComparisonStructuredDataService {
  
  // Generate WebPage schema for comparison pages with Compare action
  static generateComparisonPageSchema(funds: Fund[], pageType: 'comparison' | 'fund-vs-fund'): StructuredDataSchema {
    const fundNames = funds.map(f => f.name).join(' vs ');
    const pageTitle = pageType === 'fund-vs-fund' 
      ? `${fundNames} | Fund Comparison`
      : 'Compare Investment Funds | Portugal Golden Visa';
    
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': pageTitle,
      'description': pageType === 'fund-vs-fund'
        ? `Detailed comparison of ${fundNames} - side-by-side analysis of fees, returns, minimum investment, and more for Portugal Golden Visa funds.`
        : 'Compare Portugal Golden Visa investment funds side-by-side. Analyze fees, returns, minimum investments, and more to find the best fund for your needs.',
      'url': `https://funds.movingto.com${window.location.pathname}`,
      'mainEntity': {
        '@type': 'ItemList',
        'name': 'Fund Comparison',
        'numberOfItems': funds.length,
        'itemListElement': funds.map((fund, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'identifier': fund.id,
            'url': URL_CONFIG.buildFundUrl(fund.id)
          }
        }))
      },
      'potentialAction': {
        '@type': 'CompareAction',
        'name': 'Compare Investment Funds',
        'description': 'Compare Portugal Golden Visa investment funds',
        'object': funds.map(fund => ({
          '@type': 'FinancialProduct',
          'name': fund.name,
          'identifier': fund.id
        }))
      },
      'breadcrumb': this.generateComparisonBreadcrumb(pageType)
    };
  }

  // Generate ItemList schema for funds being compared
  static generateComparisonItemListSchema(funds: Fund[]): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Investment Fund Comparison',
      'description': 'Side-by-side comparison of Portugal Golden Visa investment funds',
      'numberOfItems': funds.length,
      'itemListElement': funds.map((fund, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'item': {
          '@type': 'FinancialProduct',
          'name': fund.name,
          'description': fund.description,
          'identifier': fund.id,
          'url': URL_CONFIG.buildFundUrl(fund.id),
          'category': fund.category,
          'offers': {
            '@type': 'Offer',
            'price': fund.minimumInvestment,
            'priceCurrency': 'EUR'
          },
          'provider': {
            '@type': 'Organization',
            'name': fund.managerName
          }
        }
      })),
      'mainEntityOfPage': `https://funds.movingto.com${window.location.pathname}`
    };
  }

  // Generate comparison action schema for Google's Compare rich results
  static generateCompareActionSchema(funds: Fund[]): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'CompareAction',
      'name': `Compare ${funds.map(f => f.name).join(' vs ')}`,
      'description': 'Compare investment funds side-by-side',
      'object': funds.map(fund => ({
        '@type': 'FinancialProduct',
        'name': fund.name,
        'identifier': fund.id,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'sameAs': [
          URL_CONFIG.buildFundUrl(fund.id),
          fund.websiteUrl
        ].filter(Boolean)
      })),
      'result': {
        '@type': 'WebPage',
        'name': 'Fund Comparison Results',
        'url': `https://funds.movingto.com${window.location.pathname}`
      }
    };
  }

  // Generate breadcrumb for comparison pages
  private static generateComparisonBreadcrumb(pageType: 'comparison' | 'fund-vs-fund') {
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': URL_CONFIG.BASE_URL
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Comparisons',
        'item': URL_CONFIG.buildUrl('comparisons')
      }
    ];

    if (pageType === 'fund-vs-fund') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': 3,
        'name': 'Fund Comparison',
        'item': `https://funds.movingto.com${window.location.pathname}`
      });
    }

    return {
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbItems
    };
  }
}
