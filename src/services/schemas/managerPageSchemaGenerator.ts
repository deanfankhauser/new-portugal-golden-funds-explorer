
import { StructuredDataSchema } from '../structuredDataService';
import { FundManagerData } from '../../types/fundManagerTypes';
import { URL_CONFIG } from '../../utils/urlConfig';

export class ManagerPageSchemaGenerator {
  
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
        'url': 'https://www.movingto.com'
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
            'item': 'https://www.movingto.com/funds'
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
            'item': 'https://www.movingto.com/funds'
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
}
