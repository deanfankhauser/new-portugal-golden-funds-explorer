import { SEOData } from '../types';
import { URL_CONFIG } from '@/utils/urlConfig';
import { SEO_CONFIG } from '@/config/company';

export function getFundsSeo(): SEOData {
  return {
    title: 'Filter Golden Visa Funds | Movingto Funds',
    description: 'Filter and sort Portugal Golden Visa investment funds by strategy, fees, liquidity, and minimums. Build your shortlist with advanced filtering tools.',
    url: URL_CONFIG.buildUrl('/funds'),
    canonical: URL_CONFIG.buildUrl('/funds'),
    robots: 'noindex, follow',
    keywords: [
      'filter golden visa funds',
      'golden visa fund filter',
      'compare investment funds',
      'investment fund filter tool'
    ],
    structuredData: undefined
  };
}
