
import { StructuredDataSchema } from './structuredDataService';
import { BaseSchemaGenerator } from './schemas/baseSchemaGenerator';
import { FundManagerSchemaGenerator } from './schemas/fundManagerSchemaGenerator';
import { ManagerPageSchemaGenerator } from './schemas/managerPageSchemaGenerator';

// Re-export types for backward compatibility
export type { FundManagerData } from '../types/fundManagerTypes';

export class FundManagerStructuredDataService {
  
  // WebSite and Organization schemas
  static generateWebSiteSchema = BaseSchemaGenerator.generateWebSiteSchema;
  static generateMovingtoOrganizationSchema = BaseSchemaGenerator.generateMovingtoOrganizationSchema;

  // Fund manager specific schemas
  static generateFundManagerOrganizationSchema = FundManagerSchemaGenerator.generateFundManagerOrganizationSchema;
  static generateFinancialServiceSchema = FundManagerSchemaGenerator.generateFinancialServiceSchema;

  // Page specific schemas
  static generateManagerFundsCollectionSchema = ManagerPageSchemaGenerator.generateManagerFundsCollectionSchema;
  static generateManagerPageSchema = ManagerPageSchemaGenerator.generateManagerPageSchema;
  static generateManagerArticleSchema = ManagerPageSchemaGenerator.generateManagerArticleSchema;
}
