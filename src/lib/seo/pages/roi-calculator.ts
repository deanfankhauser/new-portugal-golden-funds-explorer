import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { getSitewideSchemas } from '../schemas/sitewideSchemas';
import { BREADCRUMB_CONFIGS } from '../schemas/breadcrumbSchema';

export function getROICalculatorSeo(): SEOData {
  return {
    title: optimizeTitle('Portugal Golden Visa ROI Calculator (2026) | Movingto Funds'),
    description: optimizeDescription('Estimate outcomes on a €500k subscription. Adjust fees and assumptions. Educational estimates only—verify details in the fund documents.'),
    url: URL_CONFIG.buildUrl('roi-calculator'),
    canonical: URL_CONFIG.buildUrl('roi-calculator'),
    keywords: [
      'Portugal Golden Visa ROI calculator',
      'Golden Visa fund returns',
      'Portugal Golden Visa investment calculator',
      'Golden Visa ROI',
      'Portugal fund returns calculator',
      'Golden Visa investment returns'
    ],
    structuredData: getCalculatorStructuredData()
  };
}

function getCalculatorStructuredData(): any[] {
  return [
    ...getSitewideSchemas(),
    BREADCRUMB_CONFIGS.roiCalculator(),
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': 'Portugal Golden Visa ROI Calculator',
      'url': URL_CONFIG.buildUrl('roi-calculator'),
      'applicationCategory': 'FinanceApplication',
      'operatingSystem': 'Web Browser',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'EUR'
      }
    }
  ];
}
