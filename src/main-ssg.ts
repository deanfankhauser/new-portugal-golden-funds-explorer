
import { ViteSSG } from 'vite-ssg';
import App from './App';
import { routes } from './routes';
import './index.css';

export const createApp = ViteSSG(
  App,
  {
    routes: routes.map(route => ({
      path: route.path,
      component: () => import('./App'),
      meta: {
        seoProps: route.seoProps
      }
    }))
  },
  ({ app, router, routes, isClient, initialState }) => {
    // Initialize any client-side logic if needed
    if (isClient) {
      console.log('SSG: Client-side initialization');
    }
  }
);
