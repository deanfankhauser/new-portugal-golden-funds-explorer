import { Fund } from '../data/types/funds';
import { DateManagementService } from './dateManagementService';

export interface SEODateMetaTags {
  'article:published_time'?: string;
  'article:modified_time'?: string;
  'article:expiration_time'?: string;
  'og:updated_time'?: string;
  'datePublished'?: string;
  'dateModified'?: string;
  'dataFreshness'?: string;
}

export class EnhancedSEODateService {
  
  // Generate comprehensive date meta tags for funds
  static generateFundDateMetaTags(fund: Fund): SEODateMetaTags {
    const contentDates = DateManagementService.getFundContentDates(fund);
    const publishedDate = DateManagementService.formatStructuredDataDate(contentDates.datePublished);
    const modifiedDate = DateManagementService.formatStructuredDataDate(contentDates.dateModified);
    
    return {
      'article:published_time': publishedDate,
      'article:modified_time': modifiedDate,
      'og:updated_time': modifiedDate,
      'datePublished': publishedDate,
      'dateModified': modifiedDate,
      'dataFreshness': this.calculateDataFreshness(contentDates.dataLastVerified)
    };
  }

  // Generate date meta tags for general content
  static generateContentDateMetaTags(
    contentType: string, 
    identifier?: string
  ): SEODateMetaTags {
    const contentDates = DateManagementService.getContentDates(contentType, identifier);
    const publishedDate = DateManagementService.formatStructuredDataDate(contentDates.datePublished);
    const modifiedDate = DateManagementService.formatStructuredDataDate(contentDates.dateModified);
    
    return {
      'article:published_time': publishedDate,
      'article:modified_time': modifiedDate,
      'og:updated_time': modifiedDate,
      'datePublished': publishedDate,
      'dateModified': modifiedDate
    };
  }

  // Calculate data freshness indicator
  private static calculateDataFreshness(dataLastVerified: string): string {
    const age = DateManagementService.getContentAge(dataLastVerified);
    
    if (age <= 7) return 'Very Fresh';
    if (age <= 30) return 'Fresh';
    if (age <= 90) return 'Recent';
    if (age <= 180) return 'Moderate';
    return 'Needs Update';
  }

  // Apply date meta tags to document head
  static applyDateMetaTags(metaTags: SEODateMetaTags): void {
    Object.entries(metaTags).forEach(([property, content]) => {
      if (content) {
        // Remove existing meta tag
        const existingTag = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
        if (existingTag) {
          existingTag.remove();
        }

        // Create new meta tag
        const metaTag = document.createElement('meta');
        
        // Use property for Open Graph and article tags, name for others
        if (property.startsWith('og:') || property.startsWith('article:')) {
          metaTag.setAttribute('property', property);
        } else {
          metaTag.setAttribute('name', property);
        }
        
        metaTag.setAttribute('content', content);
        document.head.appendChild(metaTag);
      }
    });
  }

  // Generate temporal coverage metadata for fund performance data
  static generateTemporalCoverage(fund: Fund): string | null {
    if (!fund.performanceDataDate) return null;
    
    const startDate = fund.datePublished;
    const endDate = fund.performanceDataDate;
    
    return `${startDate}/${endDate}`;
  }

  // Generate content reference time for time-sensitive data
  static generateContentReferenceTime(fund: Fund): string {
    // Use the most recent of: data verification, fee update, or status update
    const dates = [
      fund.dataLastVerified,
      fund.feeLastUpdated,
      fund.statusLastUpdated,
      fund.performanceDataDate
    ].filter(Boolean);
    
    if (dates.length === 0) {
      return DateManagementService.getCurrentISODate();
    }
    
    // Return the most recent date
    return dates.sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0]!;
  }

  // Check if content should have expiration warnings
  static shouldShowExpirationWarning(fund: Fund): boolean {
    const age = DateManagementService.getContentAge(fund.dataLastVerified || fund.dateModified);
    return age > 90; // Show warning for data older than 3 months
  }

  // Generate expiration date based on content type
  static generateExpirationDate(contentType: string, lastModified: string): string {
    const lastModifiedDate = new Date(lastModified);
    
    switch (contentType) {
      case 'fund':
        // Fund data expires after 6 months
        lastModifiedDate.setMonth(lastModifiedDate.getMonth() + 6);
        break;
      case 'performance':
        // Performance data expires after 3 months
        lastModifiedDate.setMonth(lastModifiedDate.getMonth() + 3);
        break;
      default:
        // General content expires after 1 year
        lastModifiedDate.setFullYear(lastModifiedDate.getFullYear() + 1);
        break;
    }
    
    return lastModifiedDate.toISOString();
  }
}