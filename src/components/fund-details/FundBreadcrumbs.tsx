import React from 'react';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Home, ChevronRight } from 'lucide-react';
import { Fund } from '../../data/types/funds';
import { URL_CONFIG } from '../../utils/urlConfig';

interface FundBreadcrumbsProps {
  fund: Fund;
}

const FundBreadcrumbs: React.FC<FundBreadcrumbsProps> = ({ fund }) => {
  // Get primary category from fund tags
  const getPrimaryCategory = (fund: Fund) => {
    const categoryTags = fund.tags.filter(tag => 
      ['Real Estate', 'Tech', 'Healthcare & life sciences', 'Energy', 'Infrastructure', 'Tourism'].includes(tag)
    );
    return categoryTags[0] || null;
  };

  const primaryCategory = getPrimaryCategory(fund);

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Browse Funds</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {primaryCategory && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/categories">Categories</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        
        <BreadcrumbSeparator>
          <ChevronRight className="h-4 w-4" />
        </BreadcrumbSeparator>
        
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">{fund.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default FundBreadcrumbs;