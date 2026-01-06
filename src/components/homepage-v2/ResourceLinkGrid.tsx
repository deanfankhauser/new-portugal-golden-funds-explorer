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
  },
  {
    title: 'Tools',
    links: [
      { href: '/fund-matcher', label: 'Fund Matcher' },
      { href: '/roi-calculator', label: 'ROI Calculator' },
      { href: '/compare', label: 'Compare Tool' },
      { href: '/verification-program', label: 'Verification Program' },
      { href: '/fees', label: 'Fees Guide' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { href: '/about', label: 'About' },
      { href: '/faqs', label: 'FAQs' },
      { href: '/terms', label: 'Terms' },
      { href: '/cookie-policy', label: 'Cookie Policy' },
    ]
  }
];

const ResourceLinkGrid: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <h2 className="text-xl font-semibold text-foreground mb-8 text-center">
            Explore More
          </h2>

          {/* Link Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {LINK_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                  {column.title}
                </h3>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link 
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
