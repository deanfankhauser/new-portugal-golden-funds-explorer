import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FundPageSEOAudit, FundPageSEOAuditResult } from '../services/fundPageSEOAudit';

/**
 * Hook to run SEO audit on fund detail pages
 */
export const useFundPageSEOAudit = (enabled: boolean = import.meta.env.DEV) => {
  const [auditResult, setAuditResult] = useState<FundPageSEOAuditResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const location = useLocation();

  const runAudit = () => {
    if (!enabled) return;
    
    setIsRunning(true);
    
    // Wait for DOM to be fully rendered including async content
    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          const result = FundPageSEOAudit.runAudit();
          setAuditResult(result);
          setIsRunning(false);
          
          // Log comprehensive report in development
          if (import.meta.env.DEV) {
            const report = FundPageSEOAudit.generateReport();
            console.log('%c🔍 SEO Audit Results', 'color: #4CAF50; font-weight: bold; font-size: 16px');
            console.log(report);
            
            // Add to window for easy debugging
            (window as any).__seoAuditResult = result;
            (window as any).__seoAuditReport = report;
            console.log('%cℹ️ Access audit data via: window.__seoAuditResult or window.__seoAuditReport', 'color: #2196F3');
          }
        } catch (error) {
          console.error('[useFundPageSEOAudit] Audit failed:', error);
          setIsRunning(false);
        }
      }, 1000); // Increased timeout to ensure content is loaded
    });
  };

  useEffect(() => {
    if (enabled && location.pathname.match(/^\/[^/]+$/)) {
      // Run audit on initial load and route changes for fund pages
      runAudit();
    }
  }, [enabled, location.pathname]);

  return {
    auditResult,
    isRunning,
    runAudit,
    generateReport: () => auditResult ? FundPageSEOAudit.generateReport() : ''
  };
};
