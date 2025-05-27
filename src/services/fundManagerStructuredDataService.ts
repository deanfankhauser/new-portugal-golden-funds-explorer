
import { StructuredDataSchema } from './structuredDataService';

export interface FundManagerData {
  name: string;
  logo?: string;
  fundsCount: number;
  totalFundSize: number;
  funds: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    minimumInvestment: number;
    fundSize: number;
    returnTarget: string;
  }>;
}

export class FundManagerStructuredDataService {
  
  // Generate Organization schema for the fund manager
  static generateFundManagerOrganizationSchema(managerData: FundManagerData): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': managerData.name,
      'url': `${window.location.origin}/manager/${encodeURIComponent(managerData.name)}`,
      'logo': managerData.logo,
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'PT'
      },
      'areaServed': {
        '@type': 'Place',
        'name': 'Portugal'
      },
      'serviceType': 'Investment Fund Management',
      'knowsAbout': 'Golden Visa Investment Funds',
      'numberOfEmployees': {
        '@type': 'QuantitativeValue',
        'value': 'Professional investment team'
      },
      'owns': managerData.funds.map(fund => ({
        '@type': 'FinancialProduct',
        'name': fund.name,
        'url': `${window.location.origin}/funds/${fund.id}`,
        'category': fund.category
      }))
    };
  }

  // Generate CollectionPage schema for manager's fund collection
  static generateManagerFundsCollectionSchema(managerData: FundManagerData): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${window.location.origin}/manager/${encodeURIComponent(managerData.name)}`
      },
      'name': `${managerData.name} Golden Visa Investment Funds`,
      'description': `Explore all Golden Visa investment funds managed by ${managerData.name}. Compare ${managerData.fundsCount} funds with combined assets of €${managerData.totalFundSize} million.`,
      'numberOfItems': managerData.fundsCount,
      'mainEntity': {
        '@type': 'ItemList',
        'numberOfItems': managerData.fundsCount,
        'itemListElement': managerData.funds.map((fund, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'description': fund.description,
            'url': `${window.location.origin}/funds/${fund.id}`,
            'category': fund.category,
            'provider': {
              '@type': 'Organization',
              'name': managerData.name
            },
            'offers': {
              '@type': 'Offer',
              'price': fund.minimumInvestment,
              'priceCurrency': 'EUR'
            },
            'additionalProperty': [
              {
                '@type': 'PropertyValue',
                'name': 'Fund Size',
                'value': `${fund.fundSize} Million EUR`
              },
              {
                '@type': 'PropertyValue',
                'name': 'Target Return',
                'value': fund.returnTarget
              }
            ]
          }
        }))
      },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': window.location.origin
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Fund Managers',
            'item': `${window.location.origin}/managers`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': managerData.name,
            'item': `${window.location.origin}/manager/${encodeURIComponent(managerData.name)}`
          }
        ]
      }
    };
  }

  // Generate WebPage schema for the manager page
  static generateManagerPageSchema(managerData: FundManagerData): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': `${managerData.name} | Fund Manager Profile`,
      'description': `Learn about ${managerData.name}, managing ${managerData.fundsCount} Golden Visa investment funds with €${managerData.totalFundSize} million in combined assets.`,
      'url': `${window.location.origin}/manager/${encodeURIComponent(managerData.name)}`,
      'mainEntity': {
        '@type': 'Organization',
        'name': managerData.name
      },
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': window.location.origin
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Fund Managers',
            'item': `${window.location.origin}/managers`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': managerData.name,
            'item': `${window.location.origin}/manager/${encodeURIComponent(managerData.name)}`
          }
        ]
      },
      'potentialAction': {
        '@type': 'ViewAction',
        'name': 'View Fund Manager Profile',
        'description': `View detailed information about ${managerData.name} and their investment funds`
      }
    };
  }

  // Generate FinancialService schema
  static generateFinancialServiceSchema(managerData: FundManagerData): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      'name': `${managerData.name} Investment Management`,
      'description': `Professional investment fund management services by ${managerData.name} specializing in Golden Visa eligible funds.`,
      'provider': {
        '@type': 'Organization',
        'name': managerData.name
      },
      'serviceType': 'Investment Fund Management',
      'areaServed': {
        '@type': 'Place',
        'name': 'Portugal'
      },
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': `${managerData.name} Investment Funds`,
        'numberOfItems': managerData.fundsCount,
        'itemListElement': managerData.funds.map(fund => ({
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'category': fund.category
          },
          'price': fund.minimumInvestment,
          'priceCurrency': 'EUR'
        }))
      }
    };
  }
}
