
import React from 'react';
import { Button } from "@/components/ui/button";
import { Flag } from 'lucide-react';
import { buildMailtoUrl } from '../../utils/urlHelpers';

interface ReportButtonProps {
  fundName: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({ fundName }) => {
  const handleReport = () => {
    const subject = `Incorrect Information Report - ${fundName}`;
    const body = `I'd like to report incorrect information for fund: ${fundName}`;
    window.location.href = buildMailtoUrl('info@movingto.com', subject, body);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-destructive transition-colors"
      onClick={handleReport}
    >
      <Flag className="w-4 h-4 mr-2" />
      Report incorrect information
    </Button>
  );
};

export default ReportButton;
