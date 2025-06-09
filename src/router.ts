
import { RouteRecordRaw } from 'vite-ssg'

// Import all page components
import Index from './pages/Index'
import FundDetails from './pages/FundDetails'
import TagPage from './pages/TagPage'
import CategoryPage from './pages/CategoryPage'
import TagsHub from './pages/TagsHub'
import CategoriesHub from './pages/CategoriesHub'
import ManagersHub from './pages/ManagersHub'
import FundManager from './pages/FundManager'
import About from './pages/About'
import Disclaimer from './pages/Disclaimer'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'
import ComparisonPage from './pages/ComparisonPage'
import ComparisonsHub from './pages/ComparisonsHub'
import ROICalculator from './pages/ROICalculator'
import FundQuiz from './pages/FundQuiz'
import FAQs from './pages/FAQs'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Index,
    meta: {
      seoProps: { pageType: 'homepage' }
    }
  },
  {
    path: '/funds/:id',
    component: FundDetails,
    meta: {
      seoProps: { pageType: 'fund' }
    }
  },
  {
    path: '/tags',
    component: TagsHub,
    meta: {
      seoProps: { pageType: 'tags-hub' }
    }
  },
  {
    path: '/tags/:tag',
    component: TagPage,
    meta: {
      seoProps: { pageType: 'tag' }
    }
  },
  {
    path: '/categories',
    component: CategoriesHub,
    meta: {
      seoProps: { pageType: 'categories-hub' }
    }
  },
  {
    path: '/categories/:category',
    component: CategoryPage,
    meta: {
      seoProps: { pageType: 'category' }
    }
  },
  {
    path: '/managers',
    component: ManagersHub,
    meta: {
      seoProps: { pageType: 'managers-hub' }
    }
  },
  {
    path: '/manager/:name',
    component: FundManager,
    meta: {
      seoProps: { pageType: 'manager' }
    }
  },
  {
    path: '/about',
    component: About,
    meta: {
      seoProps: { pageType: 'about' }
    }
  },
  {
    path: '/disclaimer',
    component: Disclaimer,
    meta: {
      seoProps: { pageType: 'disclaimer' }
    }
  },
  {
    path: '/privacy',
    component: Privacy,
    meta: {
      seoProps: { pageType: 'privacy' }
    }
  },
  {
    path: '/compare',
    component: ComparisonPage,
    meta: {
      seoProps: { pageType: 'comparison' }
    }
  },
  {
    path: '/comparisons',
    component: ComparisonsHub,
    meta: {
      seoProps: { pageType: 'comparisons-hub' }
    }
  },
  {
    path: '/roi-calculator',
    component: ROICalculator,
    meta: {
      seoProps: { pageType: 'roi-calculator' }
    }
  },
  {
    path: '/fund-quiz',
    component: FundQuiz,
    meta: {
      seoProps: { pageType: 'fund-quiz' }
    }
  },
  {
    path: '/faqs',
    component: FAQs,
    meta: {
      seoProps: { pageType: 'faqs' }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFound,
    meta: {
      seoProps: { pageType: '404' }
    }
  }
]
