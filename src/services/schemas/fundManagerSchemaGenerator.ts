
import { StructuredDataSchema } from '../structuredDataService';
import { FundManagerData } from '../../types/fundManagerTypes';
import { URL_CONFIG } from '../../utils/urlConfig';

export class FundManagerSchemaGenerator {
  
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
