// Use external React from CDN
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    __REACT_HYDRATION_READY__?: boolean;
    __SSG_MODE__?: boolean;
  }
}

const React = window.React;
const { createRoot } = window.ReactDOM;
const { StrictMode } = React;

import './index.css'
import App from './App.tsx'

// Verify React is available
if (!React || !createRoot) {
  throw new Error('React is not available. Make sure React CDN scripts are loaded first.');
}

console.log('✅ React available in main.tsx');

import { PerformanceMonitoringService } from './services/performanceMonitoringService'
import { ImageOptimizationService } from './services/imageOptimizationService'
import { SEOValidationService } from './services/seoValidationService'

// Initialize performance monitoring and optimization services
if (typeof window !== 'undefined') {
  // Initialize performance monitoring
  PerformanceMonitoringService.initializeMonitoring();
  
  // Initialize image optimization
  ImageOptimizationService.initializeGlobalOptimization();
  
  // Log SEO validation report in development
  if (import.meta.env.DEV) {
    setTimeout(() => {
      SEOValidationService.logSEOReport();
    }, 2000);
  }
}

createRoot(document.getElementById("root")!).render(
  React.createElement(StrictMode, null, React.createElement(App))
);