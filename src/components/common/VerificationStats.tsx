import React, { useMemo } from 'react';
import { CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Fund } from '@/data/funds';
import VerificationExplainerModal from './VerificationExplainerModal';

interface VerificationStatsProps {
  funds: Fund[];
  variant?: 'compact' | 'detailed';
  className?: string;
}

const VerificationStats: React.FC<VerificationStatsProps> = ({
  funds,
  variant = 'compact',
  className = ''
}) => {
  const stats = useMemo(() => {
    const total = funds.length;
    const verified = funds.filter(f => f.isVerified).length;
    const percentage = total > 0 ? Math.round((verified / total) * 100) : 0;
    
    // Recently verified (last 30 days)
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentlyVerified = funds.filter(f => {
      if (!f.verifiedAt) return false;
      const verifiedDate = new Date(f.verifiedAt);
      return verifiedDate >= thirtyDaysAgo;
    }).length;

    return { total, verified, percentage, recentlyVerified };
  }, [funds]);

  if (variant === 'compact') {
    return (
      <Card className={`bg-success/5 border-success/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-success" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    {stats.verified}
                  </span>
                  <span className="text-muted-foreground">of {stats.total}</span>
                </div>
                <p className="text-sm text-muted-foreground">Verified Funds</p>
              </div>
            </div>
            <Link to="/verification-program">
              <Button variant="ghost" size="sm" className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Learn More
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`grid md:grid-cols-3 gap-4 ${className}`}>
      <Card className="bg-success/5 border-success/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-success" />
            <h3 className="font-semibold text-sm text-muted-foreground">Verification Rate</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-foreground">{stats.percentage}%</span>
            <span className="text-sm text-muted-foreground">of funds</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {stats.verified} out of {stats.total} funds verified
          </p>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm text-muted-foreground">Total Verified</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-foreground">{stats.verified}</span>
            <span className="text-sm text-muted-foreground">funds</span>
          </div>
          <Link to="/verified-funds">
            <Button variant="link" className="h-auto p-0 text-sm">
              View all verified funds →
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm text-muted-foreground">Recently Verified</h3>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl font-bold text-foreground">{stats.recentlyVerified}</span>
            <span className="text-sm text-muted-foreground">funds</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Verified in the last 30 days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationStats;
