import React from 'react';
import { Fund } from '../../data/types/funds';
import { DateManagementService } from '../../services/dateManagementService';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Calendar, Database, TrendingUp, AlertTriangle } from 'lucide-react';

interface DataFreshnessDashboardProps {
  funds: Fund[];
  className?: string;
}

export const DataFreshnessDashboard: React.FC<DataFreshnessDashboardProps> = ({
  funds,
  className = ''
}) => {
  const calculateFreshnessStats = () => {
    let veryFresh = 0; // <= 7 days
    let fresh = 0; // 8-30 days
    let stale = 0; // > 30 days

    funds.forEach(fund => {
      const contentDates = DateManagementService.getFundContentDates(fund);
      const age = DateManagementService.getContentAge(contentDates.dataLastVerified);
      
      if (age <= 7) veryFresh++;
      else if (age <= 30) fresh++;
      else stale++;
    });

    return { veryFresh, fresh, stale, total: funds.length };
  };

  const stats = calculateFreshnessStats();
  const freshPercentage = Math.round(((stats.veryFresh + stats.fresh) / stats.total) * 100);

  // Get most recent update
  const mostRecentUpdate = funds.reduce((latest, fund) => {
    const contentDates = DateManagementService.getFundContentDates(fund);
    const fundDate = new Date(contentDates.dataLastVerified);
    return !latest || fundDate > latest ? fundDate : latest;
  }, null as Date | null);

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Database className="h-5 w-5" />
          Data Freshness Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{stats.veryFresh}</div>
            <div className="text-xs text-green-700">Very Fresh</div>
            <div className="text-xs text-muted-foreground">≤ 7 days</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.fresh}</div>
            <div className="text-xs text-yellow-700">Fresh</div>
            <div className="text-xs text-muted-foreground">8-30 days</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{stats.stale}</div>
            <div className="text-xs text-red-700">Needs Review</div>
            <div className="text-xs text-muted-foreground">&gt; 30 days</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-blue-700">Total Funds</div>
            <div className="text-xs text-muted-foreground">in database</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Data Health</span>
            <span className="font-medium text-blue-700">{freshPercentage}% Fresh</span>
          </div>
          <Progress value={freshPercentage} className="h-2" />
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-blue-200">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Last database update:</span>
          </div>
          {mostRecentUpdate && (
            <time dateTime={mostRecentUpdate.toISOString()}>
              {DateManagementService.formatDisplayDate(mostRecentUpdate.toISOString())}
            </time>
          )}
        </div>

        {stats.stale > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                {stats.stale} fund{stats.stale !== 1 ? 's' : ''} need{stats.stale === 1 ? 's' : ''} data verification
              </span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Please verify data against official sources for funds older than 30 days.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataFreshnessDashboard;