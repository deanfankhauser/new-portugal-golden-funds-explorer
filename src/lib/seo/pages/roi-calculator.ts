import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';

export function getROICalculatorSeo(): SEOData {
  return {
    title: optimizeTitle('Portugal Golden Visa Fund ROI Calculator – Estimate Returns | Movingto Funds'),
    description: optimizeDescription('Estimate potential returns from Portugal Golden Visa funds. Adjust investment amount, target yield and holding period to see projected outcomes.'),
    url: URL_CONFIG.buildUrl('roi-calculator'),
    canonical: URL_CONFIG.buildUrl('roi-calculator'),
    keywords: [
      'ROI calculator',
      'investment returns calculator',
      'Golden Visa ROI',
      'fund returns calculation',
      'investment calculator Portugal',
      'Golden Visa returns'
    ],
    structuredData: getCalculatorStructuredData()
  };
}

function getCalculatorStructuredData(): any {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Portugal Golden Visa Fund ROI Calculator',
    'url': URL_CONFIG.buildUrl('roi-calculator'),
    'applicationCategory': 'FinanceApplication',
    'operatingSystem': 'Web Browser',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'EUR'
    }
  };
}
