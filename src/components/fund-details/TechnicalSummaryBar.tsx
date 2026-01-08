import React from 'react';
import { Fund } from '@/data/types/funds';
import { formatCurrencyValue } from '@/utils/currencyFormatters';

interface TechnicalSummaryBarProps {
  fund: Fund;
  variant?: 'compact' | 'full';
}

const TechnicalSummaryBar: React.FC<TechnicalSummaryBarProps> = ({ fund, variant = 'full' }) => {
  const formatFee = (fee: number | undefined) => {
    if (fee === undefined || fee === null) return '—';
    return `${fee}%`;
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return 'text-muted-foreground';
    const lower = status.toLowerCase();
    if (lower === 'open' || lower === 'active') return 'text-emerald-600';
    if (lower === 'closed' || lower === 'fully subscribed') return 'text-destructive';
    return 'text-amber-600';
  };

  const cmvmStatus = fund.cmvmId ? 'CMVM Registered' : fund.regulatedBy || 'Unregistered';

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs font-mono bg-muted/50 border border-border text-foreground px-4 py-2.5 rounded-lg">
        {fund.isin && (
          <span className="text-muted-foreground">
            ISIN: <span className="text-foreground font-medium">{fund.isin}</span>
          </span>
        )}
        {fund.cmvmId && (
          <span className="text-muted-foreground">
            CMVM: <span className="text-foreground font-medium">{fund.cmvmId}</span>
          </span>
        )}
        <span className="text-muted-foreground">
          Min: <span className="text-foreground font-medium">{formatCurrencyValue(fund.minimumInvestment || 0)}</span>
        </span>
        <span className="text-muted-foreground">
          Mgmt: <span className="text-foreground font-medium">{formatFee(fund.managementFee)}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 border border-border rounded-xl overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {/* ISIN/ID */}
        <div className="px-5 py-4 border-b lg:border-b-0 lg:border-r border-border">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            {fund.isin ? 'ISIN' : 'Fund ID'}
          </span>
          <span className="font-mono text-sm text-foreground font-medium block truncate">
            {fund.isin || fund.cmvmId || fund.id.slice(0, 12)}
          </span>
        </div>

        {/* CMVM Status */}
        <div className="px-5 py-4 border-b lg:border-b-0 lg:border-r border-border">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            Regulatory Status
          </span>
          <span className={`font-mono text-sm font-medium block ${fund.cmvmId ? 'text-primary' : 'text-muted-foreground'}`}>
            {cmvmStatus}
          </span>
        </div>

        {/* Minimum Investment */}
        <div className="px-5 py-4 border-b md:border-b-0 lg:border-r border-border">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            Min. Investment
          </span>
          <span className="font-mono text-sm text-foreground font-medium block">
            {formatCurrencyValue(fund.minimumInvestment || 0)}
          </span>
        </div>

        {/* Management Fee */}
        <div className="px-5 py-4 lg:border-r border-border">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            Management Fee
          </span>
          <span className="font-mono text-sm text-foreground font-medium block">
            {formatFee(fund.managementFee)}
          </span>
        </div>

        {/* Performance Fee */}
        <div className="px-5 py-4 hidden lg:block lg:border-r border-border">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            Performance Fee
          </span>
          <span className="font-mono text-sm text-foreground font-medium block">
            {formatFee(fund.performanceFee)}
          </span>
        </div>

        {/* Fund Status */}
        <div className="px-5 py-4 hidden lg:block">
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium block mb-1">
            Status
          </span>
          <span className={`font-mono text-sm font-medium block ${getStatusColor(fund.fundStatus)}`}>
            {fund.fundStatus || 'Open'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSummaryBar;
