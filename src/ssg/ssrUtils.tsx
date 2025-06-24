
import { SSRRenderer } from './ssrRenderer';
import { generateHTMLTemplate } from './htmlTemplateGenerator';
import { StaticRoute } from './routeDiscovery';

export class SSRUtils {
  static async renderRoute(route: StaticRoute): Promise<{ html: string; seoData: any }> {
    return SSRRenderer.renderRoute(route);
  }

  static generateMetaTags(seoData: any): string {
    // Generate basic meta tags from SEO data
    return `
      <title>${seoData.title}</title>
      <meta name="description" content="${seoData.description}" />
      <meta property="og:title" content="${seoData.title}" />
      <meta property="og:description" content="${seoData.description}" />
      <meta property="og:url" content="${seoData.url}" />
    `;
  }

  static generateHTMLTemplate(content: string, seoData: any, cssFiles?: string[], jsFiles?: string[]): string {
    return generateHTMLTemplate(content, seoData, cssFiles, jsFiles);
  }
}

// Export functions for direct access
export const renderRoute = (route: StaticRoute) => SSRUtils.renderRoute(route);
export const generateHTMLTemplate = (content: string, seoData: any, cssFiles?: string[], jsFiles?: string[]) => SSRUtils.generateHTMLTemplate(content, seoData, cssFiles, jsFiles);
