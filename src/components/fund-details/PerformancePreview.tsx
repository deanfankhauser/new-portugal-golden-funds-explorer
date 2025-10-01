import React from 'react';
import { Fund } from '../../data/funds';

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

  return (
    <div className="text-sm text-white/80 mb-4">
      <span className="font-medium">YTD: {ytd}</span>
      <span className="mx-2">|</span>
      <span className="font-medium">1Y: {oneYear}</span>
      <span className="mx-2">|</span>
      <span className="font-medium">Since inception: {sinceInception}</span>
    </div>
  );
};

export default PerformancePreview;
