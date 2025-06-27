
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class FundIndexSEOService extends BaseSEOService {
  static getFundIndexSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    const url = `${baseUrl}/funds/index`;
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': ['WebPage', 'CreativeWork'],
      'name': '2025 Golden Visa Fund Index - Portugal Investment Rankings',
      'description': 'The definitive, data-driven ranking of Golden Visa-eligible investment funds in Portugal. Compare performance, fees, and regulation scores.',
      'url': url,
      'keywords': 'Portugal Golden Visa, investment funds, fund rankings, Golden Visa funds 2025, fund comparison, investment migration, Portuguese residency, fund performance, management fees, regulatory compliance, fund index, investment analysis',
      'inLanguage': 'en-US',
      'datePublished': '2025-01-01',
      'dateModified': new Date().toISOString(),
      'author': [
        {
          '@type': 'Person',
          'name': 'Dean Fankhauser',
          'jobTitle': 'CEO',
          'worksFor': {
            '@type': 'Organization',
            'name': 'Movingto'
          },
          'sameAs': 'https://www.linkedin.com/in/deanfankhauser/'
        },
        {
          '@type': 'Person',
          'name': 'Anna Luisa Lacerda',
          'jobTitle': 'Licensed Portuguese Lawyer',
          'worksFor': {
            '@type': 'Organization',
            'name': 'Movingto'
          },
          'sameAs': 'https://www.linkedin.com/in/annaluisalmb/'
        }
      ],
      'mainEntity': {
        '@type': 'ItemList',
        'name': '2025 Golden Visa Fund Index',
        'description': 'Comprehensive ranking of Portugal Golden Visa investment funds',
        'numberOfItems': 11,
        'itemListOrder': 'Descending',
        'dateModified': new Date().toISOString(),
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Top Ranked Golden Visa Funds',
            'description': 'The highest scoring Golden Visa investment funds based on performance, regulation, fees, and investor protection'
          }
        ]
      },
      'about': [
        {
          '@type': 'Thing',
          'name': 'Portugal Golden Visa',
          'description': 'Portuguese investment visa program'
        },
        {
          '@type': 'Thing',
          'name': 'Investment Funds',
          'description': 'Golden Visa eligible investment funds'
        },
        {
          '@type': 'Thing',
          'name': 'Fund Analysis',
          'description': 'Professional fund performance and risk analysis'
        }
      ],
      'mentions': [
        {
          '@type': 'Organization',
          'name': 'Portuguese Government',
          'description': 'Regulatory authority for Golden Visa program'
        }
      ],
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
            'name': 'Fund Index',
            'item': url
          }
        ]
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://movingto.com',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg'
        }
      },
      'openGraph': {
        type: 'website',
        title: '2025 Golden Visa Fund Index | Portugal Investment Rankings',
        description: 'The definitive, data-driven ranking of Golden Visa-eligible investment funds in Portugal. Compare performance, fees, and regulation scores.',
        url: url,
        siteName: 'Movingto - Portugal Golden Visa Funds',
        images: [
          {
            url: 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg',
            width: 400,
            height: 400,
            alt: 'Movingto - Portugal Golden Visa Investment Funds Platform'
          }
        ]
      },
      'twitter': {
        card: 'summary_large_image',
        site: '@movingtoio',
        creator: '@movingtoio',
        title: '2025 Golden Visa Fund Index | Portugal Investment Rankings',
        description: 'The definitive, data-driven ranking of Golden Visa-eligible investment funds in Portugal. Compare performance, fees, and regulation scores.',
        image: 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg'
      }
    };

    return {
      title: '2025 Golden Visa Fund Index | Portugal Investment Rankings',
      description: 'The definitive, data-driven ranking of Golden Visa-eligible investment funds in Portugal. Compare performance, fees, and regulation scores with our comprehensive index updated monthly.',
      url,
      structuredData
    };
  }
}
