
import { PageSEOProps } from './types/seo';

export interface RouteConfig {
  path: string;
  seoProps: PageSEOProps;
}

export const routes: RouteConfig[] = [
  {
    path: '/',
    seoProps: { pageType: 'homepage' }
  },
  {
    path: '/managers',
    seoProps: { pageType: 'managers-hub' }
  },
  {
    path: '/categories',
    seoProps: { pageType: 'categories-hub' }
  },
  {
    path: '/tags',
    seoProps: { pageType: 'tags-hub' }
  },
  {
    path: '/compare',
    seoProps: { pageType: 'comparison' }
  },
  {
    path: '/comparisons',
    seoProps: { pageType: 'comparisons-hub' }
  },
  {
    path: '/roi-calculator',
    seoProps: { pageType: 'roi-calculator' }
  },
  {
    path: '/fund-quiz',
    seoProps: { pageType: 'fund-quiz' }
  },
  {
    path: '/about',
    seoProps: { pageType: 'about' }
  },
  {
    path: '/faqs',
    seoProps: { pageType: 'faqs' }
  },
  {
    path: '/privacy',
    seoProps: { pageType: 'privacy' }
  },
  {
    path: '/disclaimer',
    seoProps: { pageType: 'disclaimer' }
  },
  {
    path: '/404',
    seoProps: { pageType: '404' }
  }
];
