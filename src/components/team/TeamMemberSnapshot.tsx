import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

export interface SnapshotItem {
  label: string;
  value: string;
  icon?: LucideIcon;
}

interface TeamMemberSnapshotProps {
  items: SnapshotItem[];
}

export const TeamMemberSnapshot: React.FC<TeamMemberSnapshotProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        At a Glance
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <Card key={index} className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {item.icon && (
                  <item.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
