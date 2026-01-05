import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const FundFiltersBar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilter = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams, { replace: true });
  };

  const isVerified = searchParams.get('verified') === 'true';
  const minInvestment = searchParams.get('minInvestment') || 'all';
  const risk = searchParams.get('risk') || 'all';
  const liquidity = searchParams.get('liquidity') || 'all';
  const category = searchParams.get('category') || 'all';

  return (
    <div className="bg-card border border-border/60 rounded-xl p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Verified Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <Checkbox
            checked={isVerified}
            onCheckedChange={(checked) => updateFilter('verified', checked ? 'true' : null)}
          />
          <span className="text-sm font-medium text-foreground">Verified only</span>
        </label>

        <div className="hidden sm:block w-px h-6 bg-border" />

        {/* Min Investment */}
        <Select value={minInvestment} onValueChange={(v) => updateFilter('minInvestment', v)}>
          <SelectTrigger className="w-[160px] h-9 text-sm bg-background">
            <SelectValue placeholder="Min Investment" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="all">Any investment</SelectItem>
            <SelectItem value="100-250">€100K – €250K</SelectItem>
            <SelectItem value="250-500">€250K – €500K</SelectItem>
            <SelectItem value="500+">€500K+</SelectItem>
          </SelectContent>
        </Select>

        {/* Risk Level */}
        <Select value={risk} onValueChange={(v) => updateFilter('risk', v)}>
          <SelectTrigger className="w-[140px] h-9 text-sm bg-background">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="all">Any risk</SelectItem>
            <SelectItem value="low">Low risk</SelectItem>
            <SelectItem value="medium">Medium risk</SelectItem>
            <SelectItem value="high">High risk</SelectItem>
          </SelectContent>
        </Select>

        {/* Term/Liquidity */}
        <Select value={liquidity} onValueChange={(v) => updateFilter('liquidity', v)}>
          <SelectTrigger className="w-[140px] h-9 text-sm bg-background">
            <SelectValue placeholder="Term" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="all">Any term</SelectItem>
            <SelectItem value="3-6">3–6 years</SelectItem>
            <SelectItem value="6-8">6–8 years</SelectItem>
            <SelectItem value="8-10">8–10 years</SelectItem>
          </SelectContent>
        </Select>

        {/* Strategy/Category */}
        <Select value={category} onValueChange={(v) => updateFilter('category', v)}>
          <SelectTrigger className="w-[160px] h-9 text-sm bg-background">
            <SelectValue placeholder="Strategy" />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="all">Any strategy</SelectItem>
            <SelectItem value="Real Estate">Real Estate</SelectItem>
            <SelectItem value="Private Equity">Private Equity</SelectItem>
            <SelectItem value="Venture Capital">Venture Capital</SelectItem>
            <SelectItem value="Fixed Income">Fixed Income</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FundFiltersBar;
