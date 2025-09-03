
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { findAlternativeFunds } from '../../data/services/alternative-funds-service';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Clock, Users } from 'lucide-react';
import { buildContactUrl } from '../../utils/urlHelpers';

interface AlternativeFundsProps {
  currentFund: Fund;
}

const AlternativeFunds: React.FC<AlternativeFundsProps> = ({ currentFund }) => {
  const alternativeFunds = findAlternativeFunds(currentFund);

  if (alternativeFunds.length === 0) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-success/20 text-success-foreground border-success/30';
      case 'Closing Soon':
        return 'bg-warning/20 text-warning-foreground border-warning/30';
      case 'Closed':
        return 'bg-destructive/20 text-destructive-foreground border-destructive/30';
      default:
        return 'bg-muted/20 text-muted-foreground border-muted/30';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-foreground">
          <TrendingUp className="w-5 h-5 text-accent" />
          Alternative Fund Suggestions
        </CardTitle>
        <p className="text-muted-foreground">
          If this fund is full or doesn't meet your requirements, here are similar options:
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {alternativeFunds.map((fund) => (
            <div key={fund.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{fund.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{fund.description}</p>
                </div>
                <Badge className={`ml-3 ${getStatusColor(fund.fundStatus)}`}>
                  {fund.fundStatus}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Min: {fund.minimumInvestment <= 0 ? "Not provided" : formatCurrency(fund.minimumInvestment)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{fund.returnTarget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{fund.term} years</span>
                </div>
                <div className="text-muted-foreground">
                  {fund.category}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Managed by {fund.managerName}
                </span>
                <Link to={`/${fund.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between items-center">
              <Link 
                to={`/${currentFund.id}/alternatives`}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium"
                aria-label={`View all alternative funds similar to ${currentFund.name}`}
              >
                View all {currentFund.name} alternatives
                <ArrowRight className="w-4 h-4" />
              </Link>
             
             <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
               <a 
                 href={buildContactUrl('alternatives')}
                 target="_blank" 
                 rel="noopener noreferrer"
               >
                 Get Expert Guidance
               </a>
             </Button>
           </div>
         </div>
      </CardContent>
    </Card>
  );
};

export default AlternativeFunds;
