
import React from 'react';
import { Button } from "@/components/ui/button";
import { Flag } from 'lucide-react';

interface ReportButtonProps {
  fundName: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({ fundName }) => {
  const handleReport = () => {
    window.location.href = `mailto:info@movingto.io?subject=Incorrect Information Report - ${fundName}&body=I'd like to report incorrect information for fund: ${fundName}`;
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-gray-500 hover:text-red-600 transition-colors"
      onClick={handleReport}
    >
      <Flag className="w-4 h-4 mr-2" />
      Report incorrect information
    </Button>
  );
};

export default ReportButton;
