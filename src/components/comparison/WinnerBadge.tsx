import React from 'react';
import { Check } from 'lucide-react';

const WinnerBadge: React.FC = () => {
  return (
    <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded bg-gradient-to-br from-success to-emerald-600 text-white">
      <Check className="w-2.5 h-2.5" />
      Best
    </span>
  );
};

export default WinnerBadge;
