import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  FolderOpen, 
  User, 
  Tag,
  TrendingUp,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { SearchResult } from '@/hooks/useGlobalSearch';
import { CompanyLogo } from './shared/CompanyLogo';

interface Props {
  results: SearchResult[];
  isSearching: boolean;
  onResultClick: () => void;
  selectedIndex: number;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'fund': return Building2;
    case 'category': return FolderOpen;
    case 'manager': return User;
    case 'tag': return Tag;
    default: return Building2;
  }
};

export const GlobalSearchDropdown: React.FC<Props> = ({
  results,
  isSearching,
  onResultClick,
  selectedIndex
}) => {
  if (isSearching) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-xl border border-border p-4 z-[9999]">
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Searching...</span>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  // Group results by type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  const typeLabels = {
    fund: 'Funds',
    category: 'Categories',
    manager: 'Managers',
    tag: 'Tags'
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-lg shadow-xl border border-border max-h-[70vh] md:max-h-[500px] overflow-y-auto z-[9999]">
      {Object.entries(groupedResults).map(([type, items]) => (
        <div key={type} className="border-b border-border last:border-b-0">
          <div className="px-4 py-2 text-xs font-semibold text-muted-foreground bg-muted/50">
            {typeLabels[type as keyof typeof typeLabels]}
          </div>
          {items.map((result) => {
            const Icon = getIcon(result.type);
            const globalIndex = results.indexOf(result);
            const isSelected = globalIndex === selectedIndex;
            
            return (
              <Link
                key={result.id}
                to={result.url}
                onClick={onResultClick}
                className={`
                  flex items-center gap-3 px-3 md:px-4 py-3 md:py-3.5 transition-colors cursor-pointer border-l-2
                  ${isSelected 
                    ? 'bg-primary/10 border-primary text-foreground' 
                    : 'border-transparent hover:bg-muted/50 active:bg-muted'
                  }
                `}
              >
                {(result.type === 'fund' && result.metadata?.managerName) || result.type === 'manager' ? (
                  <CompanyLogo 
                    managerName={result.type === 'fund' ? result.metadata.managerName : result.name} 
                    size="xs" 
                  />
                ) : (
                  <div className="h-10 w-10 md:h-10 md:w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="font-medium text-foreground truncate flex items-center gap-2 flex-wrap">
                    {result.name}
                    {result.type === 'fund' && result.metadata?.isVerified && (
                      <Link to="/verification-program" onClick={(e) => e.stopPropagation()} className="hover:opacity-80 transition-opacity">
                        <span className="bg-success text-success-foreground px-2 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          VERIFIED
                        </span>
                      </Link>
                    )}
                  </div>
                  {result.subtitle && (
                    <div className="text-sm text-muted-foreground truncate">
                      {result.subtitle}
                    </div>
                  )}
                  {result.type === 'fund' && result.metadata?.returnTarget && 
                   result.metadata.returnTarget !== 'Unspecified' && 
                   result.metadata.returnTarget !== 'Not disclosed' && 
                   result.metadata.returnTarget !== 'N/A' && (
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Target: {result.metadata.returnTarget}
                    </div>
                  )}
                </div>

                {result.type === 'fund' && (
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
};
