
import { Fund } from '../data/funds';
import { StructuredDataSchema } from './structuredDataService';
import { URL_CONFIG } from '../utils/urlConfig';

export class EnhancedStructuredDataService {
  
  // Generate FAQ schema for fund pages
  static generateFundFAQSchema(fund: Fund): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': [
        {
          '@type': 'Question',
          'name': `What is the minimum investment for ${fund.name}?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `The minimum investment for ${fund.name} is €${fund.minimumInvestment.toLocaleString()}.`
          }
        },
        {
          '@type': 'Question',
          'name': `What is the expected return for ${fund.name}?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `${fund.name} targets a return of ${fund.returnTarget}.`
          }
        },
        {
          '@type': 'Question',
          'name': `What is the management fee for ${fund.name}?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `The management fee for ${fund.name} is ${fund.managementFee}% annually.`
          }
        },
        {
          '@type': 'Question',
          'name': `Is ${fund.name} eligible for Portugal Golden Visa?`,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': `${fund.name} eligibility for Portugal Golden Visa depends on current regulations. Since October 2023, real estate-linked funds are not eligible. Please consult with legal professionals for current eligibility status.`
          }
        }
      ]
    };
  }

  // Generate HowTo schema for investment process
  static generateInvestmentHowToSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': 'How to Invest in Portugal Golden Visa Funds',
      'description': 'Step-by-step guide to investing in Portuguese Golden Visa investment funds',
      'totalTime': 'P30D',
      'estimatedCost': {
        '@type': 'MonetaryAmount',
        'currency': 'EUR',
        'value': '500000'
      },
      'supply': [
        {
          '@type': 'HowToSupply',
          'name': 'Valid passport'
        },
        {
          '@type': 'HowToSupply',
          'name': 'Clean criminal record'
        },
        {
          '@type': 'HowToSupply',
          'name': 'Proof of funds'
        }
      ],
      'step': [
        {
          '@type': 'HowToStep',
          'position': 1,
          'name': 'Choose Investment Fund',
          'text': 'Select a qualified Portuguese investment fund from our directory',
          'url': URL_CONFIG.BASE_URL
        },
        {
          '@type': 'HowToStep',
          'position': 2,
          'name': 'Due Diligence',
          'text': 'Review fund documentation, fees, and investment strategy'
        },
        {
          '@type': 'HowToStep',
          'position': 3,
          'name': 'Make Investment',
          'text': 'Invest minimum €500,000 in the chosen fund'
        },
        {
          '@type': 'HowToStep',
          'position': 4,
          'name': 'Submit Application',
          'text': 'Submit Golden Visa application with investment proof'
        },
        {
          '@type': 'HowToStep',
          'position': 5,
          'name': 'Await Approval',
          'text': 'Wait for application processing (typically 8-12 months)'
        }
      ]
    };
  }

  // Generate Table schema for comparison data
  static generateComparisonTableSchema(funds: Fund[]): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Table',
      'about': 'Portugal Golden Visa Investment Funds Comparison',
      'description': 'Detailed comparison of investment funds eligible for Portugal Golden Visa',
      'mainEntity': {
        '@type': 'Dataset',
        'name': 'Fund Comparison Data',
        'description': 'Structured data comparing Portuguese investment funds',
        'variableMeasured': [
          {
            '@type': 'PropertyValue',
            'name': 'Minimum Investment',
            'description': 'Required minimum investment amount in EUR'
          },
          {
            '@type': 'PropertyValue',
            'name': 'Management Fee',
            'description': 'Annual management fee percentage'
          },
          {
            '@type': 'PropertyValue',
            'name': 'Target Return',
            'description': 'Expected annual return'
          },
          {
            '@type': 'PropertyValue',
            'name': 'Fund Size',
            'description': 'Total fund size in millions EUR'
          }
        ],
        'distribution': funds.map(fund => ({
          '@type': 'DataDownload',
          'name': fund.name,
          'description': fund.description,
          'contentUrl': URL_CONFIG.buildFundUrl(fund.id)
        }))
      }
    };
  }

  // Generate Article schema for informational content
  static generateArticleSchema(title: string, description: string, url: string): StructuredDataSchema {
    const currentDate = new Date().toISOString().split('T')[0];
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': title,
      'description': description,
      'url': url,
      'datePublished': currentDate,
      'dateModified': currentDate,
      'author': {
        '@type': 'Person',
        'name': 'Dean Fankhauser, CEO',
        'jobTitle': 'CEO',
        'worksFor': {
          '@type': 'Organization',
          'name': 'Movingto'
        }
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg'
        }
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': url
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
            'name': title,
            'item': url
          }
        ]
      }
    };
  }

  // Generate Event schema for fund launches/deadlines
  static generateFundEventSchema(fund: Fund): StructuredDataSchema | null {
    // Only generate if fund has specific deadlines or is closing soon
    if (fund.fundStatus !== 'Closing Soon') {
      return null;
    }

    const currentDate = new Date();
    const futureDate = new Date(currentDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      'name': `${fund.name} Investment Deadline`,
      'description': `Last chance to invest in ${fund.name} before it closes to new investors`,
      'startDate': currentDate.toISOString(),
      'endDate': futureDate.toISOString(),
      'eventStatus': 'https://schema.org/EventScheduled',
      'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
      'location': {
        '@type': 'VirtualLocation',
        'url': URL_CONFIG.buildFundUrl(fund.id)
      },
      'organizer': {
        '@type': 'Organization',
        'name': fund.managerName
      },
      'offers': {
        '@type': 'Offer',
        'price': fund.minimumInvestment,
        'priceCurrency': 'EUR',
        'availability': 'https://schema.org/LimitedAvailability'
      }
    };
  }

  // Generate comprehensive structured data for a fund page
  static generateComprehensiveFundSchemas(fund: Fund): StructuredDataSchema[] {
    const schemas = [
      this.generateFundFAQSchema(fund),
      this.generateInvestmentHowToSchema()
    ];

    const eventSchema = this.generateFundEventSchema(fund);
    if (eventSchema) {
      schemas.push(eventSchema);
    }

    return schemas;
  }

  // Generate WebSite schema for homepage
  static generateWebSiteSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Movingto Portugal Golden Visa Funds',
      'alternateName': 'Movingto',
      'url': URL_CONFIG.BASE_URL,
      'description': 'Comprehensive directory of qualified investment funds for the Portugal Golden Visa program',
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto'
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${URL_CONFIG.BASE_URL}?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }

  // Generate Organization schema
  static generateOrganizationSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': 'Movingto',
      'url': URL_CONFIG.BASE_URL,
      'logo': 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg',
      'description': 'Leading platform for Portugal Golden Visa investment funds and residency by investment services',
      'founder': {
        '@type': 'Person',
        'name': 'Dean Fankhauser, CEO'
      },
      'sameAs': [
        'https://twitter.com/movingtoio'
      ]
    };
  }

  // Generate LocalBusiness schema
  static generateLocalBusinessSchema(): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      'name': 'Movingto Portugal Golden Visa Services',
      'url': URL_CONFIG.BASE_URL,
      'description': 'Professional investment guidance services for Portugal Golden Visa eligible funds',
      'serviceType': 'Investment Guidance',
      'areaServed': {
        '@type': 'Country',
        'name': 'Portugal'
      },
      'offers': {
        '@type': 'Service',
        'name': 'Portugal Golden Visa Investment Fund Directory',
        'description': 'Comprehensive directory and guidance services for qualified investment funds'
      }
    };
  }
}
