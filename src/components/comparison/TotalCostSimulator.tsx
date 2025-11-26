import React from 'react';
import { Fund } from '@/data/types/funds';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TotalCostSimulatorProps {
  fund1: Fund;
  fund2: Fund;
}

const TotalCostSimulator: React.FC<TotalCostSimulatorProps> = ({ fund1, fund2 }) => {
  const investmentAmount = 500000; // €500,000
  const years = 6;
  
  // Calculate total costs
  const calculateTotalCost = (fund: Fund): number => {
    const mgmtFee = fund.managementFee || 0;
    const subFee = fund.subscriptionFee || 0;
    
    // Management fee compounded over 6 years + one-time subscription fee
    const mgmtCost = (mgmtFee / 100) * investmentAmount * years;
    const subCost = (subFee / 100) * investmentAmount;
    
    return mgmtCost + subCost;
  };
  
  const cost1 = calculateTotalCost(fund1);
  const cost2 = calculateTotalCost(fund2);
  
  const data = [
    {
      name: fund1.name.length > 20 ? fund1.name.substring(0, 20) + '...' : fund1.name,
      cost: cost1,
      fullName: fund1.name
    },
    {
      name: fund2.name.length > 20 ? fund2.name.substring(0, 20) + '...' : fund2.name,
      cost: cost2,
      fullName: fund2.name
    }
  ];
  
  const formatCurrency = (value: number) => {
    return `€${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };
  
  // Determine which fund has lower cost for coloring
  const lowerCostFund = cost1 <= cost2 ? 0 : 1;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Estimated Fees on €500,000 Investment (6 Years)</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Total cost includes management fees over 6 years plus subscription fees
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis 
              type="number" 
              tickFormatter={formatCurrency}
              className="text-muted-foreground"
            />
            <YAxis 
              type="category" 
              dataKey="name" 
              width={90}
              className="text-sm text-muted-foreground"
            />
            <Tooltip 
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload;
                return item?.fullName || label;
              }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px'
              }}
            />
            <Bar dataKey="cost" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === lowerCostFund ? 'hsl(var(--success))' : 'hsl(var(--accent))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">{fund1.name}</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(cost1)}</p>
            {lowerCostFund === 0 && (
              <p className="text-xs text-success mt-1 font-semibold">Lower Cost</p>
            )}
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">{fund2.name}</p>
            <p className="text-2xl font-bold text-foreground">{formatCurrency(cost2)}</p>
            {lowerCostFund === 1 && (
              <p className="text-xs text-success mt-1 font-semibold">Lower Cost</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalCostSimulator;
