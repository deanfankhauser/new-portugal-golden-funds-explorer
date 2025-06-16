
import { SSRRenderer } from './ssrRenderer';
import { HTMLTemplateGenerator } from './htmlTemplateGenerator';
import { StaticRoute } from './routeDiscovery';

export class SSRUtils {
  static renderRoute(route: StaticRoute): { html: string; seoData: any } {
    return SSRRenderer.renderRoute(route);
  }

  static generateMetaTags(seoData: any): string {
    return HTMLTemplateGenerator.generateMetaTags(seoData);
  }

  static generateHTMLTemplate(content: string, seoData: any): string {
    return HTMLTemplateGenerator.generateHTMLTemplate(content, seoData);
  }
}

// Export functions for direct access
export const renderRoute = (route: StaticRoute) => SSRUtils.renderRoute(route);
export const generateHTMLTemplate = (content: string, seoData: any) => SSRUtils.generateHTMLTemplate(content, seoData);
