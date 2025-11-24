import React from 'react';
import { Fund } from '../../data/types/funds';

interface PerformancePreviewProps {
  fund: Fund;
}

const PerformancePreview: React.FC<PerformancePreviewProps> = ({ fund }) => {
  // Extract performance data from historicalPerformance
  const getPerformanceMetric = (key: 'ytd' | '1y' | 'sinceInception'): string => {
    if (!fund.historicalPerformance || Object.keys(fund.historicalPerformance).length === 0) {
      return '—';
    }

    const years = Object.keys(fund.historicalPerformance).sort((a, b) => parseInt(b) - parseInt(a));
    
    // For YTD: find the most recent entry in current year
    if (key === 'ytd') {
      const currentYear = new Date().getFullYear().toString();
      const ytdData = fund.historicalPerformance[currentYear];
      if (ytdData?.returns !== undefined) {
        return `${ytdData.returns > 0 ? '+' : ''}${ytdData.returns.toFixed(1)}%`;
      }
      return '—';
    }

    // For 1Y: calculate return from last year
    if (key === '1y') {
      if (years.length > 0) {
        const lastYear = years[0];
        const lastYearData = fund.historicalPerformance[lastYear];
        if (lastYearData?.returns !== undefined) {
          return `${lastYearData.returns > 0 ? '+' : ''}${lastYearData.returns.toFixed(1)}%`;
        }
      }
      return '—';
    }

    // For Since Inception: use expectedReturnMin or parse returnTarget
    if (key === 'sinceInception') {
      if (fund.expectedReturnMin !== undefined) {
        return `${fund.expectedReturnMin > 0 ? '+' : ''}${fund.expectedReturnMin.toFixed(1)}%`;
      }
      if (fund.returnTarget) {
        const match = fund.returnTarget.match(/(\d+\.?\d*)/);
        if (match) {
          const value = parseFloat(match[1]);
          return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
        }
      }
      return '—';
    }

    return '—';
  };

  const ytd = getPerformanceMetric('ytd');
  const oneYear = getPerformanceMetric('1y');
  const sinceInception = getPerformanceMetric('sinceInception');

  // Only show if at least one metric is available
  const hasPerformance = ytd !== '—' || oneYear !== '—' || sinceInception !== '—';

  if (!hasPerformance) return null;

  const getValueClassName = (value: string) => {
    if (value === '—') return 'text-muted-foreground';
    return value.startsWith('+') ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';
  };

  return (
    <div className="bg-gradient-to-br from-green-500/5 to-green-500/[0.02] border border-green-500/15 rounded-xl p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">YTD</div>
          <div className={`text-sm font-bold tracking-tight ${getValueClassName(ytd)}`}>
            {ytd}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">1 Year</div>
          <div className={`text-sm font-bold tracking-tight ${getValueClassName(oneYear)}`}>
            {oneYear}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Since Inception</div>
          <div className={`text-sm font-bold tracking-tight ${getValueClassName(sinceInception)}`}>
            {sinceInception}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePreview;
