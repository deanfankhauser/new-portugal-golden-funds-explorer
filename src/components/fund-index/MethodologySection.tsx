
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, Shield, DollarSign, Users } from 'lucide-react';

const MethodologySection: React.FC = () => {
  // Remove component-level schema injection - ConsolidatedSEOService handles page-level schemas

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50" itemScope itemType="https://schema.org/HowTo">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900" itemProp="name">
          Our Ranking Methodology
        </CardTitle>
        <p className="text-gray-600 mt-2" itemProp="description">
          Our comprehensive methodology for evaluating and ranking Golden Visa investment funds
        </p>
        <meta itemProp="totalTime" content="P30D" />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content={new Date().toISOString()} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="bg-accent/10 p-6 rounded-xl border border-accent/20"
            itemScope 
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-accent/20 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground" itemProp="name">Performance (40%)</h3>
                <span className="text-sm text-accent font-medium">Highest Weight</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed" itemProp="text">
              Evaluates fund performance metrics including returns, volatility, and consistency over time. 
              We analyze historical performance, risk-adjusted returns, and benchmark comparisons.
            </p>
            <meta itemProp="position" content="1" />
          </div>

          <div 
            className="bg-success/10 p-6 rounded-xl border border-success/20"
            itemScope 
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-success/20 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground" itemProp="name">Regulatory Quality (25%)</h3>
                <span className="text-sm text-success font-medium">Second Priority</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed" itemProp="text">
              Reviews regulatory compliance, licensing, and oversight by Portuguese authorities. 
              Includes assessment of fund registration, compliance history, and regulatory standing.
            </p>
            <meta itemProp="position" content="2" />
          </div>

          <div 
            className="bg-warning/10 p-6 rounded-xl border border-warning/20"
            itemScope 
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-warning/20 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground" itemProp="name">Fee Structure (20%)</h3>
                <span className="text-sm text-warning font-medium">Cost Efficiency</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed" itemProp="text">
              Analyzes management fees, performance fees, and other costs to determine value for investors. 
              Compares fee structures across similar funds and assesses cost-effectiveness.
            </p>
            <meta itemProp="position" content="3" />
          </div>

          <div 
            className="bg-primary/10 p-6 rounded-xl border border-primary/20"
            itemScope 
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/20 p-2 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground" itemProp="name">Investor Protection (15%)</h3>
                <span className="text-sm text-primary font-medium">Safety Focus</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed" itemProp="text">
              Evaluates investor protection measures, transparency, and fund governance structures. 
              Reviews reporting standards, investor communication, and conflict of interest policies.
            </p>
            <meta itemProp="position" content="4" />
          </div>
        </div>

        <div className="bg-muted p-6 rounded-xl border border-border" itemScope itemType="https://schema.org/PropertyValue">
          <h4 className="font-semibold text-foreground mb-3" itemProp="name">Scoring System</h4>
          <div className="space-y-2 text-sm text-muted-foreground" itemProp="value">
            <div className="flex justify-between">
              <span>Excellent (85-100):</span>
              <span className="font-medium text-success">Top-tier funds with outstanding metrics</span>
            </div>
            <div className="flex justify-between">
              <span>Very Good (70-84):</span>
              <span className="font-medium text-accent">Strong funds with solid performance</span>
            </div>
            <div className="flex justify-between">
              <span>Good (55-69):</span>
              <span className="font-medium text-warning">Acceptable funds with room for improvement</span>
            </div>
            <div className="flex justify-between">
              <span>Fair (Below 55):</span>
              <span className="font-medium text-destructive">Funds requiring careful consideration</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground pt-4 border-t border-border">
          <p itemProp="disclaimer">
            Methodology updated regularly to reflect market changes and regulatory updates. 
            Scores are based on publicly available information and professional analysis.
          </p>
          <meta itemProp="license" content="https://creativecommons.org/licenses/by/4.0/" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologySection;
