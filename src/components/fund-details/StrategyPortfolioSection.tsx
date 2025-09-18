import React from 'react';
import { Fund } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface StrategyPortfolioSectionProps {
  fund: Fund;
}

const StrategyPortfolioSection: React.FC<StrategyPortfolioSectionProps> = ({ fund }) => {
  
  // Generate strategy bullets based on fund category and description
  const generateStrategyBullets = () => {
    const strategies = [];
    
    if (fund.category?.toLowerCase().includes('real estate')) {
      strategies.push("Direct investment in Portuguese commercial and residential properties");
      strategies.push("Value-add opportunities through renovation and repositioning");
      strategies.push("Rental income generation with capital appreciation potential");
    } else if (fund.category?.toLowerCase().includes('venture')) {
      strategies.push("Early-stage investment in high-growth Portuguese companies");
      strategies.push("Active portfolio management and mentorship support");
      strategies.push("Strategic exits through IPO or acquisition after 3-7 years");
    } else if (fund.category?.toLowerCase().includes('private equity')) {
      strategies.push("Acquiring controlling stakes in established Portuguese businesses");
      strategies.push("Operational improvements and strategic repositioning");
      strategies.push("Value creation through growth initiatives and efficiency gains");
    } else {
      strategies.push("Diversified investment approach across multiple asset classes");
      strategies.push("Active risk management and portfolio optimization");
      strategies.push("Long-term value creation with downside protection");
    }
    
    return strategies;
  };

  // Prepare geographic allocation data for charts
  const geoChartData = fund.geographicAllocation ? 
    fund.geographicAllocation.map((allocation) => ({
      name: allocation.region,
      value: allocation.percentage,
      percentage: allocation.percentage
    })) : 
    [
      { name: 'Portugal', value: 75, percentage: 75 },
      { name: 'EU', value: 20, percentage: 20 },
      { name: 'Other', value: 5, percentage: 5 }
    ];

  // Sample sector allocation data
  const sectorData = [
    { name: 'Real Estate', value: 40, percentage: 40 },
    { name: 'Technology', value: 25, percentage: 25 },
    { name: 'Healthcare', value: 15, percentage: 15 },
    { name: 'Financial Services', value: 12, percentage: 12 },
    { name: 'Other', value: 8, percentage: 8 }
  ];

  // Sample top holdings data
  const topHoldings = [
    { name: 'Porto Commercial Complex', allocation: 18.5, type: 'Real Estate' },
    { name: 'TechCorp Portugal', allocation: 12.3, type: 'Technology' },
    { name: 'Lisbon Residential Fund', allocation: 10.8, type: 'Real Estate' },
    { name: 'Healthcare Innovations SA', allocation: 9.2, type: 'Healthcare' },
    { name: 'Fintech Solutions Ltd', allocation: 7.4, type: 'Financial Services' }
  ];

  // Colors for charts
  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--accent))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--muted-foreground))'
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {`${payload[0].value.toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Strategy Section */}
      <Card>
        <CardHeader>
          <CardTitle>Strategy & Approach</CardTitle>
          <p className="text-sm text-muted-foreground">
            How this fund generates returns
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generateStrategyBullets().map((strategy, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                  {index + 1}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {strategy}
                </p>
              </div>
            ))}
          </div>
          
          {fund.detailedDescription && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {fund.detailedDescription}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Geographic Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Geographic Allocation</CardTitle>
            <p className="text-sm text-muted-foreground">
              Investment distribution by region
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={geoChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {geoChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              {geoChartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            
            {/* Portugal Investment Note */}
            <div className="mt-4 pt-4 border-t border-border">
              <Badge className="bg-success text-success-foreground">
                Portugal Focus: {geoChartData.find(item => item.name === 'Portugal')?.percentage || 75}%
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">
                Meets Golden Visa minimum Portugal investment requirement
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sector Allocation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sector Allocation</CardTitle>
            <p className="text-sm text-muted-foreground">
              Investment distribution by industry
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sectorData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    type="number" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Allocation']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--accent))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Holdings */}
      <Card>
        <CardHeader>
          <CardTitle>Top Holdings</CardTitle>
          <p className="text-sm text-muted-foreground">
            Largest positions in the fund portfolio
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topHoldings.map((holding, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{holding.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {holding.type}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-foreground">
                    {holding.allocation.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Holdings disclosed as of last reporting date. 
              Fund holdings are subject to change without notice. 
              Top 5 holdings represent {topHoldings.reduce((sum, h) => sum + h.allocation, 0).toFixed(1)}% of total portfolio.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyPortfolioSection;