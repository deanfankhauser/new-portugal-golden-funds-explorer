
import { StructuredDataSchema } from './structuredDataService';
import { URL_CONFIG } from '../utils/urlConfig';

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
  
  // Generate WebSite schema
  static generateWebSiteSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Movingto',
      'url': URL_CONFIG.BASE_URL,
      'description': 'Find and compare the best Golden Visa investment funds in Portugal',
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${URL_CONFIG.BASE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    };
  }

  // Generate Organization schema for Movingto
  static generateMovingtoOrganizationSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Movingto',
      'url': URL_CONFIG.BASE_URL,
      'logo': 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg',
      'description': 'Leading platform for Golden Visa investment fund comparison and research',
      'founder': {
        '@type': 'Person',
        'name': 'Dean Fankhauser'
      },
      'knowsAbout': ['Golden Visa', 'Portugal Investment', 'Investment Funds', 'Fund Managers'],
      'serviceArea': {
        '@type': 'Place',
        'name': 'Worldwide'
      }
    };
  }

  // Generate Organization schema for the fund manager
  static generateFundManagerOrganizationSchema(managerData: FundManagerData): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': managerData.name,
      'url': URL_CONFIG.buildManagerUrl(managerData.name),
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
        'url': URL_CONFIG.buildFundUrl(fund.id),
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
        '@id': URL_CONFIG.buildManagerUrl(managerData.name)
      },
      'name': `${managerData.name} Golden Visa Investment Funds`,
      'description': `Explore all Golden Visa investment funds managed by ${managerData.name}. Compare ${managerData.fundsCount} funds with combined assets of €${managerData.totalFundSize} million.`,
      'numberOfItems': managerData.fundsCount,
      'author': {
        '@type': 'Person',
        'name': 'Dean Fankhauser',
        'jobTitle': 'CEO',
        'worksFor': {
          '@type': 'Organization',
          'name': 'Movingto'
        }
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL
      },
      'dateModified': new Date().toISOString(),
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
            'url': URL_CONFIG.buildFundUrl(fund.id),
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
            'item': URL_CONFIG.BASE_URL
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Fund Managers',
            'item': URL_CONFIG.buildUrl('managers')
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': managerData.name,
            'item': URL_CONFIG.buildManagerUrl(managerData.name)
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
      'url': URL_CONFIG.buildManagerUrl(managerData.name),
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
            'item': URL_CONFIG.BASE_URL
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Fund Managers',
            'item': URL_CONFIG.buildUrl('managers')
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': managerData.name,
            'item': URL_CONFIG.buildManagerUrl(managerData.name)
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

  // Generate Article schema for manager profile content
  static generateManagerArticleSchema(managerData: FundManagerData): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': `${managerData.name} Fund Manager Profile`,
      'description': `Learn about ${managerData.name}, managing ${managerData.fundsCount} Golden Visa investment funds with €${managerData.totalFundSize} million in combined assets.`,
      'author': {
        '@type': 'Person',
        'name': 'Dean Fankhauser',
        'jobTitle': 'CEO'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg'
        }
      },
      'datePublished': new Date().toISOString(),
      'dateModified': new Date().toISOString(),
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': URL_CONFIG.buildManagerUrl(managerData.name)
      },
      'articleSection': 'Fund Managers',
      'keywords': [managerData.name, 'Golden Visa', 'Portugal', 'Investment Funds', 'Fund Manager'].join(', ')
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
