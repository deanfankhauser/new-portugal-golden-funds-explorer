import { SEOData } from '../types';
import { URL_CONFIG } from '@/utils/urlConfig';
import { FEE_TYPE_CONTENT, FeeTypeSlug, isFeeTypeSlug } from '@/data/fee-type-content';
import { getSitewideSchemas } from '../schemas';

export function getFeeTypeSeo(feeTypeSlug: string): SEOData {
  // Validate and get content
  if (!isFeeTypeSlug(feeTypeSlug)) {
    // Fallback SEO for invalid fee type
    return {
      title: 'Fund Fees | Movingto Funds',
      description: 'Explore fund fee structures for Portugal Golden Visa investments.',
      url: URL_CONFIG.buildUrl('/fees'),
      canonical: URL_CONFIG.buildUrl('/fees'),
      robots: 'noindex, follow',
      keywords: ['fund fees', 'Portugal Golden Visa'],
      structuredData: getSitewideSchemas()
    };
  }

  const content = FEE_TYPE_CONTENT[feeTypeSlug as FeeTypeSlug];
  const feeTypeUrl = URL_CONFIG.buildUrl(`/fees/${feeTypeSlug}`);

  // Build keywords based on fee type
  const keywords = [
    content.title.split(':')[0].trim(),
    `${feeTypeSlug.replace(/-/g, ' ')} Portugal`,
    `Golden Visa ${feeTypeSlug.replace(/-/g, ' ')}`,
    'fund fees',
    'Portugal Golden Visa funds',
    'investment fees',
    `${feeTypeSlug.replace(/-/g, ' ')} comparison`
  ];

  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Fees', 'item': URL_CONFIG.buildUrl('/fees') },
      { '@type': 'ListItem', 'position': 3, 'name': content.title.split(':')[0].trim(), 'item': feeTypeUrl }
    ]
  };

  // FAQPage schema from curated FAQs
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': content.faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  // WebPage schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': content.title,
    'description': content.metaDescription,
    'url': feeTypeUrl,
    'isPartOf': {
      '@type': 'WebSite',
      'name': 'Movingto Funds',
      'url': URL_CONFIG.BASE_URL
    }
  };

  return {
    title: content.metaTitle,
    description: content.metaDescription,
    url: feeTypeUrl,
    canonical: feeTypeUrl,
    robots: 'index, follow',
    keywords,
    structuredData: [
      ...getSitewideSchemas(),
      breadcrumbSchema,
      webPageSchema,
      faqSchema
    ]
  };
}
