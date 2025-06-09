
import { ViteSSG } from 'vite-ssg';
import App from './App';
import { routes } from './routes';
import './index.css';

export const createApp = ViteSSG(
  App,
  {
    routes: routes.map(route => ({
      path: route.path,
      component: () => import('./App')
    }))
  },
  ({ app, router, routes, isClient, initialState }) => {
    // Client-side logic if needed
  }
);
