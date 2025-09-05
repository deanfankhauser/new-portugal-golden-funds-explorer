import React from 'react';
import { useSEOValidation } from '../../hooks/useSEOValidation';

const SEODebugger: React.FC = () => {
  const { validationResult, performanceMetrics, generateReport, generatePerformanceReport } = useSEOValidation();

  if (!import.meta.env.DEV || !validationResult) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">SEO Debug</h3>
        <div className={`font-bold ${getScoreColor(validationResult.score)}`}>
          {validationResult.score}/100
        </div>
      </div>
      
      <div className="text-xs space-y-1">
        {validationResult.errors.length > 0 && (
          <div className="text-red-600">
            <strong>Errors:</strong> {validationResult.errors.length}
          </div>
        )}
        
        {validationResult.warnings.length > 0 && (
          <div className="text-yellow-600">
            <strong>Warnings:</strong> {validationResult.warnings.length}
          </div>
        )}
        
        {validationResult.suggestions.length > 0 && (
          <div className="text-blue-600">
            <strong>Suggestions:</strong> {validationResult.suggestions.length}
          </div>
        )}
        
        <details className="mt-2">
          <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
            View Details
          </summary>
          <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40">
            {generateReport()}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default SEODebugger;