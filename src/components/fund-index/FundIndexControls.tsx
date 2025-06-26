
import React from 'react';
import { Search, Download } from 'lucide-react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface FundIndexControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filteredScores: FundScore[];
}

const FundIndexControls: React.FC<FundIndexControlsProps> = ({
  searchTerm,
  onSearchChange,
  filteredScores
}) => {
  const handleExportCSV = () => {
    const csvContent = [
      ['Rank', 'Fund Name', 'Manager', 'Movingto Score', 'Performance Score', 'Management Fee', 'Min Investment', 'Category', 'Status'].join(','),
      ...filteredScores.map(score => {
        const fund = getFundById(score.fundId);
        if (!fund) return '';
        return [
          score.rank,
          `"${fund.name}"`,
          `"${fund.managerName}"`,
          score.movingtoScore,
          score.performanceScore,
          fund.managementFee,
          fund.minimumInvestment,
          `"${fund.category}"`,
          `"${fund.fundStatus}"`
        ].join(',');
      }).filter(row => row !== '')
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fund-index-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search funds, managers, or categories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );
};

export default FundIndexControls;
