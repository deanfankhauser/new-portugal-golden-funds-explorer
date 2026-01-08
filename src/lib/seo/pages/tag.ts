import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { getSitewideSchemas } from '../schemas';
import { checkTagIndexability } from '@/lib/indexability';
import { getTagFAQs } from '@/utils/tagFaqs';

export function getTagSeo(tagName: string, funds: Fund[] = []): SEOData {
  const indexability = checkTagIndexability(tagName, funds);
  
  // Clean tag label for display
  const cleanTagLabel = tagName.replace(/-/g, ' ');
  
  // Title per new format: "{Tag} Portugal Golden Visa Funds (2026) | Movingto Funds"
  const title = `${cleanTagLabel} Portugal Golden Visa Funds (2026) | Movingto Funds`;
  
  // Description per new format
  const description = `View ${cleanTagLabel}-focused funds and compare fees, strategy, maturity, and liquidity terms. Built for shortlisting, not advice.`;
  
  return {
    title: optimizeTitle(title),
    description: optimizeDescription(description),
    url: URL_CONFIG.buildTagUrl(tagName),
    canonical: URL_CONFIG.buildTagUrl(tagName),
    robots: indexability.robots,
    keywords: [
      cleanTagLabel,
      `${cleanTagLabel} funds`,
      `${cleanTagLabel} Golden Visa`,
      'Portugal investment funds',
      'Golden Visa funds',
      'CMVM regulated funds',
      `${cleanTagLabel} investment strategy`
    ],
    structuredData: getTagStructuredData(tagName, cleanTagLabel, funds)
  };
}

function getTagStructuredData(tagName: string, cleanTagLabel: string, funds: Fund[] = []): any {
  const tagUrl = URL_CONFIG.buildTagUrl(tagName);
  
  // BreadcrumbList schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Tags', 'item': URL_CONFIG.buildUrl('/tags') },
      { '@type': 'ListItem', 'position': 3, 'name': cleanTagLabel, 'item': tagUrl }
    ]
  };
  
  // Enhanced ItemList with FinancialProduct type for each fund
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${cleanTagLabel} Portugal Golden Visa Investment Funds`,
    'description': `Collection of funds tagged with ${cleanTagLabel} for Portugal Golden Visa`,
    'url': tagUrl,
    'numberOfItems': funds.length,
    'itemListElement': funds.map((fund, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'FinancialProduct',
        'name': fund.name,
        'url': URL_CONFIG.buildFundUrl(fund.id),
        'category': fund.category,
        'description': fund.description || `${fund.name} - ${cleanTagLabel} investment fund`,
        'offers': {
          '@type': 'Offer',
          'price': fund.minimumInvestment || 500000,
          'priceCurrency': 'EUR',
          'availability': 'https://schema.org/InStock'
        },
        'provider': {
          '@type': 'Organization',
          'name': fund.managerName || 'Fund Manager'
        },
        ...(fund.managementFee && {
          'annualPercentageRate': fund.managementFee
        })
      }
    }))
  };

  // CollectionPage schema
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${cleanTagLabel} Portugal Golden Visa Investment Funds`,
    'description': `Browse ${funds.length}+ ${cleanTagLabel} funds for Portugal Golden Visa`,
    'url': tagUrl
  };

  // FAQPage schema for SEO
  const faqs = getTagFAQs(tagName, funds);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'name': `${cleanTagLabel} Golden Visa Funds FAQs`,
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    collectionSchema,
    itemListSchema,
    faqSchema
  ];
}
