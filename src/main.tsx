import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Ensure React and all its features are available globally for SSR compatibility and Radix UI
declare global {
  interface Window {
    React: typeof React;
    __REACT_HYDRATION_READY__?: boolean;
  }
}

// Make React globally available with all hooks and features
if (typeof window !== 'undefined') {
  window.React = React;
  // Ensure all React features are available
  Object.assign(window, { 
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useLayoutEffect: React.useLayoutEffect,
    useContext: React.useContext,
    createContext: React.createContext,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
    useRef: React.useRef
  });
}

if (typeof global !== 'undefined') {
  (global as any).React = React;
  // Ensure all React features are available in global scope too
  Object.assign(global, { 
    React,
    useState: React.useState,
    useEffect: React.useEffect,
    useLayoutEffect: React.useLayoutEffect,
    useContext: React.useContext,
    createContext: React.createContext,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
    useRef: React.useRef
  });
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