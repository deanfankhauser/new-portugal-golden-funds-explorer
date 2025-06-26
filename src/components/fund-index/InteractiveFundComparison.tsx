
import React, { useState } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { GitCompare, Target, Zap } from 'lucide-react';

interface InteractiveFundComparisonProps {
  scores: FundScore[];
}

const InteractiveFundComparison: React.FC<InteractiveFundComparisonProps> = ({ scores }) => {
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'radar' | 'scatter'>('radar');

  const topFunds = scores.slice(0, 10);

  const handleFundSelection = (fundId: string) => {
    if (selectedFunds.includes(fundId)) {
      setSelectedFunds(selectedFunds.filter(id => id !== fundId));
    } else if (selectedFunds.length < 4) {
      setSelectedFunds([...selectedFunds, fundId]);
    }
  };

  const clearSelection = () => {
    setSelectedFunds([]);
  };

  const getRadarData = () => {
    const categories = ['Performance', 'Regulatory', 'Fees', 'Protection'];
    
    return categories.map(category => {
      const dataPoint: any = { category };
      
      selectedFunds.forEach(fundId => {
        const score = scores.find(s => s.fundId === fundId);
        const fund = getFundById(fundId);
        if (score && fund) {
          switch (category) {
            case 'Performance':
              dataPoint[fund.name.substring(0, 10)] = score.performanceScore;
              break;
            case 'Regulatory':
              dataPoint[fund.name.substring(0, 10)] = score.regulatoryScore;
              break;
            case 'Fees':
              dataPoint[fund.name.substring(0, 10)] = score.feeScore;
              break;
            case 'Protection':
              dataPoint[fund.name.substring(0, 10)] = score.protectionScore;
              break;
          }
        }
      });
      
      return dataPoint;
    });
  };

  const getScatterData = () => {
    return selectedFunds.map(fundId => {
      const score = scores.find(s => s.fundId === fundId);
      const fund = getFundById(fundId);
      if (score && fund) {
        return {
          x: fund.managementFee,
          y: score.movingtoScore,
          name: fund.name,
          minInvestment: fund.minimumInvestment,
          category: fund.category
        };
      }
      return null;
    }).filter(Boolean);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5 text-blue-500" />
          Interactive Fund Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fund Selection */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Select Funds to Compare (up to 4)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
            {topFunds.map((score) => {
              const fund = getFundById(score.fundId);
              if (!fund) return null;
              
              const isSelected = selectedFunds.includes(score.fundId);
              
              return (
                <Button
                  key={score.fundId}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFundSelection(score.fundId)}
                  disabled={!isSelected && selectedFunds.length >= 4}
                  className="text-xs p-2 h-auto"
                >
                  <div className="text-center">
                    <div className="font-semibold">{fund.name.substring(0, 15)}...</div>
                    <div className="text-xs opacity-75">Score: {score.movingtoScore}</div>
                  </div>
                </Button>
              );
            })}
          </div>
          
          {selectedFunds.length > 0 && (
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Selected: {selectedFunds.length}/4</span>
                {selectedFunds.map((fundId) => {
                  const fund = getFundById(fundId);
                  return (
                    <Badge key={fundId} variant="secondary" className="text-xs">
                      {fund?.name.substring(0, 12)}...
                    </Badge>
                  );
                })}
              </div>
              <Button onClick={clearSelection} variant="ghost" size="sm">
                Clear All
              </Button>
            </div>
          )}
        </div>

        {selectedFunds.length > 0 && (
          <>
            {/* Comparison Type Selector */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Comparison Type:</span>
              <Select value={comparisonType} onValueChange={(value: 'radar' | 'scatter') => setComparisonType(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="radar">
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3" />
                      Radar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="scatter">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3" />
                      Scatter Plot
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comparison Chart */}
            <div className="h-96">
              {comparisonType === 'radar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={getRadarData()}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Tooltip />
                    {selectedFunds.map((fundId, index) => {
                      const fund = getFundById(fundId);
                      return (
                        <Radar
                          key={fundId}
                          name={fund?.name.substring(0, 10) || 'Unknown'}
                          dataKey={fund?.name.substring(0, 10) || 'Unknown'}
                          stroke={COLORS[index % COLORS.length]}
                          fill={COLORS[index % COLORS.length]}
                          fillOpacity={0.1}
                          strokeWidth={2}
                        />
                      );
                    })}
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="x" 
                      type="number" 
                      name="Management Fee"
                      unit="%"
                      domain={['dataMin - 0.1', 'dataMax + 0.1']}
                    />
                    <YAxis 
                      dataKey="y" 
                      type="number" 
                      name="Movingto Score"
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip 
                      formatter={(value, name) => [
                        name === 'Management Fee' ? `${value}%` : value,
                        name
                      ]}
                      labelFormatter={() => ''}
                      content={({ payload }) => {
                        if (payload && payload.length > 0) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                              <p className="font-semibold">{data.name}</p>
                              <p className="text-sm">Management Fee: {data.x}%</p>
                              <p className="text-sm">Movingto Score: {data.y}</p>
                              <p className="text-sm">Min Investment: €{data.minInvestment?.toLocaleString()}</p>
                              <p className="text-sm">Category: {data.category}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {getScatterData().map((data, index) => (
                      <Scatter
                        key={index}
                        data={[data]}
                        fill={COLORS[index % COLORS.length]}
                        name={data?.name}
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Comparison Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold mb-2">Quick Comparison</h5>
                <div className="space-y-2">
                  {selectedFunds.map((fundId) => {
                    const score = scores.find(s => s.fundId === fundId);
                    const fund = getFundById(fundId);
                    if (!score || !fund) return null;
                    
                    return (
                      <div key={fundId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="font-medium text-sm">{fund.name.substring(0, 20)}...</span>
                        <div className="flex gap-2 text-xs">
                          <Badge variant="outline">Score: {score.movingtoScore}</Badge>
                          <Badge variant="outline">Fee: {fund.managementFee}%</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2">Key Insights</h5>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Radar chart shows scoring across all categories</p>
                  <p>• Scatter plot reveals fee vs performance relationship</p>
                  <p>• Compare up to 4 funds simultaneously</p>
                  <p>• Hover over charts for detailed information</p>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedFunds.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select funds from the top 10 to start comparing</p>
            <p className="text-sm">Choose up to 4 funds for detailed comparison</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveFundComparison;
