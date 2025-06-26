
import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TrendingUp, PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react';

interface FundPerformanceDashboardProps {
  scores: FundScore[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const FundPerformanceDashboard: React.FC<FundPerformanceDashboardProps> = ({ scores }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Prepare data for different visualizations
  const categoryData = scores.reduce((acc, score) => {
    const fund = getFundById(score.fundId);
    if (!fund) return acc;
    
    const existing = acc.find(item => item.name === fund.category);
    if (existing) {
      existing.value += 1;
      existing.totalScore += score.movingtoScore;
    } else {
      acc.push({
        name: fund.category,
        value: 1,
        totalScore: score.movingtoScore,
        avgScore: score.movingtoScore
      });
    }
    return acc;
  }, [] as Array<{ name: string; value: number; totalScore: number; avgScore: number }>);

  // Calculate average scores
  categoryData.forEach(item => {
    item.avgScore = Math.round(item.totalScore / item.value);
  });

  const feeDistributionData = scores.map(score => {
    const fund = getFundById(score.fundId);
    return {
      name: fund?.name.substring(0, 15) + '...' || 'Unknown',
      fullName: fund?.name || 'Unknown',
      fee: fund?.managementFee || 0,
      score: score.movingtoScore,
      minInvestment: fund?.minimumInvestment || 0
    };
  }).sort((a, b) => b.score - a.score).slice(0, 10);

  const scoreDistributionData = [
    { range: '90-100', count: scores.filter(s => s.movingtoScore >= 90).length },
    { range: '80-89', count: scores.filter(s => s.movingtoScore >= 80 && s.movingtoScore < 90).length },
    { range: '70-79', count: scores.filter(s => s.movingtoScore >= 70 && s.movingtoScore < 80).length },
    { range: '60-69', count: scores.filter(s => s.movingtoScore >= 60 && s.movingtoScore < 70).length },
    { range: '50-59', count: scores.filter(s => s.movingtoScore >= 50 && s.movingtoScore < 60).length },
    { range: '0-49', count: scores.filter(s => s.movingtoScore < 50).length }
  ];

  const performanceBreakdownData = scores.slice(0, 8).map(score => {
    const fund = getFundById(score.fundId);
    return {
      name: fund?.name.substring(0, 12) + '...' || 'Unknown',
      fullName: fund?.name || 'Unknown',
      performance: score.performanceScore,
      regulatory: score.regulatoryScore,
      fees: score.feeScore,
      protection: score.protectionScore,
      total: score.movingtoScore
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          Fund Performance Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1">
              <PieChartIcon className="h-3 w-3" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="fees" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Fee Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">Score Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scoreDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">Category Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold mb-3">Average Scores by Category</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="avgScore" 
                      stroke="#3B82F6" 
                      fill="#3B82F6" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold mb-3">Top 8 Funds - Score Breakdown</h4>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceBreakdownData} margin={{ bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      fontSize={12}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                      formatter={(value, name) => [value, name]}
                      labelFormatter={(label) => {
                        const fund = performanceBreakdownData.find(d => d.name === label);
                        return fund?.fullName || label;
                      }}
                    />
                    <Bar dataKey="performance" stackId="a" fill="#10B981" name="Performance" />
                    <Bar dataKey="regulatory" stackId="a" fill="#3B82F6" name="Regulatory" />
                    <Bar dataKey="fees" stackId="a" fill="#F59E0B" name="Fees" />
                    <Bar dataKey="protection" stackId="a" fill="#EF4444" name="Protection" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fees" className="space-y-4">
            <div>
              <h4 className="text-lg font-semibold mb-3">Management Fees vs Performance (Top 10)</h4>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={feeDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      fontSize={12}
                    />
                    <YAxis yAxisId="left" orientation="left" domain={[0, 'dataMax + 10']} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'Management Fee' ? `${value}%` : value,
                        name
                      ]}
                      labelFormatter={(label) => {
                        const fund = feeDistributionData.find(d => d.name === label);
                        return fund?.fullName || label;
                      }}
                    />
                    <Bar yAxisId="left" dataKey="score" fill="#3B82F6" name="Movingto Score" />
                    <Line yAxisId="right" type="monotone" dataKey="fee" stroke="#EF4444" strokeWidth={3} name="Management Fee" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FundPerformanceDashboard;
