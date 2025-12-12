import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription, getCurrentYear } from '../utils';
import { MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH } from '../constants';
import { URL_CONFIG } from '@/utils/urlConfig';
import { Fund } from '@/data/types/funds';
import { InvestmentFundStructuredDataService } from '@/services/investmentFundStructuredDataService';
import { getReturnTargetDisplay } from '@/utils/returnTarget';

export function getFundSeo(fund: Fund): SEOData {
  const fundTitle = generateFundTitle(fund);
  const fundDescription = generateFundDescription(fund);
  const fundKeywords = generateFundKeywords(fund);
  
  return {
    title: optimizeTitle(fundTitle),
    description: optimizeDescription(fundDescription),
    url: URL_CONFIG.buildFundUrl(fund.id),
    canonical: URL_CONFIG.buildFundUrl(fund.id),
    keywords: fundKeywords,
    structuredData: getFundStructuredData(fund)
  };
}

export function getFundFallbackSeo(fundIdOrName: string): SEOData {
  return {
    title: optimizeTitle(`${fundIdOrName} – Portugal Golden Visa Fund | Movingto Funds`),
    description: optimizeDescription('Explore details for this Portugal Golden Visa investment fund on Movingto.'),
    url: URL_CONFIG.buildFundUrl(fundIdOrName),
    canonical: URL_CONFIG.buildFundUrl(fundIdOrName),
    structuredData: []
  };
}

function generateFundTitle(fund: Fund): string {
  const currentYear = getCurrentYear();
  const fundName = fund.name;
  const maxLength = MAX_TITLE_LENGTH;
  
  // Primary title: [Fund Name]: {Year} Fees, Yield & Golden Visa Fact Sheet
  const fullTitle = `${fundName}: ${currentYear} Fees, Yield & Golden Visa Fact Sheet`;
  
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }
  
  // Truncated fallback: [Fund Name]: {Year} Golden Visa Fact Sheet
  const shortTitle = `${fundName}: ${currentYear} Golden Visa Fact Sheet`;
  
  if (shortTitle.length <= maxLength) {
    return shortTitle;
  }
  
  // Final fallback: Truncate fund name to fit
  const suffixLength = `: ${currentYear} Golden Visa Fact Sheet`.length;
  const maxNameLength = maxLength - suffixLength - 3;
  const truncatedName = fundName.substring(0, maxNameLength).trim() + '...';
  return `${truncatedName}: ${currentYear} Golden Visa Fact Sheet`;
}

function generateFundDescription(fund: Fund): string {
  const fundName = fund.name;
  const category = fund.category || 'investment';
  
  // Minimum investment formatting
  const minInvestmentStr = fund.minimumInvestment 
    ? `€${(fund.minimumInvestment / 1000).toFixed(0)}k minimum`
    : null;
  
  // Target return using existing utility
  const returnTarget = getReturnTargetDisplay(fund);
  
  // Lock-up/liquidity - use redemption terms or cast to any for database field
  const fundAny = fund as any;
  const lockUpMonths = fund.redemptionTerms?.minimumHoldingPeriod || fundAny.lock_up_period_months;
  const lockUpStr = lockUpMonths 
    ? lockUpMonths >= 12 
      ? `${Math.round(lockUpMonths / 12)}-year lock-up` 
      : `${lockUpMonths}-month lock-up`
    : null;
  
  // Manager + regulation
  const managerStr = fund.managerName ? `Managed by ${fund.managerName}` : null;
  const cmvmStr = fund.cmvmId ? `CMVM #${fund.cmvmId}` : null;
  
  // Build description based on available data
  if (returnTarget) {
    // Template WITH target return - prioritize key decision data
    const basePart = `${fundName} is a ${category} Portugal Golden Visa fund`;
    const minPart = minInvestmentStr ? ` with ${minInvestmentStr}` : '';
    const returnPart = `Target: ${returnTarget}.`;
    
    const details = [lockUpStr, managerStr, cmvmStr].filter(Boolean);
    const detailsPart = details.length > 0 ? ` ${details.slice(0, 2).join('. ')}.` : '';
    
    return `${basePart}${minPart}. ${returnPart}${detailsPart}`;
  } else {
    // Template WITHOUT target return
    const basePart = `${fundName} is a ${category} Portugal Golden Visa fund`;
    const minPart = minInvestmentStr ? ` with ${minInvestmentStr}` : '';
    const managerPart = managerStr ? ` ${managerStr}.` : '';
    
    return `${basePart}${minPart}.${managerPart} Check fees, lock-up, and risk profile before investing.`;
  }
}

function generateFundKeywords(fund: Fund): string[] {
  const keywords: string[] = [
    'Portugal Golden Visa',
    fund.name,
    fund.category || '',
    fund.managerName || '',
    'investment fund Portugal'
  ].filter(Boolean);
  
  if (fund.minimumInvestment) {
    if (fund.minimumInvestment <= 350000) keywords.push('low minimum investment');
    if (fund.minimumInvestment === 500000) keywords.push('€500k Golden Visa fund');
  }
  
  if (fund.tags?.includes('Daily NAV') || fund.tags?.includes('No Lock-Up')) {
    keywords.push('liquid investment', 'daily redemption', 'no lock-up period');
  }
  
  if (fund.tags?.includes('UCITS')) {
    keywords.push('UCITS fund', 'regulated fund', 'EU regulated investment');
  }
  
  if (fund.tags?.includes('PFIC-Compliant')) {
    keywords.push('PFIC compliant', 'US investor friendly', 'QEF eligible');
  }
  
  if (fund.returnTarget) {
    keywords.push(`${fund.returnTarget} returns`, 'fund performance');
  }
  
  // Check tags as string array to avoid type issues
  const fundTags = fund.tags || [];
  if (fundTags.some(t => t.toLowerCase().includes('real estate'))) keywords.push('real estate fund Portugal');
  if (fundTags.some(t => t.toLowerCase().includes('venture capital'))) keywords.push('venture capital Portugal');
  if (fundTags.some(t => t.toLowerCase().includes('private equity'))) keywords.push('private equity Portugal');
  if (fund.tags?.includes('Sustainability')) keywords.push('ESG fund', 'sustainable investment');
  
  if (fund.tags?.includes('Golden Visa funds for U.S. citizens')) {
    keywords.push('US citizen Golden Visa');
  }
  
  return keywords;
}

function getFundStructuredData(fund: Fund): any {
  const investmentFundSchema = InvestmentFundStructuredDataService.generateInvestmentFundSchema(fund);
  
  const breadcrumbItems: any[] = [
    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL }
  ];

  breadcrumbItems.push({
    '@type': 'ListItem',
    'position': 2,
    'name': 'Browse Funds',
    'item': `${URL_CONFIG.BASE_URL}/`
  });

  if (fund.category) {
    breadcrumbItems.push({
      '@type': 'ListItem',
      'position': breadcrumbItems.length + 1,
      'name': fund.category,
      'item': URL_CONFIG.buildCategoryUrl(fund.category)
    });
  }

  breadcrumbItems.push({
    '@type': 'ListItem',
    'position': breadcrumbItems.length + 1,
    'name': fund.name,
    'item': URL_CONFIG.buildFundUrl(fund.id)
  });

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': breadcrumbItems
  };
  
  const schemas: any[] = [investmentFundSchema, breadcrumbSchema];
  
  // Generate default FAQs
  const defaultFAQs = [
    {
      question: `What makes ${fund.name} unique?`,
      answer: `${fund.name} offers a distinctive investment approach with carefully selected strategies designed to achieve optimal returns while managing risk. The fund combines experienced management with rigorous investment processes to deliver value to investors.`
    },
    {
      question: `How is risk managed?`,
      answer: `${fund.name} employs a multi-layered risk management approach designed to protect capital while pursuing growth opportunities. This includes asset diversification, rigorous selection processes, regular portfolio rebalancing, and professional oversight by experienced managers with proven track records.`
    },
    {
      question: `What are the investment requirements?`,
      answer: `The minimum investment for ${fund.name} is ${fund.minimumInvestment ? `€${fund.minimumInvestment.toLocaleString()}` : 'available upon request'}. The fund features ${fund.redemptionTerms?.frequency || 'periodic'} redemptions with ${fund.redemptionTerms?.minimumHoldingPeriod ? `a ${fund.redemptionTerms.minimumHoldingPeriod}-month` : 'a'} lock-up period. ${fund.redemptionTerms?.noticePeriod ? `${fund.redemptionTerms.noticePeriod} days notice` : 'Advance notice'} is required for redemptions.`
    },
    {
      question: fund.tags?.includes('Golden Visa Eligible') 
        ? `How does the Golden Visa qualification work?`
        : `What are the regulatory requirements?`,
      answer: fund.tags?.includes('Golden Visa Eligible')
        ? `${fund.name} is approved by Portuguese authorities as a Golden Visa qualifying investment. By investing the minimum amount, you become eligible to apply for Portuguese residency through the Golden Visa program. The fund maintains full compliance with CMVM regulations${fund.cmvmId ? ` and is registered under CMVM #${fund.cmvmId}` : ''}. Our team works closely with investors to ensure all documentation meets Golden Visa requirements.`
        : `${fund.name} operates under strict regulatory oversight${fund.regulatedBy ? ` by ${fund.regulatedBy}` : ''}${fund.cmvmId ? ` and is registered with CMVM #${fund.cmvmId}` : ''}. The fund maintains full compliance with all applicable securities regulations and reporting requirements.`
    },
    {
      question: `What are the expected returns?`,
      answer: `${fund.name} ${fund.returnTarget ? `targets ${fund.returnTarget}` : 'aims to deliver competitive returns'}${fund.historicalPerformance ? `, with historical performance demonstrating the fund's ability to achieve its objectives` : ''}. However, past performance is not indicative of future results. The fund's investments carry inherent market risks. Capital is at risk, and investors should carefully consider their investment objectives and risk tolerance.`
    }
  ];

  const activeFAQs = (fund.faqs && fund.faqs.length > 0) ? fund.faqs : defaultFAQs;
  
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': activeFAQs.map((faq: any) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
  schemas.push(faqSchema);
  
  const managerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': fund.managerName,
    'url': URL_CONFIG.buildManagerUrl(fund.managerName || '')
  };
  schemas.push(managerSchema);
  
  return schemas;
}
