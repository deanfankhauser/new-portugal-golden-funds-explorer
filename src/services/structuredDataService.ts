
import { Fund } from '../data/funds';
import { URL_CONFIG } from '../utils/urlConfig';
import { DateManagementService } from './dateManagementService';
import { EnhancedSEODateService } from './enhancedSEODateService';

export interface StructuredDataSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export class StructuredDataService {
  
  // Generate Product schema for a fund with proper dating
  static generateFundProductSchema(fund: Fund): StructuredDataSchema {
    const contentDates = DateManagementService.getFundContentDates(fund);
    const temporalCoverage = EnhancedSEODateService.generateTemporalCoverage(fund);
    
    return {
      '@context': 'https://schema.org',
      '@type': 'FinancialProduct',
      'name': fund.name,
      'description': fund.description,
      'category': fund.category,
      'datePublished': contentDates.datePublished,
      'dateModified': contentDates.dateModified,
      'contentReferenceTime': EnhancedSEODateService.generateContentReferenceTime(fund),
      ...(temporalCoverage && { 'temporalCoverage': temporalCoverage }),
      'provider': {
        '@type': 'Organization',
        'name': fund.managerName,
        'url': fund.websiteUrl,
        'foundingDate': fund.established.toString()
      },
      'offers': {
        '@type': 'Offer',
        'price': fund.minimumInvestment,
        'priceCurrency': 'EUR',
        'availability': fund.fundStatus === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        'priceSpecification': {
          '@type': 'PriceSpecification',
          'price': fund.minimumInvestment,
          'priceCurrency': 'EUR',
          'valueAddedTaxIncluded': false
        }
      },
      'additionalProperty': [
        {
          '@type': 'PropertyValue',
          'name': 'Management Fee',
          'value': `${fund.managementFee}%`
        },
        {
          '@type': 'PropertyValue',
          'name': 'Performance Fee',
          'value': `${fund.performanceFee}%`
        },
        {
          '@type': 'PropertyValue',
          'name': 'Fund Size',
          'value': `${fund.fundSize} Million EUR`
        },
        {
          '@type': 'PropertyValue',
          'name': 'Term',
          'value': fund.term === 0 ? 'Perpetual' : `${fund.term} years`
        },
        {
          '@type': 'PropertyValue',
          'name': 'Target Return',
          'value': fund.returnTarget
        }
      ],
      'keywords': fund.tags.join(', '),
      'url': URL_CONFIG.buildFundUrl(fund.id),
      'identifier': fund.id
    };
  }

  // Generate Organization schema for fund manager
  static generateFundManagerSchema(fund: Fund): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      'name': fund.managerName,
      'foundingDate': fund.established.toString(),
      'address': {
        '@type': 'PostalAddress',
        'addressCountry': 'PT',
        'addressRegion': fund.location
      },
      'url': fund.websiteUrl,
      'knowsAbout': fund.category,
      'serviceArea': {
        '@type': 'Place',
        'name': 'Portugal'
      }
    };
  }

  // Generate Investment schema
  static generateInvestmentSchema(fund: Fund): StructuredDataSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Investment',
      'name': `Investment in ${fund.name}`,
      'description': `Investment opportunity in ${fund.name} managed by ${fund.managerName}`,
      'investmentType': fund.category,
      'minimumInvestment': {
        '@type': 'MonetaryAmount',
        'currency': 'EUR',
        'value': fund.minimumInvestment
      },
      'expectedReturn': fund.returnTarget,
      'riskLevel': fund.tags.includes('Low-risk') ? 'Low' : 
                   fund.tags.includes('Medium-risk') ? 'Medium' : 
                   fund.tags.includes('High-risk') ? 'High' : 'Medium',
      'provider': {
        '@type': 'Organization',
        'name': fund.managerName
      }
    };
  }

  // Generate WebPage schema for fund detail page with comprehensive dating
  static generateFundPageSchema(fund: Fund): StructuredDataSchema {
    const contentDates = DateManagementService.getFundContentDates(fund);
    
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': `${fund.name} | Fund Details`,
      'description': fund.description,
      'url': URL_CONFIG.buildFundUrl(fund.id),
      'datePublished': contentDates.datePublished,
      'dateModified': contentDates.dateModified,
      'lastReviewed': contentDates.dataLastVerified,
      'mainEntity': {
        '@type': 'FinancialProduct',
        'name': fund.name,
        'identifier': fund.id
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
            'name': 'Funds',
            'item': `${URL_CONFIG.BASE_URL}/#funds`
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': fund.name,
            'item': URL_CONFIG.buildFundUrl(fund.id)
          }
        ]
      },
    };
  }

  // Add structured data to page head
  static addStructuredData(schemas: StructuredDataSchema[], dataId: string = 'structured-data'): void {
    // Remove existing structured data
    const existingScript = document.querySelector(`script[data-schema="${dataId}"]`);
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-schema', dataId);
    
    // If multiple schemas, wrap in array
    const schemaContent = schemas.length === 1 ? schemas[0] : schemas;
    
    // Ensure all schemas have @context before adding to DOM
    try {
      const validatedContent = Array.isArray(schemaContent) 
        ? schemaContent.map(item => ({
            '@context': 'https://schema.org',
            ...item
          }))
        : {
            '@context': 'https://schema.org',
            ...schemaContent
          };
      
      script.textContent = JSON.stringify(validatedContent, null, 2);
      document.head.appendChild(script);
    } catch (error) {
      console.warn('Failed to add structured data:', error);
    }
  }

  // Remove structured data from page head
  static removeStructuredData(dataId: string = 'structured-data'): void {
    const script = document.querySelector(`script[data-schema="${dataId}"]`);
    if (script) {
      script.remove();
    }
  }
}
