import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { normalizeTagLabel } from '@/utils/tagLabelNormalizer';
import { getTagSeoTitle } from '@/utils/tagSeoMappings';

export function getTagSeo(tagName: string, funds: Fund[] = []): SEOData {
  const cleanTagLabel = normalizeTagLabel(tagName);
  const fundsCount = funds.length;
  const tagTitle = `${getTagSeoTitle(tagName)} | Movingto Funds`;
  const tagDescription = `Browse ${fundsCount} ${cleanTagLabel} funds eligible for Portugal Golden Visa. Compare average yields, lock-up periods, and fees for this investment theme.`;
  
  const tagKeywords = [
    `${tagName} Golden Visa funds`,
    `${tagName} investment funds Portugal`,
    'thematic investing Portugal',
    `${tagName} fund comparison`,
    'Portugal investment themes',
    `best ${tagName} funds`
  ];
  
  return {
    title: optimizeTitle(tagTitle),
    description: optimizeDescription(tagDescription),
    url: URL_CONFIG.buildTagUrl(tagName),
    canonical: URL_CONFIG.buildTagUrl(tagName),
    keywords: tagKeywords,
    structuredData: getTagStructuredData(tagName, funds)
  };
}

function getTagStructuredData(tagName: string, funds: Fund[] = []): any {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': `${tagName} Investment Funds`,
      'description': `Collection of ${tagName} investment funds in Portugal`,
      'url': URL_CONFIG.buildTagUrl(tagName)
    },
    {
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
    }
  ];
}
