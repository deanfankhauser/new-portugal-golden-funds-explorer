import React, { useEffect } from 'react';
import { SEOMonitoringService } from '../../services/seoMonitoringService';
import { PerformanceOptimizationService } from '../../services/performanceOptimizationService';

interface SEOEnhancerProps {
  enableMonitoring?: boolean;
  monitoringInterval?: number;
}

export const SEOEnhancer: React.FC<SEOEnhancerProps> = ({ 
  enableMonitoring = import.meta.env.DEV,
  monitoringInterval = 30
}) => {
  useEffect(() => {
    // Initialize performance optimizations
    PerformanceOptimizationService.initializePerformanceOptimizations();

    // Initialize SEO monitoring in development
    if (enableMonitoring) {
      SEOMonitoringService.initialize({
        enabled: true,
        intervalMinutes: monitoringInterval,
        alertThreshold: 70,
        trackingEnabled: true
      });

      return () => {
        SEOMonitoringService.stopMonitoring();
      };
    }
  }, [enableMonitoring, monitoringInterval]);

  // Only render in development for debugging
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-background/90 backdrop-blur-sm border rounded-lg p-3 text-xs shadow-lg max-w-xs">
      <div className="font-semibold text-primary mb-1">SEO Status</div>
      <SEOStatusDisplay />
    </div>
  );
};

const SEOStatusDisplay: React.FC = () => {
  const [status, setStatus] = React.useState(SEOMonitoringService.getCurrentStatus());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStatus(SEOMonitoringService.getCurrentStatus());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span>Score:</span>
        <span className={`font-mono ${status.score >= 80 ? 'text-green-600' : status.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
          {status.score}/100 {status.trend}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Alerts:</span>
        <span className={`font-mono ${status.alerts === 0 ? 'text-green-600' : 'text-red-600'}`}>
          {status.alerts}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Last Check:</span>
        <span className="font-mono text-muted-foreground">{status.lastCheck}</span>
      </div>
    </div>
  );
};

export default SEOEnhancer;