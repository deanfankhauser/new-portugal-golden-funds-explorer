import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';
import { fundsData } from '../../data/mock/funds';
import { EnhancedHomepageSEOService } from './enhancedHomepageSEOService';

export class FundPageSEOService extends BaseSEOService {
  
  static getHomepageSEO(): SEOData {
    console.log('🔥 FundPageSEOService: Generating enhanced homepage SEO');
    return EnhancedHomepageSEOService.getEnhancedHomepageSEO();
  }

  static getFundPageSEO(fundName: string): SEOData {
    console.log('🔥 FundPageSEOService: Generating fund page SEO for:', fundName);
    
    const fund = fundsData.find(f => f.name === fundName);
    
    if (!fund) {
      console.error('🔥 FundPageSEOService: Fund not found:', fundName);
      return this.getHomepageSEO();
    }

    const baseUrl = this.getContextualBaseUrl();
    const fundUrl = `${baseUrl}/${fund.id}`;
    
    // Enhanced fund-specific structured data
    const structuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        // Financial Product Schema
        {
          '@type': 'FinancialProduct',
          '@id': `${fundUrl}/#financialproduct`,
          'name': fund.name,
          'description': fund.description,
          'category': fund.category,
          'url': fundUrl,
          'identifier': fund.id,
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
            'validFrom': new Date().toISOString(),
            'priceSpecification': {
              '@type': 'PriceSpecification',
              'price': fund.minimumInvestment,
              'priceCurrency': 'EUR',
              'valueAddedTaxIncluded': false,
              'description': 'Minimum investment amount for Golden Visa eligibility'
            }
          },
          'additionalProperty': [
            {
              '@type': 'PropertyValue',
              'name': 'Management Fee',
              'value': `${fund.managementFee}%`,
              'description': 'Annual management fee percentage'
            },
            {
              '@type': 'PropertyValue',
              'name': 'Performance Fee',
              'value': `${fund.performanceFee}%`,
              'description': 'Performance-based fee percentage'
            },
            {
              '@type': 'PropertyValue',
              'name': 'Fund Size',
              'value': `${fund.fundSize} Million EUR`,
              'description': 'Total assets under management'
            },
            {
              '@type': 'PropertyValue',
              'name': 'Investment Term',
              'value': fund.term === 0 ? 'Perpetual' : `${fund.term} years`,
              'description': 'Minimum investment holding period'
            },
            {
              '@type': 'PropertyValue',
              'name': 'Target Return',
              'value': fund.returnTarget,
              'description': 'Expected annual return percentage'
            },
            {
              '@type': 'PropertyValue',
              'name': 'Golden Visa Eligible',
              'value': 'Yes',
              'description': 'Qualified for Portugal Golden Visa program'
            }
          ],
          'keywords': [...fund.tags, 'Golden Visa', 'Portugal Investment', 'Residency'].join(', '),
          'audience': {
            '@type': 'Audience',
            'name': 'Golden Visa Investors',
            'description': 'Investors seeking Portuguese residency through investment'
          }
        },
        // Investment Schema
        {
          '@type': 'Investment',
          'name': `Investment in ${fund.name}`,
          'description': `Golden Visa investment opportunity in ${fund.name} managed by ${fund.managerName}`,
          'investmentType': fund.category,
          'minimumInvestment': {
            '@type': 'MonetaryAmount',
            'currency': 'EUR',
            'value': fund.minimumInvestment
          },
          'expectedReturn': fund.returnTarget,
          'riskLevel': this.determineRiskLevel(fund.tags),
          'provider': {
            '@type': 'Organization',
            'name': fund.managerName,
            'url': fund.websiteUrl
          },
          'geo': {
            '@type': 'Country',
            'name': 'Portugal'
          }
        },
        // WebPage Schema
        {
          '@type': 'WebPage',
          '@id': `${fundUrl}/#webpage`,
          'name': `${fund.name} | Golden Visa Fund Details & Analysis`,
          'description': `Comprehensive analysis of ${fund.name} - ${fund.category} fund managed by ${fund.managerName}. Minimum investment: €${fund.minimumInvestment.toLocaleString()}, Management fee: ${fund.managementFee}%.`,
          'url': fundUrl,
          'mainEntity': {
            '@id': `${fundUrl}/#financialproduct`
          },
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': baseUrl
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Funds',
                'item': `${baseUrl}/#funds`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': fund.name,
                'item': fundUrl
              }
            ]
          },
          'potentialAction': [
            {
              '@type': 'CompareAction',
              'name': 'Compare Fund',
              'description': `Compare ${fund.name} with other Golden Visa investment funds`,
              'target': `${baseUrl}/compare`
            },
            {
              '@type': 'AnalyzeAction',
              'name': 'Calculate ROI',
              'description': `Calculate potential returns for ${fund.name}`,
              'target': `${baseUrl}/roi-calculator`
            }
          ],
          'isPartOf': {
            '@id': `${baseUrl}/#website`
          }
        }
      ]
    };

    const optimizedTitle = `${fund.name} | ${fund.category} Golden Visa Fund - €${fund.minimumInvestment.toLocaleString()} Min Investment`;
    const optimizedDescription = `${fund.name} Golden Visa fund analysis: ${fund.category} investment managed by ${fund.managerName}. Min: €${fund.minimumInvestment.toLocaleString()}, Fees: ${fund.managementFee}%/${fund.performanceFee}%, Target return: ${fund.returnTarget} with premium metrics for MovingTo clients. Compare features & apply today.`;

    console.log('🔥 FundPageSEOService: Generated fund SEO:', { title: optimizedTitle, url: fundUrl });

    return {
      title: optimizedTitle,
      description: optimizedDescription,
      url: fundUrl,
      structuredData
    };
  }

  private static determineRiskLevel(tags: string[]): string {
    if (tags.some(tag => tag.includes('Low Risk'))) return 'Low';
    if (tags.some(tag => tag.includes('High Risk'))) return 'High';
    if (tags.some(tag => tag.includes('Medium Risk'))) return 'Medium';
    
    // Default risk assessment based on fund characteristics
    if (tags.some(tag => tag.includes('Conservative') || tag.includes('Stable'))) return 'Low';
    if (tags.some(tag => tag.includes('Growth') || tag.includes('Aggressive'))) return 'High';
    
    return 'Medium';
  }
}
