import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, XCircle, Info } from 'lucide-react';
import { ContradictionResult } from '@/utils/fundContradictionDetector';

interface ContradictionWarningBannerProps {
  result: ContradictionResult;
  className?: string;
}

/**
 * Admin-visible warning banner for fund pages with contradictions
 * Only visible to admins/managers, not public visitors
 */
const ContradictionWarningBanner: React.FC<ContradictionWarningBannerProps> = ({
  result,
  className = '',
}) => {
  if (!result.hasContradictions) {
    return null;
  }

  const hasErrors = result.errorCount > 0;
  const variant = hasErrors ? 'destructive' : 'default';
  const Icon = hasErrors ? XCircle : AlertTriangle;

  return (
    <Alert variant={variant} className={`mb-6 ${className}`}>
      <Icon className="h-4 w-4" />
      <AlertTitle className="font-semibold">
        {hasErrors 
          ? `${result.errorCount} Conflicting Statement${result.errorCount > 1 ? 's' : ''} Detected`
          : `${result.warningCount} Warning${result.warningCount > 1 ? 's' : ''}`
        }
      </AlertTitle>
      <AlertDescription className="mt-2">
        <p className="text-sm mb-3">
          This page has inconsistencies between structured data and marketing copy that should be fixed.
        </p>
        <ul className="space-y-2">
          {result.contradictions.map((contradiction, index) => (
            <li 
              key={index} 
              className={`text-sm flex items-start gap-2 p-2 rounded ${
                contradiction.severity === 'error' 
                  ? 'bg-destructive/10' 
                  : 'bg-warning/10'
              }`}
            >
              {contradiction.severity === 'error' ? (
                <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-destructive" />
              ) : (
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-warning" />
              )}
              <div>
                <span className="font-medium">{contradiction.message}</span>
                {contradiction.location !== 'auto-generated' && (
                  <span className="text-muted-foreground ml-1">
                    (in {contradiction.location === 'description' ? 'short description' : 'detailed description'})
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <Info className="h-3 w-3" />
          Update the structured data fields or revise the copy to resolve these conflicts.
        </p>
      </AlertDescription>
    </Alert>
  );
};

export default ContradictionWarningBanner;
