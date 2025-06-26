
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp } from 'lucide-react';

interface IndexVisualizationProps {
  scores: FundScore[];
}

const IndexVisualization: React.FC<IndexVisualizationProps> = ({ scores }) => {
  const chartData = scores.map(score => {
    const fund = getFundById(score.fundId);
    return {
      name: fund?.name.substring(0, 20) + (fund?.name.length > 20 ? '...' : '') || 'Unknown',
      fullName: fund?.name || 'Unknown',
      score: score.movingtoScore,
      performance: score.performanceScore,
      regulatory: score.regulatoryScore,
      fees: score.feeScore,
      protection: score.protectionScore
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.fullName}</p>
          <div className="space-y-1 mt-2">
            <p className="text-blue-600 font-bold">
              Movingto Score: {data.score}
            </p>
            <div className="text-xs text-gray-600 space-y-1">
              <p>Performance: {data.performance}/100</p>
              <p>Regulatory: {data.regulatory}/100</p>
              <p>Fees: {data.fees}/100</p>
              <p>Protection: {data.protection}/100</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Top 5 Fund Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                fontSize={12}
              />
              <YAxis 
                domain={[0, 100]}
                label={{ value: 'Movingto Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="score" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-600">
          Hover over bars to see detailed scoring breakdown
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexVisualization;
