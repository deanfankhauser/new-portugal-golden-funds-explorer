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
    
    // Wait for DOM to be fully rendered
    requestAnimationFrame(() => {
      setTimeout(() => {
        const result = FundPageSEOAudit.runAudit();
        setAuditResult(result);
        setIsRunning(false);
        
        // Log report in development
        if (import.meta.env.DEV) {
          console.log(FundPageSEOAudit.generateReport());
        }
      }, 500);
    });
  };

  useEffect(() => {
    if (enabled && location.pathname.includes('/')) {
      // Run audit on initial load and route changes
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
