import React from 'react';
import { Link } from 'react-router-dom';

interface LinkItem {
  href: string;
  label: string;
}

interface LinkColumn {
  title: string;
  links: LinkItem[];
}

const LINK_COLUMNS: LinkColumn[] = [
  {
    title: 'Funds',
    links: [
      { href: '/', label: 'Browse All Funds' },
      { href: '/verified-funds', label: 'Verified Funds' },
      { href: '/best-portugal-golden-visa-funds', label: 'Best Funds 2026' },
      { href: '/funds/us-citizens', label: 'US Citizen Funds' },
      { href: '/managers', label: 'Fund Managers' },
    ]
  },
  {
    title: 'Categories',
    links: [
      { href: '/categories/private-equity', label: 'Private Equity' },
      { href: '/categories/venture-capital', label: 'Venture Capital' },
      { href: '/categories/clean-energy', label: 'Clean Energy' },
      { href: '/categories/debt-funds', label: 'Debt Funds' },
    ]
  }
];

const ResourceLinkGrid: React.FC = () => {
  return (
    <section className="py-10 sm:py-12 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <h2 className="text-lg font-semibold text-foreground mb-8 text-center">
            Explore More
          </h2>

          {/* Link Grid */}
          <div className="grid grid-cols-2 gap-12 max-w-md">
            {LINK_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link 
                        to={link.href}
                        className="text-sm text-foreground/80 hover:text-primary hover:underline transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourceLinkGrid;
