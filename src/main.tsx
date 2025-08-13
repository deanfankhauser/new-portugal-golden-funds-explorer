import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ensure React is available globally for SSR compatibility
if (typeof window !== 'undefined' && !window.React) {
  window.React = React;
}
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
  <StrictMode>
    <App />
  </StrictMode>
);
