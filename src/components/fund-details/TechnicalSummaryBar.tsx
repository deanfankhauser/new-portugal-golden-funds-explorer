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
    if (lower === 'open' || lower === 'active') return 'text-success';
    if (lower === 'closed' || lower === 'fully subscribed') return 'text-destructive';
    return 'text-warning';
  };

  const cmvmStatus = fund.cmvmId ? 'CMVM Registered' : fund.regulatedBy || 'Unregistered';

  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono bg-slate-900 text-slate-100 px-3 py-2 rounded-md">
        {fund.isin && (
          <span className="text-slate-400">
            ISIN: <span className="text-slate-100">{fund.isin}</span>
          </span>
        )}
        {fund.cmvmId && (
          <span className="text-slate-400">
            CMVM: <span className="text-slate-100">{fund.cmvmId}</span>
          </span>
        )}
        <span className="text-slate-400">
          Min: <span className="text-slate-100">{formatCurrencyValue(fund.minimumInvestment || 0)}</span>
        </span>
        <span className="text-slate-400">
          Mgmt: <span className="text-slate-100">{formatFee(fund.managementFee)}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 divide-x divide-slate-700">
        {/* ISIN/ID */}
        <div className="px-4 py-3 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
            {fund.isin ? 'ISIN' : 'Fund ID'}
          </span>
          <span className="font-mono text-sm text-slate-100 block truncate">
            {fund.isin || fund.cmvmId || fund.id.slice(0, 12)}
          </span>
        </div>

        {/* CMVM Status */}
        <div className="px-4 py-3 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
            Regulatory Status
          </span>
          <span className={`font-mono text-sm block ${fund.cmvmId ? 'text-gold-verified' : 'text-slate-300'}`}>
            {cmvmStatus}
          </span>
        </div>

        {/* Minimum Investment */}
        <div className="px-4 py-3 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
            Min. Investment
          </span>
          <span className="font-mono text-sm text-slate-100 block">
            {formatCurrencyValue(fund.minimumInvestment || 0)}
          </span>
        </div>

        {/* Management Fee */}
        <div className="px-4 py-3 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
            Management Fee
          </span>
          <span className="font-mono text-sm text-slate-100 block">
            {formatFee(fund.managementFee)}
          </span>
        </div>

        {/* Performance Fee */}
        <div className="px-4 py-3 space-y-1 hidden lg:block">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
            Performance Fee
          </span>
          <span className="font-mono text-sm text-slate-100 block">
            {formatFee(fund.performanceFee)}
          </span>
        </div>

        {/* Fund Status */}
        <div className="px-4 py-3 space-y-1 hidden lg:block">
          <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
            Status
          </span>
          <span className={`font-mono text-sm block ${getStatusColor(fund.fundStatus)}`}>
            {fund.fundStatus || 'Open'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TechnicalSummaryBar;
