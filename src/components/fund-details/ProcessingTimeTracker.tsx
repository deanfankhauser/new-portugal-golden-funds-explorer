
import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Circle } from 'lucide-react';

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

    // Add fund-specific steps
    if (fund.tags.includes('Golden Visa')) {
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
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <Clock className="w-5 h-5 text-blue-600" />
          Investment Processing Timeline
        </CardTitle>
        <p className="text-gray-600">
          Expected processing time: <span className="font-semibold text-blue-700">{totalTime}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm text-gray-500">0% Complete</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>

        {/* Processing Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-100">
              <div className="flex-shrink-0 mt-1">
                {step.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                  <span className="text-sm text-blue-600 font-medium">{step.duration}</span>
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">Important Notes</h4>
          <ul className="text-xs text-amber-700 space-y-1">
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
