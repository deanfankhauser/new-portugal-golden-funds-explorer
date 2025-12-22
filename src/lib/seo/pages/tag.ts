import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { normalizeTagLabel } from '@/utils/tagLabelNormalizer';

export function getTagSeo(tagName: string, funds: Fund[] = []): SEOData {
  const cleanTagLabel = normalizeTagLabel(tagName);
  const fundCount = funds.length;
  
  // SEO Title: "{Tag} Golden Visa Funds | Filter & Compare {Count}+" (under 60 chars)
  const tagTitle = fundCount > 0
    ? `${cleanTagLabel} Golden Visa Funds | Filter & Compare ${fundCount}+`
    : `${cleanTagLabel} Golden Visa Funds Portugal | Investment Guide`;
  
  // SEO Description: Full 155 chars with unique content per tag
  const tagDescription = fundCount > 0
    ? `Browse ${fundCount}+ ${cleanTagLabel} funds for Portugal Golden Visa. Filter by fees, minimum investment, target returns, and fund manager reputation.`
    : `Explore ${cleanTagLabel} themed Golden Visa investment opportunities in Portugal. Compare fund strategies, risk profiles, and investment terms.`;
  
  const tagKeywords = [
    `${cleanTagLabel} Golden Visa funds`,
    `${cleanTagLabel} investment funds Portugal`,
    'thematic investing Portugal',
    `${cleanTagLabel} fund comparison`,
    'Portugal investment themes',
    `best ${cleanTagLabel} funds`
  ];
  
  return {
    title: optimizeTitle(tagTitle),
    description: optimizeDescription(tagDescription),
    url: URL_CONFIG.buildTagUrl(tagName),
    canonical: URL_CONFIG.buildTagUrl(tagName),
    keywords: tagKeywords,
    robots: fundCount === 0 ? 'noindex, follow' : 'index, follow',
    structuredData: getTagStructuredData(tagName, funds)
  };
}

function getTagStructuredData(tagName: string, funds: Fund[] = []): any {
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${tagName} Investment Funds`,
    'description': `Collection of ${tagName} investment funds in Portugal`,
    'url': URL_CONFIG.buildTagUrl(tagName)
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
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
        'name': 'Tags',
        'item': URL_CONFIG.buildUrl('/tags')
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': tagName,
        'item': URL_CONFIG.buildTagUrl(tagName)
      }
    ]
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `${tagName} Portugal Golden Visa Investment Funds`,
    'numberOfItems': funds.length,
    'itemListElement': funds.map((fund, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'url': URL_CONFIG.buildFundUrl(fund.id),
      'name': fund.name
    }))
  };

  return [collectionSchema, breadcrumbSchema, itemListSchema];
}
