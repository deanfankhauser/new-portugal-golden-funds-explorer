
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';

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

  const getBarColor = (rank: number) => {
    switch (rank) {
      case 1: return '#f59e0b'; // amber-500
      case 2: return '#9ca3af'; // gray-400
      case 3: return '#d97706'; // amber-600
      default: return '#6b7280'; // gray-500
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <h4 className="font-semibold text-gray-900 mb-2">{data.fullName}</h4>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="text-gray-700 font-medium">Movingto Score:</span> {data.score}
            </p>
            <p className="text-sm">
              <span className="text-gray-700 font-medium">Performance:</span> {data.performance}
            </p>
            <p className="text-sm">
              <span className="text-gray-700 font-medium">Rank:</span> #{data.rank}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="bg-gray-900 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-white/10 rounded-lg">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <div>Fund Performance Overview</div>
            <div className="text-gray-300 text-sm font-normal mt-1">
              Interactive scoring visualization
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-500 rounded"></div>
              <span className="text-sm text-gray-600">Top Performer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span className="text-sm text-gray-600">Runner-up</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amber-600 rounded"></div>
              <span className="text-sm text-gray-600">Third Place</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-600">Other Funds</span>
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
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
                label={{ value: 'Movingto Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.rank)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-gray-700" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.max(...chartData.map(d => d.score))}
                </div>
                <div className="text-sm text-gray-600">Highest Score</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-gray-700" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {(chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">#</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {chartData.length}
                </div>
                <div className="text-sm text-gray-600">Total Funds</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexVisualization;
