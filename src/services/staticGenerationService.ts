
import { funds } from '../data/funds';
import { getAllCategories, getAllTags } from '../data/services/tags-service';
import { getAllFundManagers } from '../data/services/managers-service';

export interface StaticRoute {
  path: string;
  priority: number;
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  lastMod?: string;
}

export class StaticGenerationService {
  
  // Generate all static routes for the application
  static generateStaticRoutes(): StaticRoute[] {
    const currentDate = new Date().toISOString().split('T')[0];
    const routes: StaticRoute[] = [];

    // Homepage
    routes.push({
      path: '/',
      priority: 1.0,
      changeFreq: 'daily',
      lastMod: currentDate
    });

    // Fund detail pages
    funds.forEach(fund => {
      routes.push({
        path: `/funds/${fund.id}`,
        priority: 0.9,
        changeFreq: 'weekly',
        lastMod: currentDate
      });
    });

    // Category pages
    const categories = getAllCategories();
    categories.forEach(category => {
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');
      routes.push({
        path: `/categories/${categorySlug}`,
        priority: 0.8,
        changeFreq: 'weekly',
        lastMod: currentDate
      });
    });

    // Tag pages
    const tags = getAllTags();
    tags.forEach(tag => {
      const tagSlug = tag.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');
      routes.push({
        path: `/tags/${tagSlug}`,
        priority: 0.7,
        changeFreq: 'weekly',
        lastMod: currentDate
      });
    });

    // Manager pages
    const managers = getAllFundManagers();
    managers.forEach(manager => {
      const managerSlug = manager.name.toLowerCase().replace(/\s+/g, '-').replace(/[&]/g, 'and');
      routes.push({
        path: `/manager/${managerSlug}`,
        priority: 0.8,
        changeFreq: 'monthly',
        lastMod: currentDate
      });
    });

    // Static pages
    const staticPages = [
      { path: '/about', priority: 0.6 },
      { path: '/faqs', priority: 0.7 },
      { path: '/disclaimer', priority: 0.3 },
      { path: '/privacy', priority: 0.3 },
      { path: '/roi-calculator', priority: 0.6 },
      { path: '/fund-quiz', priority: 0.6 },
      { path: '/comparisons', priority: 0.7 }
    ];

    staticPages.forEach(page => {
      routes.push({
        path: page.path,
        priority: page.priority,
        changeFreq: 'monthly',
        lastMod: currentDate
      });
    });

    return routes;
  }

  // Generate preload hints for critical resources
  static generatePreloadHints(): string[] {
    return [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      '/src/index.css'
    ];
  }

  // Generate critical fund data for initial render
  static generateCriticalFundData() {
    // Return essential fund data for above-the-fold content
    return funds.slice(0, 6).map(fund => ({
      id: fund.id,
      name: fund.name,
      description: fund.description.substring(0, 150) + '...',
      category: fund.category,
      minimumInvestment: fund.minimumInvestment,
      managementFee: fund.managementFee,
      tags: fund.tags.slice(0, 3),
      managerName: fund.managerName,
      fundStatus: fund.fundStatus
    }));
  }

  // Generate meta data for each route
  static generateRouteMetaData(path: string): { title: string; description: string; keywords: string[] } {
    const baseTitle = 'Portugal Golden Visa Investment Funds | Movingto';
    const baseKeywords = ['Portugal Golden Visa', 'Investment Funds', 'Residency', 'Immigration'];

    if (path === '/') {
      return {
        title: baseTitle,
        description: 'Explore qualified Portugal Golden Visa Investment Funds. Find eligible investment options to secure Portuguese residency with a €500,000 investment.',
        keywords: [...baseKeywords, 'Fund Directory', 'Investment Options']
      };
    }

    if (path.startsWith('/funds/')) {
      const fundId = path.replace('/funds/', '');
      const fund = funds.find(f => f.id === fundId);
      if (fund) {
        return {
          title: `${fund.name} | Fund Details | Movingto`,
          description: `${fund.name} - ${fund.description.substring(0, 120)}... Minimum investment: €${fund.minimumInvestment.toLocaleString()}.`,
          keywords: [...baseKeywords, fund.name, fund.category, fund.managerName]
        };
      }
    }

    return {
      title: baseTitle,
      description: 'Portugal Golden Visa Investment Funds Directory',
      keywords: baseKeywords
    };
  }
}
