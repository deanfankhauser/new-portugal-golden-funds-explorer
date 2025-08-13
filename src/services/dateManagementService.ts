import { Fund } from '../data/types/funds';

export interface ContentDateInfo {
  datePublished: string;
  dateModified: string;
  dataLastVerified: string;
  contentType: 'fund' | 'category' | 'tag' | 'manager' | 'static';
  lastContentUpdate?: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export class DateManagementService {
  
  // Generate current ISO date string
  static getCurrentISODate(): string {
    return new Date().toISOString();
  }

  // Get content dates for different content types
  static getContentDates(contentType: string, identifier?: string): ContentDateInfo {
    const now = this.getCurrentISODate();
    
    switch (contentType) {
      case 'fund':
        return {
          datePublished: now,
          dateModified: now,
          dataLastVerified: now,
          contentType: 'fund',
          changeFrequency: 'weekly'
        };
      case 'category':
        return {
          datePublished: '2024-01-01T00:00:00.000Z',
          dateModified: now,
          dataLastVerified: now,
          contentType: 'category',
          changeFrequency: 'weekly'
        };
      case 'tag':
        return {
          datePublished: '2024-01-01T00:00:00.000Z',
          dateModified: now,
          dataLastVerified: now,
          contentType: 'tag',
          changeFrequency: 'weekly'
        };
      case 'manager':
        return {
          datePublished: '2024-01-01T00:00:00.000Z',
          dateModified: now,
          dataLastVerified: now,
          contentType: 'manager',
          changeFrequency: 'weekly'
        };
      default:
        return {
          datePublished: '2024-01-01T00:00:00.000Z',
          dateModified: now,
          dataLastVerified: now,
          contentType: 'static',
          changeFrequency: 'monthly'
        };
    }
  }

  // Get fund-specific dates based on actual data changes
  static getFundContentDates(fund: Fund): ContentDateInfo {
    // Use fund's date fields if available, otherwise use defaults
    const baseDate = fund.datePublished || '2024-01-01T00:00:00.000Z';
    const modifiedDate = fund.dateModified || this.getCurrentISODate();
    
    return {
      datePublished: baseDate,
      dateModified: modifiedDate,
      dataLastVerified: fund.dataLastVerified || this.getCurrentISODate(),
      contentType: 'fund',
      lastContentUpdate: fund.statusLastUpdated || fund.feeLastUpdated,
      changeFrequency: this.getFundChangeFrequency(fund)
    };
  }

  // Determine change frequency based on fund characteristics
  private static getFundChangeFrequency(fund: Fund): 'daily' | 'weekly' | 'monthly' | 'yearly' {
    // Open funds with liquid redemptions change more frequently
    if (fund.fundStatus === 'Open' && fund.redemptionTerms?.frequency === 'Daily') {
      return 'weekly';
    }
    
    // Closing soon funds change frequently
    if (fund.fundStatus === 'Closing Soon') {
      return 'weekly';
    }
    
    // Closed funds change less frequently
    if (fund.fundStatus === 'Closed') {
      return 'monthly';
    }
    
    // Default for most funds
    return 'weekly';
  }

  // Format date for sitemap (YYYY-MM-DD format)
  static formatSitemapDate(isoDate: string): string {
    return isoDate.split('T')[0];
  }

  // Format date for structured data (ISO 8601)
  static formatStructuredDataDate(isoDate: string): string {
    return isoDate;
  }

  // Format date for display (human readable)
  static formatDisplayDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Calculate content freshness in days
  static getContentAge(dateModified: string): number {
    const now = new Date();
    const modified = new Date(dateModified);
    const diffTime = Math.abs(now.getTime() - modified.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Determine if content needs updating based on age
  static needsContentUpdate(dateModified: string, contentType: string): boolean {
    const age = this.getContentAge(dateModified);
    
    switch (contentType) {
      case 'fund':
        return age > 30; // Funds should be updated monthly
      case 'category':
      case 'tag':
        return age > 90; // Categories and tags every 3 months
      default:
        return age > 180; // Static content semi-annually
    }
  }

  // Generate default dates for existing funds without date fields
  static generateDefaultFundDates(fund: Fund): Partial<Fund> {
    const baseDate = '2024-01-01T00:00:00.000Z';
    const currentDate = this.getCurrentISODate();
    
    return {
      datePublished: fund.datePublished || baseDate,
      dateModified: fund.dateModified || currentDate,
      dataLastVerified: fund.dataLastVerified || currentDate,
      performanceDataDate: fund.performanceDataDate || currentDate,
      feeLastUpdated: fund.feeLastUpdated || baseDate,
      statusLastUpdated: fund.statusLastUpdated || baseDate
    };
  }
}