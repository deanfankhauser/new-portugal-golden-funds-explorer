
import { URL_CONFIG } from '../../utils/urlConfig';

export class BaseSEOService {
  protected static getContextualBaseUrl(): string {
    // Always use the consistent URL from URL_CONFIG which includes www
    return URL_CONFIG.BASE_URL;
  }

  protected static buildUrl(path: string): string {
    return URL_CONFIG.buildUrl(path);
  }

  protected static buildFundUrl(fundId: string): string {
    return URL_CONFIG.buildFundUrl(fundId);
  }

  protected static buildManagerUrl(managerName: string): string {
    return URL_CONFIG.buildManagerUrl(managerName);
  }

  protected static buildCategoryUrl(categoryName: string): string {
    return URL_CONFIG.buildCategoryUrl(categoryName);
  }

  protected static buildTagUrl(tagName: string): string {
    return URL_CONFIG.buildTagUrl(tagName);
  }
}
