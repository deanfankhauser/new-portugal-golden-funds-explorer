
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface IndexVisualizationProps {
  scores: FundScore[];
}

const IndexVisualization: React.FC<IndexVisualizationProps> = ({ scores }) => {
  const chartData = scores.map(score => {
    const fund = getFundById(score.fundId);
    return {
      name: fund?.name.split(' ').slice(0, 2).join(' ') || 'Unknown',
      fullName: fund?.name || 'Unknown',
      score: score.movingtoScore,
      performance: score.performanceScore,
      rank: score.rank
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <h4 className="font-medium text-gray-900 mb-2">{data.fullName}</h4>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Score: <span className="font-medium text-gray-900">{data.score}</span>
            </p>
            <p className="text-sm text-gray-600">
              Rank: <span className="font-medium text-gray-900">#{data.rank}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="border-b border-gray-200 bg-white">
        <CardTitle className="text-xl font-semibold text-gray-900">
          Performance Overview
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Comparative scoring visualization
        </p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
                tick={{ fontSize: 12, fill: '#64748b' }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: '#64748b' }}
                label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#6b7280">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#6b7280" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {Math.max(...chartData.map(d => d.score))}
            </div>
            <div className="text-sm text-gray-600">Highest Score</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {(chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">
              {chartData.length}
            </div>
            <div className="text-sm text-gray-600">Total Funds</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexVisualization;
