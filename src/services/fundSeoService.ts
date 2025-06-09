
import { Fund } from '../data/funds';

export class FundSeoService {
  
  // Generate fund-specific meta title (under 60 chars)
  static generateMetaTitle(fund: Fund): string {
    const fundType = fund.category.includes('Private Equity') ? 'PE' : 
                    fund.category.includes('Real Estate') ? 'RE' : 
                    fund.category.includes('Venture') ? 'VC' : 'Fund';
    
    const minInvestment = fund.minimumInvestment >= 1000000 ? 
      `€${fund.minimumInvestment / 1000000}M` : 
      `€${fund.minimumInvestment / 1000}k`;
    
    return `${fund.name} - ${fundType} & Golden Visa | ${minInvestment} Min`;
  }

  // Generate fund-specific meta description (under 155 chars)
  static generateMetaDescription(fund: Fund): string {
    const minInvestment = fund.minimumInvestment >= 1000000 ? 
      `€${fund.minimumInvestment / 1000000}M` : 
      `€${fund.minimumInvestment / 1000}k`;
    
    const keyBenefit = fund.tags.includes('Low Risk') ? 'low-risk' :
                      fund.tags.includes('High Yield') ? 'high-yield' :
                      fund.tags.includes('Growth') ? 'growth-focused' : 'diversified';
    
    return `${fund.name}: ${keyBenefit} ${fund.category.toLowerCase()} for Portuguese Golden Visa. Min €${minInvestment}, managed by ${fund.managerName}. Apply now.`;
  }

  // Generate fund-specific OG title
  static generateOGTitle(fund: Fund): string {
    return `${fund.name} | Portuguese Golden Visa Investment Fund`;
  }

  // Generate fund-specific OG description
  static generateOGDescription(fund: Fund): string {
    const minInvestment = fund.minimumInvestment >= 1000000 ? 
      `€${fund.minimumInvestment / 1000000} million` : 
      `€${fund.minimumInvestment / 1000}k`;
    
    return `Invest in ${fund.name} for Portuguese Golden Visa eligibility. ${fund.category} fund with ${minInvestment} minimum investment. Target returns: ${fund.returnTarget}.`;
  }

  // Generate Twitter description
  static generateTwitterDescription(fund: Fund): string {
    const minInvestment = fund.minimumInvestment >= 1000000 ? 
      `€${fund.minimumInvestment / 1000000}M` : 
      `€${fund.minimumInvestment / 1000}k`;
    
    return `${fund.name}: Golden Visa eligible ${fund.category.toLowerCase()}. Min: ${minInvestment}. Target: ${fund.returnTarget}. Learn more.`;
  }

  // Generate keywords for the fund
  static generateKeywords(fund: Fund): string {
    const baseKeywords = [
      fund.name,
      'Portuguese Golden Visa',
      'Portugal Investment Fund',
      fund.category,
      fund.managerName,
      'Golden Visa Portugal',
      'Investment Fund Portugal'
    ];
    
    const tagKeywords = fund.tags.slice(0, 5); // Top 5 tags
    
    return [...baseKeywords, ...tagKeywords].join(', ');
  }

  // Generate structured FAQ data for rich snippets
  static generateFAQStructuredData(fund: Fund) {
    const faqs = fund.faqs || [];
    if (faqs.length === 0) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };
  }
}
