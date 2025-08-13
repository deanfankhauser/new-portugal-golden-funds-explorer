
import React from 'react';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { TrendingUp, TrendingDown, Award, Activity } from 'lucide-react';

interface IndexSummaryWidgetsProps {
  scores: FundScore[];
}

const IndexSummaryWidgets: React.FC<IndexSummaryWidgetsProps> = ({ scores }) => {
  const totalFunds = scores.length;
  const averageScore = (scores.reduce((sum, score) => sum + score.movingtoScore, 0) / totalFunds).toFixed(1);
  const highestScore = Math.max(...scores.map(s => s.movingtoScore));
  const lowestScore = Math.min(...scores.map(s => s.movingtoScore));
  
  // Calculate average management fee
  const averageFee = scores.reduce((sum, score) => {
    const fund = getFundById(score.fundId);
    return sum + (fund?.managementFee || 0);
  }, 0) / totalFunds;

  // Count open funds
  const openFunds = scores.filter(score => {
    const fund = getFundById(score.fundId);
    return fund?.fundStatus === 'Open';
  }).length;

  const widgets = [
    {
      title: 'Total Funds',
      value: totalFunds.toString(),
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Average Score',
      value: averageScore,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Highest Score',
      value: highestScore.toString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Open Funds',
      value: openFunds.toString(),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Avg Mgmt Fee',
      value: `${averageFee.toFixed(1)}%`,
      icon: TrendingDown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {widgets.map((widget) => (
        <div key={widget.title} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${widget.bgColor}`}>
              <widget.icon className={`w-4 h-4 ${widget.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xl font-bold text-gray-900 truncate">
                {widget.value}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {widget.title}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IndexSummaryWidgets;
