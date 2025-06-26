
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { TrendingUp, Award, Target } from 'lucide-react';

interface IndexVisualizationProps {
  scores: FundScore[];
}

const IndexVisualization: React.FC<IndexVisualizationProps> = ({ scores }) => {
  const chartData = scores.slice(0, 8).map((score, index) => {
    const fund = getFundById(score.fundId);
    return {
      name: fund?.name.substring(0, 15) + (fund?.name.length > 15 ? '...' : '') || 'Unknown',
      fullName: fund?.name || 'Unknown',
      score: score.movingtoScore,
      rank: score.rank,
      performance: score.performanceScore,
      regulatory: score.regulatoryScore,
      fees: score.feeScore,
      protection: score.protectionScore,
      managementFee: fund?.managementFee || 0,
      minInvestment: fund?.minimumInvestment || 0,
      category: fund?.category || 'Unknown'
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-gray-900 mb-2">{data.fullName}</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-blue-600 font-bold">Rank #{data.rank}</span>
              <span className="text-blue-600 font-bold">Score: {data.score}/100</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
              <div>Performance: {data.performance}/100</div>
              <div>Regulatory: {data.regulatory}/100</div>
              <div>Fees: {data.fees}/100</div>
              <div>Protection: {data.protection}/100</div>
            </div>
            <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
              <div>Management Fee: {data.managementFee}%</div>
              <div>Min Investment: €{data.minInvestment?.toLocaleString()}</div>
              <div>Category: {data.category}</div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map(d => d.score));
    const dataMin = Math.min(...chartData.map(d => d.score));
    
    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;
    
    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Top 8 Fund Performance Analysis
        </CardTitle>
        <p className="text-sm text-gray-600">
          Comprehensive scoring breakdown showing how each fund performs across key criteria
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Combined Chart */}
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                <defs>
                  <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset={off} stopColor="#10B981" stopOpacity={1}/>
                    <stop offset={off} stopColor="#EF4444" stopOpacity={1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={11}
                  stroke="#666"
                />
                <YAxis 
                  yAxisId="left"
                  domain={[0, 100]}
                  label={{ value: 'Score', angle: -90, position: 'insideLeft' }}
                  stroke="#666"
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 5]}
                  label={{ value: 'Fee %', angle: 90, position: 'insideRight' }}
                  stroke="#666"
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Score bars with gradient */}
                <Bar 
                  yAxisId="left"
                  dataKey="score" 
                  fill="url(#splitColor)"
                  radius={[4, 4, 0, 0]}
                  name="Movingto Score"
                />
                
                {/* Management fee line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="managementFee"
                  stroke="#EF4444"
                  strokeWidth={3}
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  name="Management Fee"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Performance Breakdown */}
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Score Component Breakdown
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    fontSize={11}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value, name) => [value, name]}
                    labelFormatter={(label) => {
                      const fund = chartData.find(d => d.name === label);
                      return fund?.fullName || label;
                    }}
                  />
                  <Bar dataKey="performance" stackId="a" fill="#10B981" name="Performance" />
                  <Bar dataKey="regulatory" stackId="a" fill="#3B82F6" name="Regulatory" />
                  <Bar dataKey="fees" stackId="a" fill="#F59E0B" name="Fee Score" />
                  <Bar dataKey="protection" stackId="a" fill="#8B5CF6" name="Protection" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Key Insights
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium mb-1">Top Performer:</p>
                <p className="text-gray-600">{chartData[0]?.fullName} with {chartData[0]?.score}/100 score</p>
              </div>
              <div>
                <p className="font-medium mb-1">Average Score:</p>
                <p className="text-gray-600">{Math.round(chartData.reduce((sum, d) => sum + d.score, 0) / chartData.length)}/100</p>
              </div>
              <div>
                <p className="font-medium mb-1">Best Performance Category:</p>
                <p className="text-gray-600">
                  {chartData.sort((a, b) => b.performance - a.performance)[0]?.fullName} 
                  ({chartData.sort((a, b) => b.performance - a.performance)[0]?.performance}/100)
                </p>
              </div>
              <div>
                <p className="font-medium mb-1">Lowest Fees:</p>
                <p className="text-gray-600">
                  {chartData.sort((a, b) => a.managementFee - b.managementFee)[0]?.fullName} 
                  ({chartData.sort((a, b) => a.managementFee - b.managementFee)[0]?.managementFee}%)
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IndexVisualization;
