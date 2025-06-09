
import { ViteSSG } from 'vite-ssg'
import { routes } from './router'
import App from './App'
import './index.css'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, routes, isClient, initialState }) => {
    // you can set up the app context here
  },
)
