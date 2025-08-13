// Wait for external React from CDN to be available
declare global {
  interface Window {
    React: any;
    ReactDOM: any;
    __REACT_HYDRATION_READY__?: boolean;
    __SSG_MODE__?: boolean;
  }
}

// Function to wait for React to be available
async function waitForReact(): Promise<{ React: any; createRoot: any; StrictMode: any }> {
  return new Promise((resolve, reject) => {
    const maxWaitTime = 10000; // 10 seconds timeout
    const startTime = Date.now();
    
    const checkReact = () => {
      if (window.React && window.ReactDOM && window.ReactDOM.createRoot) {
        console.log('✅ React loaded from CDN and available');
        resolve({
          React: window.React,
          createRoot: window.ReactDOM.createRoot,
          StrictMode: window.React.StrictMode
        });
      } else if (Date.now() - startTime > maxWaitTime) {
        reject(new Error('React CDN failed to load within timeout'));
      } else {
        setTimeout(checkReact, 50); // Check every 50ms
      }
    };
    
    checkReact();
  });
}

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

// Initialize app when React is available
waitForReact()
  .then(({ React, createRoot, StrictMode }) => {
    console.log('🚀 Starting React app...');
    
    createRoot(document.getElementById("root")!).render(
      React.createElement(StrictMode, null, React.createElement(App))
    );
  })
  .catch((error) => {
    console.error('❌ Failed to load React:', error);
    // Fallback: try to load React via import as backup
    import('react').then(ReactModule => {
      import('react-dom/client').then(ReactDOMModule => {
        console.log('🔄 Using fallback React import');
        const createRoot = ReactDOMModule.createRoot;
        const StrictMode = ReactModule.StrictMode;
        
        createRoot(document.getElementById("root")!).render(
          ReactModule.createElement(StrictMode, null, ReactModule.createElement(App))
        );
      });
    }).catch(() => {
      document.getElementById("root")!.innerHTML = '<div style="padding: 20px; color: red;">Failed to load React. Please refresh the page.</div>';
    });
  });