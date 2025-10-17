import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Sparkles } from 'lucide-react';
import { Fund } from '../../data/funds';
import { isRecentlyUpdated } from '../../utils/dateHelpers';

interface RecentlyUpdatedBadgeProps {
  fund: Fund;
}

const RecentlyUpdatedBadge: React.FC<RecentlyUpdatedBadgeProps> = ({ fund }) => {
  if (!isRecentlyUpdated(fund.updatedAt)) {
    return null;
  }

  return (
    <Badge variant="success" className="text-sm font-medium">
      <Sparkles className="w-4 h-4 mr-1" />
      Recently Updated
    </Badge>
  );
};

export default RecentlyUpdatedBadge;
