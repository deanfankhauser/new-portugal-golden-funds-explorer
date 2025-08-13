import { Fund } from '../data/types/funds';
import { DateManagementService } from './dateManagementService';

export class FundDataMigrationService {
  
  // Add default date fields to existing fund data
  static migrateFundData(fund: Partial<Fund>): Fund {
    const defaultDates = DateManagementService.generateDefaultFundDates(fund as Fund);
    
    return {
      ...fund,
      ...defaultDates
    } as Fund;
  }

  // Apply dates to all funds in an array
  static migrateFundsArray(funds: Partial<Fund>[]): Fund[] {
    return funds.map(fund => this.migrateFundData(fund));
  }

  // Generate specific dates based on fund characteristics
  static generateRealisticDates(fund: Partial<Fund>): Partial<Fund> {
    const currentDate = DateManagementService.getCurrentISODate();
    let basePublishedDate = '2024-01-01T00:00:00.000Z';
    
    // Adjust published date based on fund status
    if (fund.fundStatus === 'Closing Soon') {
      basePublishedDate = '2024-06-01T00:00:00.000Z';
    } else if (fund.fundStatus === 'Closed') {
      basePublishedDate = '2023-06-01T00:00:00.000Z';
    }
    
    // Generate modified date (some time after published)
    const publishedTime = new Date(basePublishedDate);
    const modifiedTime = new Date(publishedTime);
    modifiedTime.setMonth(modifiedTime.getMonth() + Math.floor(Math.random() * 6) + 1);
    
    // Verification date is recent
    const verifiedTime = new Date(currentDate);
    verifiedTime.setDate(verifiedTime.getDate() - Math.floor(Math.random() * 30));
    
    return {
      datePublished: basePublishedDate,
      dateModified: modifiedTime.toISOString(),
      dataLastVerified: verifiedTime.toISOString(),
      performanceDataDate: currentDate,
      feeLastUpdated: basePublishedDate,
      statusLastUpdated: fund.fundStatus === 'Closing Soon' ? 
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : // 30 days ago
        basePublishedDate
    };
  }
}