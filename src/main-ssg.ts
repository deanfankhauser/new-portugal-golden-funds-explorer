
import { ViteSSG } from 'vite-ssg'
import { routes } from './router'
import AppSSG from './AppSSG'
import './index.css'

export const createApp = ViteSSG(
  AppSSG,
  { routes },
  ({ app, router, routes, isClient, initialState }) => {
    // you can set up the app context here
  },
)
