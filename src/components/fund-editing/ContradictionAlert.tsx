import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, XCircle, CheckCircle2 } from 'lucide-react';
import { ContradictionResult, getContradictionSummary } from '@/utils/fundContradictionDetector';

interface ContradictionAlertProps {
  result: ContradictionResult;
  showWhenClean?: boolean;
  className?: string;
}

/**
 * Alert component for edit forms showing real-time contradiction detection
 */
const ContradictionAlert: React.FC<ContradictionAlertProps> = ({
  result,
  showWhenClean = false,
  className = '',
}) => {
  // Show clean state if requested
  if (!result.hasContradictions) {
    if (!showWhenClean) return null;
    
    return (
      <Alert className={`border-success/50 bg-success/5 ${className}`}>
        <CheckCircle2 className="h-4 w-4 text-success" />
        <AlertTitle className="text-success">No Contradictions</AlertTitle>
        <AlertDescription className="text-success/80">
          The description text is consistent with structured data fields.
        </AlertDescription>
      </Alert>
    );
  }

  const hasErrors = result.errorCount > 0;

  return (
    <Alert variant={hasErrors ? 'destructive' : 'default'} className={className}>
      {hasErrors ? (
        <XCircle className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      <AlertTitle>
        {getContradictionSummary(result)}
      </AlertTitle>
      <AlertDescription className="mt-2">
        <ul className="space-y-1.5 text-sm">
          {result.contradictions.map((contradiction, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                contradiction.severity === 'error' ? 'bg-destructive' : 'bg-warning'
              }`} />
              <span>{contradiction.message}</span>
            </li>
          ))}
        </ul>
        {hasErrors && (
          <p className="mt-3 text-xs font-medium">
            Please fix these errors before saving. Update the description or change the structured data fields.
          </p>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default ContradictionAlert;
