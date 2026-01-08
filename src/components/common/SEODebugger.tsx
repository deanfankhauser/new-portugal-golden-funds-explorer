import React from 'react';
import { useSEOValidation } from '../../hooks/useSEOValidation';
import { Button } from '@/components/ui/button';
import { RotateCcw, MapPin } from 'lucide-react';

const SEODebugger: React.FC = () => {
  const { validationResult, performanceMetrics, currentRoute, runValidation, generateReport, generatePerformanceReport } = useSEOValidation();

  const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false;
  if (!isDev || !validationResult) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm text-card-foreground">SEO Debug</h3>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={runValidation}
            className="h-6 px-2 text-xs"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          <div className={`font-bold ${getScoreColor(validationResult?.score || 0)}`}>
            {validationResult?.score || 0}/100
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
        <MapPin className="h-3 w-3" />
        <span>{currentRoute}</span>
      </div>
      
      {!validationResult ? (
        <div className="text-xs text-muted-foreground">
          ⏳ Waiting for SEO tags...
        </div>
      ) : (
      <div className="text-xs space-y-1">
        {validationResult.errors.length > 0 && (
          <div className="text-destructive">
            <strong>Errors:</strong> {validationResult.errors.length}
          </div>
        )}
        
        {validationResult.warnings.length > 0 && (
          <div className="text-warning">
            <strong>Warnings:</strong> {validationResult.warnings.length}
          </div>
        )}
        
        {validationResult.suggestions.length > 0 && (
          <div className="text-primary">
            <strong>Suggestions:</strong> {validationResult.suggestions.length}
          </div>
        )}
        
        <details className="mt-2">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            View Details
          </summary>
          <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
            {generateReport()}
          </pre>
        </details>
      </div>
      )}
    </div>
  );
};

export default SEODebugger;