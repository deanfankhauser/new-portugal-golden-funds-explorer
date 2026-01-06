import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, CheckCircle2, ArrowRight, Scale } from 'lucide-react';
import type { Fund } from '@/data/types/funds';
import { formatCurrencyValue } from '@/utils/currencyFormatters';
interface ConnectedFundCardProps {
  fund: Fund;
}

export const ConnectedFundCard: React.FC<ConnectedFundCardProps> = ({ fund }) => {
  const fundSlug = fund.id;

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        Connected Fund
      </h2>
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  <Link 
                    to={`/funds/${fundSlug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {fund.name}
                  </Link>
                </CardTitle>
                {fund.isVerified && (
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                    Verified
                  </Badge>
                )}
              </div>
              {fund.category && (
                <p className="text-sm text-muted-foreground">{fund.category}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {/* Fund Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {fund.minimumInvestment && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Min. Investment
                </p>
                <p className="text-sm font-medium">
                  {formatCurrencyValue(fund.minimumInvestment)}
                </p>
              </div>
            )}
            {(fund.expectedReturnMin || fund.expectedReturnMax) && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Target Return
                </p>
                <p className="text-sm font-medium">
                  {fund.expectedReturnMin && fund.expectedReturnMax 
                    ? `${fund.expectedReturnMin}% – ${fund.expectedReturnMax}%`
                    : fund.expectedReturnMin 
                      ? `${fund.expectedReturnMin}%+`
                      : `Up to ${fund.expectedReturnMax}%`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2 border-t">
            <Button asChild className="flex-1">
              <Link to={`/funds/${fundSlug}`}>
                View Fund
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/funds">
                <Scale className="h-4 w-4 mr-2" />
                Compare Funds
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
