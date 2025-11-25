import React from 'react';
import { Fund } from '../../data/types/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Circle } from 'lucide-react';
import { isFundGVEligible } from '../../data/services/gv-eligibility-service';

interface ProcessingTimeTrackerProps {
  fund: Fund;
}

interface ProcessingStep {
  id: string;
  title: string;
  duration: string;
  description: string;
  completed: boolean;
}

const ProcessingTimeTracker: React.FC<ProcessingTimeTrackerProps> = ({ fund }) => {
  // Generate processing steps based on fund characteristics
  const getProcessingSteps = (fund: Fund): ProcessingStep[] => {
    const baseSteps = [
      {
        id: 'initial-review',
        title: 'Initial Review',
        duration: '1-2 days',
        description: 'Document verification and preliminary assessment',
        completed: false
      },
      {
        id: 'due-diligence',
        title: 'Due Diligence',
        duration: '3-5 days',
        description: 'Background checks and compliance verification',
        completed: false
      }
    ];

    // Add fund-specific steps (only for verified GV eligible funds)
    if (isFundGVEligible(fund) && fund.isVerified) {
      baseSteps.push({
        id: 'golden-visa-review',
        title: 'Golden Visa Review',
        duration: '5-7 days',
        description: 'Immigration compliance and eligibility verification',
        completed: false
      });
    }

    if (fund.tags.includes('UCITS')) {
      baseSteps.push({
        id: 'regulatory-approval',
        title: 'UCITS Regulatory Approval',
        duration: '2-3 days',
        description: 'UCITS compliance and regulatory clearance',
        completed: false
      });
    } else {
      baseSteps.push({
        id: 'regulatory-approval',
        title: 'Regulatory Approval',
        duration: '3-5 days',
        description: 'Fund-specific regulatory compliance review',
        completed: false
      });
    }

    baseSteps.push({
      id: 'final-approval',
      title: 'Final Approval',
      duration: '1-2 days',
      description: 'Investment committee review and final approval',
      completed: false
    });

    return baseSteps;
  };

  const calculateTotalTime = (steps: ProcessingStep[]): string => {
    // Extract min and max days from each step
    const totalMinDays = steps.reduce((total, step) => {
      const match = step.duration.match(/(\d+)/);
      return total + (match ? parseInt(match[1]) : 0);
    }, 0);

    const totalMaxDays = steps.reduce((total, step) => {
      const matches = step.duration.match(/(\d+)-(\d+)/);
      if (matches) {
        return total + parseInt(matches[2]);
      }
      const singleMatch = step.duration.match(/(\d+)/);
      return total + (singleMatch ? parseInt(singleMatch[1]) : 0);
    }, 0);

    if (totalMinDays === totalMaxDays) {
      return `${totalMinDays} days`;
    }
    return `${totalMinDays}-${totalMaxDays} days`;
  };

  const steps = getProcessingSteps(fund);
  const totalTime = calculateTotalTime(steps);

  return (
    <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <Clock className="w-5 h-5 text-accent" />
          Investment Processing Timeline
        </CardTitle>
        <p className="text-muted-foreground">
          Expected processing time: <span className="font-semibold text-accent">{totalTime}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="bg-card rounded-lg p-4 border border-accent/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">0% Complete</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
              <div className="flex-shrink-0 mt-1">
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground/50" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-foreground">{step.title}</h4>
                  <span className="text-sm text-accent font-medium">{step.duration}</span>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <h4 className="font-semibold text-warning mb-2">Important Notes</h4>
          <ul className="text-xs text-warning-foreground/80 space-y-1">
            <li>• Processing times are estimates and may vary based on application complexity</li>
            <li>• Additional documentation requests may extend processing time</li>
            <li>• Peak periods may result in longer processing times</li>
            <li>• We'll keep you updated at each stage of the process</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProcessingTimeTracker;
