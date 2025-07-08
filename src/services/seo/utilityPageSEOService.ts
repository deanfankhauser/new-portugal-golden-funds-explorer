
import { SEOData } from '../../types/seo';
import { BaseSEOService } from './baseSEOService';

export class UtilityPageSEOService extends BaseSEOService {
  static getAboutPageSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: 'About the Golden Visa Funds Directory | Movingto',
      description: 'Learn more about the Movingto Golden Visa Funds Directory and how it can help you find the right fund for you.',
      url: `${baseUrl}/about`,
      structuredData: {
        ...this.createBaseStructuredData(),
        '@type': 'AboutPage',
        'name': 'About Portugal Golden Visa Funds',
        'description': 'Learn about our mission to help investors find the best Portugal Golden Visa investment funds'
      }
    };
  }

  static getFAQsPageSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: 'Portugal Golden Visa Investment Funds FAQs',
      description: 'Frequently asked questions about Portugal Golden Visa Investment Funds. Learn about eligibility, requirements, and how to invest.',
      url: `${baseUrl}/faqs`,
      structuredData: {
        ...this.createBaseStructuredData(),
        '@type': 'FAQPage',
        'name': 'Portugal Golden Visa Investment Funds FAQs',
        'description': 'Frequently asked questions about Portugal Golden Visa investment funds and the application process'
      }
    };
  }

  static getDisclaimerPageSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: 'Disclaimer | Portugal Golden Visa Investment Funds',
      description: 'Important disclaimer and legal information about using our Golden Visa investment funds directory.',
      url: `${baseUrl}/disclaimer`,
      structuredData: {}
    };
  }

  static getPrivacyPageSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: 'Privacy Policy | MovingTo Portugal Golden Visa Funds',
      description: 'Our privacy policy and how we handle your personal information when using the Portugal Golden Visa Funds directory.',
      url: `${baseUrl}/privacy`,
      structuredData: {}
    };
  }

  static getNotFoundPageSEO(): SEOData {
    const baseUrl = this.getContextualBaseUrl();
    return {
      title: 'Page Not Found | Portugal Golden Visa Investment Funds',
      description: 'The page you are looking for could not be found. Return to our Golden Visa investment funds directory.',
      url: baseUrl,
      structuredData: {}
    };
  }
}
