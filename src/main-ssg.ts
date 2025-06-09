
import { ViteSSG } from 'vite-ssg';
import AppSSG from './AppSSG';
import { routes } from './routes';
import './index.css';

// Import all page components
import Index from './pages/Index';
import FundDetails from './pages/FundDetails';
import TagPage from './pages/TagPage';
import CategoryPage from './pages/CategoryPage';
import TagsHub from './pages/TagsHub';
import CategoriesHub from './pages/CategoriesHub';
import ManagersHub from './pages/ManagersHub';
import FundManager from './pages/FundManager';
import About from './pages/About';
import Disclaimer from './pages/Disclaimer';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import ComparisonPage from './pages/ComparisonPage';
import ComparisonsHub from './pages/ComparisonsHub';
import ROICalculator from './pages/ROICalculator';
import FundQuiz from './pages/FundQuiz';

// Create route mapping with components
const routeComponents = {
  '/': Index,
  '/funds/:id': FundDetails,
  '/tags': TagsHub,
  '/tags/:tag': TagPage,
  '/categories': CategoriesHub,
  '/categories/:category': CategoryPage,
  '/managers': ManagersHub,
  '/manager/:name': FundManager,
  '/about': About,
  '/disclaimer': Disclaimer,
  '/privacy': Privacy,
  '/compare': ComparisonPage,
  '/comparisons': ComparisonsHub,
  '/roi-calculator': ROICalculator,
  '/fund-quiz': FundQuiz,
  '/404': NotFound,
};

export const createApp = ViteSSG(
  AppSSG,
  {
    routes: routes.map(route => {
      // Find the component for this route
      let component = routeComponents[route.path as keyof typeof routeComponents];
      
      // Handle dynamic routes
      if (!component) {
        if (route.path.startsWith('/funds/')) {
          component = FundDetails;
        } else if (route.path.startsWith('/manager/')) {
          component = FundManager;
        } else if (route.path.startsWith('/categories/')) {
          component = CategoryPage;
        } else if (route.path.startsWith('/tags/')) {
          component = TagPage;
        } else {
          component = NotFound;
        }
      }
      
      return {
        path: route.path,
        component,
        meta: {
          seoProps: route.seoProps
        }
      };
    })
  },
  ({ app, router, routes, isClient, initialState }) => {
    // Initialize any client-side logic if needed
    if (isClient) {
      console.log('SSG: Client-side initialization');
    }
  }
);
