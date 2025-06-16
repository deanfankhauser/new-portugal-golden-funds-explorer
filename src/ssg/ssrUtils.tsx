
import { SSRRenderer } from './ssrRenderer';
import { HTMLTemplateGenerator } from './htmlTemplateGenerator';
import { StaticRoute } from './routeDiscovery';

export class SSRUtils {
  static async renderRoute(route: StaticRoute): Promise<{ html: string; seoData: any }> {
    return SSRRenderer.renderRoute(route);
  }

  static generateMetaTags(seoData: any): string {
    return HTMLTemplateGenerator.generateMetaTags(seoData);
  }

  static generateHTMLTemplate(content: string, seoData: any, cssFiles?: string[], jsFiles?: string[]): string {
    return HTMLTemplateGenerator.generateHTMLTemplate(content, seoData, cssFiles, jsFiles);
  }
}

// Export functions for direct access
export const renderRoute = (route: StaticRoute) => SSRUtils.renderRoute(route);
export const generateHTMLTemplate = (content: string, seoData: any, cssFiles?: string[], jsFiles?: string[]) => SSRUtils.generateHTMLTemplate(content, seoData, cssFiles, jsFiles);
