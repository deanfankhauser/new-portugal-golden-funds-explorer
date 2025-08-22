import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
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

const rootElement = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// Use hydration for SSR pages, createRoot for SPA
if (rootElement.innerHTML.trim()) {
  hydrateRoot(rootElement, app);
} else {
  createRoot(rootElement).render(app);
}