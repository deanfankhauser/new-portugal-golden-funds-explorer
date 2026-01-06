import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFooterBrowseLinks } from '../footer/hooks/useFooterBrowseLinks';

const TABS = [
  { id: 'funds', label: 'Funds' },
  { id: 'managers', label: 'Managers' },
  { id: 'categories', label: 'Categories' },
  { id: 'tools', label: 'Tools & Resources' },
] as const;

type TabId = typeof TABS[number]['id'];

const FUND_LINKS = [
  { href: '/', label: 'All Golden Visa funds' },
  { href: '/verified-funds', label: 'Verified funds' },
  { href: '/categories/venture-capital', label: 'Venture Capital funds' },
  { href: '/categories/private-equity', label: 'Private Equity funds' },
  { href: '/tags/low-risk', label: 'Low-risk funds' },
  { href: '/tags/capital-preservation', label: 'Capital preservation funds' },
  { href: '/ira-401k-eligible-funds', label: 'US IRA/401k eligible funds' },
  { href: '/tags/open-ended', label: 'Open-ended funds' },
  { href: '/tags/low-fees-1-management-fee', label: 'Low-fee funds' },
  { href: '/comparisons', label: 'Compare funds' },
];

const CATEGORY_LINKS = [
  { href: '/categories', label: 'All categories' },
  { href: '/tags', label: 'All fund tags' },
  { href: '/categories/private-equity', label: 'Private Equity' },
  { href: '/categories/venture-capital', label: 'Venture Capital' },
  { href: '/categories/debt', label: 'Debt funds' },
  { href: '/categories/clean-energy', label: 'Clean Energy funds' },
  { href: '/categories/crypto', label: 'Crypto funds' },
  { href: '/alternatives', label: 'Fund alternatives' },
];

const TOOL_LINKS = [
  { href: '/fund-matcher', label: 'Fund Matcher quiz' },
  { href: '/roi-calculator', label: 'ROI Calculator' },
  { href: '/fees', label: 'Fund fees guide' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/verification-program', label: 'Verification program' },
  { href: '/about', label: 'About Movingto Funds' },
  { href: 'https://www.movingto.com/tools/golden-visa-cost-calculator', label: 'Cost Calculator', external: true },
];

const BrowseDirectory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('funds');
  const { managerLinks } = useFooterBrowseLinks();

  const renderLink = (link: { href: string; label: string; external?: boolean }) => {
    if (link.external) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors inline-flex items-center gap-1"
        >
          {link.label}
          <ExternalLink size={12} />
        </a>
      );
    }

    return (
      <Link
        to={link.href}
        className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
      >
        {link.label}
      </Link>
    );
  };

  return (
    <section className="py-12 sm:py-16 bg-background border-t border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Tabs with underline style */}
        <div className="border-b border-border mb-8">
          <div 
            role="tablist" 
            className="flex gap-8 overflow-x-auto scrollbar-hide"
            aria-label="Browse sections"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`browse-panel-${tab.id}`}
                id={`browse-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-3 text-sm font-medium whitespace-nowrap transition-colors relative",
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab panels */}
        <div className="min-h-[160px]">
          {/* Funds Panel */}
          <div
            role="tabpanel"
            id="browse-panel-funds"
            aria-labelledby="browse-tab-funds"
            className={activeTab === 'funds' ? 'block' : 'hidden'}
          >
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
              {FUND_LINKS.map((link) => (
                <li key={link.href}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
            <Link 
              to="/" 
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-6 font-medium"
            >
              View all funds <ChevronRight size={14} />
            </Link>
          </div>

          {/* Managers Panel */}
          <div
            role="tabpanel"
            id="browse-panel-managers"
            aria-labelledby="browse-tab-managers"
            className={activeTab === 'managers' ? 'block' : 'hidden'}
          >
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
              <li>
                {renderLink({ href: '/managers', label: 'Fund manager directory' })}
              </li>
              {managerLinks.slice(0, 11).map((link) => (
                <li key={link.href}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
            <Link 
              to="/managers" 
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-6 font-medium"
            >
              View all managers <ChevronRight size={14} />
            </Link>
          </div>

          {/* Categories Panel */}
          <div
            role="tabpanel"
            id="browse-panel-categories"
            aria-labelledby="browse-tab-categories"
            className={activeTab === 'categories' ? 'block' : 'hidden'}
          >
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Panel */}
          <div
            role="tabpanel"
            id="browse-panel-tools"
            aria-labelledby="browse-tab-tools"
            className={activeTab === 'tools' ? 'block' : 'hidden'}
          >
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-3">
              {TOOL_LINKS.map((link) => (
                <li key={link.href}>
                  {renderLink(link)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Hidden links for SEO */}
        <div className="sr-only" aria-hidden="true">
          {FUND_LINKS.map((link) => (
            <Link key={`seo-funds-${link.href}`} to={link.href}>{link.label}</Link>
          ))}
          <Link to="/managers">Fund manager directory</Link>
          {managerLinks.map((link) => (
            <Link key={`seo-managers-${link.href}`} to={link.href}>{link.label}</Link>
          ))}
          {CATEGORY_LINKS.map((link) => (
            <Link key={`seo-categories-${link.href}`} to={link.href}>{link.label}</Link>
          ))}
          {TOOL_LINKS.filter(l => !l.external).map((link) => (
            <Link key={`seo-tools-${link.href}`} to={link.href}>{link.label}</Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrowseDirectory;
