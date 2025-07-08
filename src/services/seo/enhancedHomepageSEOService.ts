
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';
import { getAllCategories } from '../../data/services/categories-service';
import { getAllFundManagers } from '../../data/services/managers-service';
import { fundsData } from '../../data/mock/funds';
import { URL_CONFIG } from '../../utils/urlConfig';

export class EnhancedHomepageSEOService extends BaseSEOService {
  static getEnhancedHomepageSEO(): SEOData {
    const baseUrl = URL_CONFIG.BASE_URL; // This ensures we always use the correct URL with www
    const categories = getAllCategories();
    const managers = getAllFundManagers();
    const totalFunds = fundsData.length;
    const totalAUM = fundsData.reduce((sum, fund) => sum + fund.fundSize, 0);

    const enhancedStructuredData = {
      '@context': 'https://schema.org',
      '@graph': [
        // Website Schema
        {
          '@type': 'WebSite',
          '@id': `${baseUrl}/#website`,
          'name': 'Movingto - Portugal Golden Visa Investment Funds',
          'url': baseUrl,
          'description': 'Compare and discover the best Golden Visa-eligible investment funds in Portugal. Expert analysis, comprehensive data, and personalized recommendations.',
          'publisher': {
            '@id': `${baseUrl}/#organization`
          },
          'potentialAction': {
            '@type': 'SearchAction',
            'target': `${baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          },
          'inLanguage': 'en-US',
          'copyrightYear': 2024,
          'copyrightHolder': {
            '@id': `${baseUrl}/#organization`
          }
        },
        // Organization Schema
        {
          '@type': 'Organization',
          '@id': `${baseUrl}/#organization`,
          'name': 'Movingto',
          'url': baseUrl,
          'logo': {
            '@type': 'ImageObject',
            'url': 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg',
            'width': 400,
            'height': 400
          },
          'description': 'Leading platform for Portugal Golden Visa investment fund comparison and analysis',
          'founder': {
            '@type': 'Person',
            'name': 'Dean Fankhauser',
            'jobTitle': 'CEO'
          },
          'knowsAbout': [
            'Portugal Golden Visa',
            'Investment Funds',
            'Fund Management',
            'Portuguese Investment',
            'Residency by Investment'
          ],
          'areaServed': 'Worldwide',
          'serviceType': 'Financial Information Service'
        },
        // Collection Page Schema
        {
          '@type': 'CollectionPage',
          '@id': `${baseUrl}/#collectionpage`,
          'name': 'Portugal Golden Visa Investment Funds Directory',
          'description': `Comprehensive directory of ${totalFunds} Golden Visa-eligible investment funds with €${totalAUM}M+ in assets under management`,
          'url': baseUrl,
          'mainEntity': {
            '@type': 'ItemList',
            'name': 'Golden Visa Investment Funds',
            'numberOfItems': totalFunds,
            'itemListOrder': 'Unordered',
            'description': `Complete list of ${totalFunds} verified Golden Visa investment funds across ${categories.length} categories`
          },
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': baseUrl
              }
            ]
          },
          'significantLink': [
            `${baseUrl}/categories`,
            `${baseUrl}/managers`,
            `${baseUrl}/roi-calculator`,
            `${baseUrl}/fund-quiz`
          ]
        },
        // Service Schema
        {
          '@type': 'Service',
          'name': 'Golden Visa Fund Comparison Service',
          'description': 'Professional fund analysis and comparison service for Portugal Golden Visa investors',
          'provider': {
            '@id': `${baseUrl}/#organization`
          },
          'areaServed': 'Worldwide',
          'audience': {
            '@type': 'Audience',
            'name': 'Golden Visa Investors'
          },
          'serviceType': 'Financial Comparison Service',
          'hasOfferCatalog': {
            '@type': 'OfferCatalog',
            'name': 'Investment Fund Catalog',
            'itemListElement': fundsData.slice(0, 5).map((fund, index) => ({
              '@type': 'Offer',
              'itemOffered': {
                '@type': 'FinancialProduct',
                'name': fund.name,
                'category': fund.category
              },
              'position': index + 1
            }))
          }
        },
        // FAQ Schema
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What are Portugal Golden Visa investment funds?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Portugal Golden Visa investment funds are qualified investment vehicles that meet the requirements for obtaining Portuguese residency through the Golden Visa program. These funds must invest in Portuguese assets and meet specific regulatory requirements.'
              }
            },
            {
              '@type': 'Question',
              'name': 'How much do I need to invest for a Golden Visa?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'The minimum investment for Portugal Golden Visa through investment funds is €500,000. This amount must be maintained for at least 5 years to qualify for permanent residency.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Which are the best Golden Visa investment funds?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': `Our platform compares ${totalFunds} verified Golden Visa funds across multiple criteria including performance, fees, risk levels, and fund manager experience. The best fund depends on your investment goals and risk tolerance.`
              }
            }
          ]
        }
      ]
    };

    return {
      title: 'Portugal Golden Visa Investment Funds 2025 | Compare 11+ Verified Funds',
      description: `Compare the best Portugal Golden Visa investment funds. Expert analysis of ${totalFunds} verified funds, €${totalAUM}M+ AUM, comprehensive fee comparison, and personalized recommendations with exclusive data for MovingTo clients. Start your residency journey today.`,
      url: baseUrl,
      structuredData: enhancedStructuredData
    };
  }
}
