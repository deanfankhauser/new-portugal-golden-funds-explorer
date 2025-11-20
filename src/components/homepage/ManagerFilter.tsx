import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';

interface ManagerFilterProps {
  selectedManager: string | null;
  setSelectedManager: (manager: string | null) => void;
}

const ManagerFilter: React.FC<ManagerFilterProps> = ({
  selectedManager,
  setSelectedManager
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const { funds } = useRealTimeFunds();

  // Get unique managers with fund counts
  const managersMap = new Map<string, { name: string; count: number }>();
  funds.forEach(fund => {
    const managerKey = fund.managerName.toLowerCase();
    if (!managersMap.has(managerKey)) {
      managersMap.set(managerKey, {
        name: fund.managerName,
        count: 0,
      });
    }
    const manager = managersMap.get(managerKey)!;
    manager.count++;
  });

  const managers = Array.from(managersMap.values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 9); // Show first 9

  const handleManagerClick = (managerName: string) => {
    setSelectedManager(selectedManager === managerName ? null : managerName);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto hover:bg-muted"
        >
          <span className="font-semibold text-base">Filter by Manager</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2 pt-2">
        <div className="flex flex-wrap gap-2">
          {managers.map((manager) => {
            const isSelected = selectedManager === manager.name;
            
            return (
              <Button
                key={manager.name}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleManagerClick(manager.name)}
                className="text-left justify-start max-w-full break-words whitespace-normal h-auto py-2 min-h-[36px]"
              >
                <span className="break-words">{manager.name} ({manager.count})</span>
              </Button>
            );
          })}
        </div>

        <Link
          to="/managers"
          className="flex items-center gap-2 text-sm text-primary hover:underline pt-2"
        >
          See all managers
          <ArrowRight className="h-3 w-3" />
        </Link>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ManagerFilter;