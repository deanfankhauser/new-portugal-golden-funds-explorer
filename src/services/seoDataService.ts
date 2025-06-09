
import { SEOData, PageSEOProps } from '../types/seo';

export class SEODataService {
  private static baseUrl = 'https://movingto.com/funds';

  static getSEOData({ 
    pageType, 
    fundName, 
    managerName, 
    categoryName, 
    tagName,
    comparisonTitle
  }: PageSEOProps): SEOData {
    switch (pageType) {
      case 'homepage':
        return {
          title: 'Portugal Golden Visa Investment Funds | Eligible Investments 2025',
          description: 'Explore our Portugal Golden Visa Investment Funds List for 2025. Find eligible investment funds to secure residency with a €500,000 investment.',
          url: this.baseUrl,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Movingto Portugal Golden Visa Funds',
            'url': this.baseUrl,
            'description': 'Find and compare the best Golden Visa investment funds in Portugal',
            'publisher': {
              '@type': 'Organization',
              'name': 'Movingto',
              'url': this.baseUrl
            }
          }
        };
      
      case 'fund':
        return {
          title: `${fundName} | Investment Fund Details | Movingto`,
          description: `${fundName} - Detailed information about this Golden Visa investment fund. Min investment, fees, returns and more.`,
          url: `${this.baseUrl}/funds/${fundName?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'FinancialProduct',
            'name': fundName,
            'description': `Golden Visa investment fund: ${fundName}`,
            'provider': {
              '@type': 'Organization',
              'name': 'Fund Manager'
            }
          }
        };
      
      case 'manager':
        return {
          title: `${managerName} Golden Visa Investment Funds | Fund Manager Profile`,
          description: `Discover ${managerName}'s Golden Visa investment funds. Compare funds and investment strategies from this experienced fund manager.`,
          url: `${this.baseUrl}/manager/${managerName?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': managerName,
            'description': `Fund manager specializing in Golden Visa investment funds`,
            'serviceArea': {
              '@type': 'Place',
              'name': 'Portugal'
            }
          }
        };
      
      case 'category':
        return {
          title: `Top ${categoryName} Golden Visa Funds | Movingto`,
          description: `Discover ${categoryName} Golden Visa funds. Browse and compare funds to find the best Golden Visa investment for you.`,
          url: `${this.baseUrl}/categories/${categoryName?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': `${categoryName} Golden Visa Investment Funds`,
            'description': `Collection of ${categoryName} Golden Visa investment funds`
          }
        };
      
      case 'tag':
        return {
          title: `Top ${tagName} Golden Visa Funds | Movingto`,
          description: `Discover ${tagName} Golden Visa funds. Browse and compare to find the best Golden Visa fund for you.`,
          url: `${this.baseUrl}/tags/${tagName?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': `${tagName} Golden Visa Investment Funds`,
            'description': `Collection of ${tagName} Golden Visa investment funds`
          }
        };

      case '404':
        return {
          title: 'Page Not Found | Portugal Golden Visa Investment Funds',
          description: 'The page you are looking for could not be found. Return to our Golden Visa investment funds directory.',
          url: this.baseUrl,
          structuredData: {}
        };

      case 'disclaimer':
        return {
          title: 'Disclaimer | Portugal Golden Visa Investment Funds',
          description: 'Important disclaimer and legal information about using our Golden Visa investment funds directory.',
          url: `${this.baseUrl}/disclaimer`,
          structuredData: {}
        };

      case 'about':
        return {
          title: 'About the Golden Visa Funds Directory | Movingto',
          description: 'Learn more about the Movingto Golden Visa Funds Directory and how it can help you find the right fund for you.',
          url: `${this.baseUrl}/about`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'AboutPage',
            'name': 'About Portugal Golden Visa Funds',
            'description': 'Learn about our mission to help investors find the best Portugal Golden Visa investment funds'
          }
        };

      case 'faqs':
        return {
          title: 'Portugal Golden Visa Investment Funds FAQs',
          description: 'Frequently asked questions about Portugal Golden Visa Investment Funds. Learn about eligibility, requirements, and how to invest.',
          url: `${this.baseUrl}/faqs`,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'name': 'Portugal Golden Visa Investment Funds FAQs',
            'description': 'Frequently asked questions about Portugal Golden Visa investment funds and the application process'
          }
        };

      case 'privacy':
        return {
          title: 'Privacy Policy | MovingTo Portugal Golden Visa Funds',
          description: 'Our privacy policy and how we handle your personal information when using the Portugal Golden Visa Funds directory.',
          url: `${this.baseUrl}/privacy`,
          structuredData: {}
        };

      case 'comparison':
        return {
          title: 'Compare Funds | Portugal Golden Visa Investment Funds',
          description: 'Compare Portugal Golden Visa investment funds side-by-side. Analyze fees, returns, minimum investments, and more.',
          url: `${this.baseUrl}/compare`,
          structuredData: {}
        };

      case 'comparisons-hub':
        return {
          title: 'Fund Comparisons Hub | Portugal Golden Visa Investment Funds',
          description: 'Browse detailed fund comparisons for Portugal Golden Visa investment funds.',
          url: `${this.baseUrl}/comparisons`,
          structuredData: {}
        };

      case 'fund-comparison':
        return {
          title: `${comparisonTitle} | Fund Comparison`,
          description: `Detailed comparison of Portugal Golden Visa investment funds: ${comparisonTitle}`,
          url: `${this.baseUrl}/compare/${comparisonTitle?.toLowerCase().replace(/\s+/g, '-')}`,
          structuredData: {}
        };

      case 'roi-calculator':
        return {
          title: 'ROI Calculator | Portugal Golden Visa Investment Funds',
          description: 'Calculate potential returns on Portugal Golden Visa fund investments with our free ROI calculator.',
          url: `${this.baseUrl}/roi-calculator`,
          structuredData: {}
        };

      case 'fund-quiz':
        return {
          title: 'Fund Quiz | Find Your Perfect Golden Visa Investment',
          description: 'Take our quiz to get personalized Portugal Golden Visa fund recommendations based on your investment profile.',
          url: `${this.baseUrl}/fund-quiz`,
          structuredData: {}
        };

      case 'managers-hub':
        return {
          title: 'Fund Managers | Portugal Golden Visa Investment Funds',
          description: 'Browse fund managers offering Portugal Golden Visa investment opportunities.',
          url: `${this.baseUrl}/managers`,
          structuredData: {}
        };

      case 'categories-hub':
        return {
          title: 'Fund Categories | Portugal Golden Visa Investment Funds',
          description: 'Explore different categories of Portugal Golden Visa investment funds.',
          url: `${this.baseUrl}/categories`,
          structuredData: {}
        };

      case 'tags-hub':
        return {
          title: 'Fund Tags | Portugal Golden Visa Investment Funds',
          description: 'Browse funds by tags to find the perfect Portugal Golden Visa investment.',
          url: `${this.baseUrl}/tags`,
          structuredData: {}
        };
      
      default:
        return {
          title: 'Portugal Golden Visa Investment Funds | Movingto',
          description: 'Find and compare the best Golden Visa investment funds in Portugal',
          url: this.baseUrl,
          structuredData: {}
        };
    }
  }
}
