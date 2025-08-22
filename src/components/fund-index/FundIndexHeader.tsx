
import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

const FundIndexHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-background to-secondary border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          {/* Enhanced badge with better styling */}
          <div className="inline-flex items-center bg-gradient-to-r from-primary/10 to-accent/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8 border border-primary/20 shadow-sm">
            <div className="w-2 h-2 bg-primary rounded-full mr-2 animate-pulse"></div>
            2025 Fund Rankings
          </div>

          {/* Improved title with better typography */}
          <h1 className="text-5xl md:text-6xl font-bold mb-8 text-foreground leading-tight tracking-tight">
            Portugal Golden Visa Investment
            <span className="block text-primary mt-2">Fund Index</span>
          </h1>
          
          <h2 className="text-xl md:text-2xl text-muted-foreground mb-16 leading-relaxed max-w-3xl mx-auto font-light">
            Comprehensive Analysis of Portugal Golden Visa Investment Funds
          </h2>

          {/* Enhanced metrics with better visual design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="group">
              <div className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:border-primary">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-foreground mb-1">11+</div>
                    <div className="text-sm font-medium text-muted-foreground">Verified Funds</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Comprehensive analysis & verification
                </div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-card p-8 rounded-2xl shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:border-accent">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="p-4 bg-gradient-to-br from-success/10 to-success/20 rounded-xl group-hover:from-success/20 group-hover:to-success/30 transition-colors">
                    <BarChart3 className="w-6 h-6 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="text-3xl font-bold text-foreground mb-1">€500M+</div>
                    <div className="text-sm font-medium text-muted-foreground">Total AUM</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground text-center">
                  Combined assets under management
                </div>
              </div>
            </div>
          </div>

          {/* Added trust indicators */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>Updated Monthly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Regulatory Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Independent Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundIndexHeader;
