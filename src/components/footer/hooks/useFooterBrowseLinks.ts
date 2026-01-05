import { useMemo } from 'react';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { getAllFundManagers } from '@/data/services/managers-service';
import { managerToSlug } from '@/lib/utils';

interface ManagerLink {
  href: string;
  label: string;
}

export function useFooterBrowseLinks() {
  const { funds } = useRealTimeFunds({});

  const managerLinks = useMemo<ManagerLink[]>(() => {
    if (!funds || funds.length === 0) {
      // Static fallback for SSR
      return [
        { href: '/manager/im-gestao-de-ativos', label: 'IM Gestão de Ativos' },
        { href: '/manager/insight-venture', label: 'Insight Venture' },
        { href: '/manager/big-capital-sgoic', label: 'BiG Capital SGOIC' },
        { href: '/manager/lince-capital', label: 'Lince Capital' },
        { href: '/manager/oxy-capital', label: 'Oxy Capital' },
        { href: '/manager/quadrantis-capital', label: 'Quadrantis Capital' },
        { href: '/manager/stag-fund-management', label: 'STAG Fund Management' },
      ];
    }

    const managers = getAllFundManagers(funds);
    
    // Sort by fund count descending, then alphabetically
    const sortedManagers = managers
      .filter(m => m.name && m.name.trim() !== '')
      .sort((a, b) => {
        if (b.fundsCount !== a.fundsCount) {
          return b.fundsCount - a.fundsCount;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 7); // Take top 7 managers

    return sortedManagers.map(manager => ({
      href: `/manager/${managerToSlug(manager.name)}`,
      label: manager.name,
    }));
  }, [funds]);

  return { managerLinks };
}
