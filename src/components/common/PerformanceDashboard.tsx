
import React from 'react';
import { usePerformanceMonitoring } from '../../hooks/usePerformanceMonitoring';

const PerformanceDashboard: React.FC = () => {
  const { metrics, performanceBudgetMet, refreshMetrics } = usePerformanceMonitoring();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getStatusColor = (value: number, threshold: number, isLower = true) => {
    const isGood = isLower ? value < threshold : value > threshold;
    return isGood ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border text-xs max-w-xs z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">Performance</h3>
        <button
          onClick={refreshMetrics}
          className="text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-1">
        {metrics.LCP && (
          <div className="flex justify-between">
            <span>LCP:</span>
            <span className={getStatusColor(metrics.LCP, 2500)}>
              {Math.round(metrics.LCP)}ms
            </span>
          </div>
        )}
        
        {metrics.FID && (
          <div className="flex justify-between">
            <span>FID:</span>
            <span className={getStatusColor(metrics.FID, 100)}>
              {Math.round(metrics.FID)}ms
            </span>
          </div>
        )}
        
        {metrics.CLS && (
          <div className="flex justify-between">
            <span>CLS:</span>
            <span className={getStatusColor(metrics.CLS, 0.1)}>
              {metrics.CLS.toFixed(3)}
            </span>
          </div>
        )}
        
        {metrics.FCP && (
          <div className="flex justify-between">
            <span>FCP:</span>
            <span className={getStatusColor(metrics.FCP, 1800)}>
              {Math.round(metrics.FCP)}ms
            </span>
          </div>
        )}
        
        {metrics.TTFB && (
          <div className="flex justify-between">
            <span>TTFB:</span>
            <span className={getStatusColor(metrics.TTFB, 600)}>
              {Math.round(metrics.TTFB)}ms
            </span>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${performanceBudgetMet ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-600">
            Budget {performanceBudgetMet ? 'Met' : 'Exceeded'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;
