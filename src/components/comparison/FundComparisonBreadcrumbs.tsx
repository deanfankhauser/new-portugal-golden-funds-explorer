import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/types/funds';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface FundComparisonBreadcrumbsProps {
  fund1: Fund;
  fund2: Fund;
}

const FundComparisonBreadcrumbs: React.FC<FundComparisonBreadcrumbsProps> = ({ fund1, fund2 }) => {
  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/comparisons">Comparisons Hub</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{fund1.name} vs {fund2.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default FundComparisonBreadcrumbs;