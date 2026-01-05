import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFooterBrowseLinks } from './hooks/useFooterBrowseLinks';

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
  { href: '/faqs', label: 'FAQs' },
  { href: '/verification-program', label: 'Verification program' },
  { href: '/about', label: 'About Movingto Funds' },
  { href: 'https://www.movingto.com/tools/golden-visa-cost-calculator', label: 'Cost Calculator', external: true },
];

interface FooterBrowseSitemapProps {
  className?: string;
}

const FooterBrowseSitemap: React.FC<FooterBrowseSitemapProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<TabId>('funds');
  const { managerLinks } = useFooterBrowseLinks();

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'footer_browse_tab_click', { tab_name: tabId });
    }
  };

  const handleLinkClick = (tabName: string, href: string, linkText: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'footer_browse_link_click', { 
        tab_name: tabName, 
        href, 
        link_text: linkText 
      });
    }
  };

  const renderLink = (link: { href: string; label: string; external?: boolean }, tabName: string) => {
    if (link.external) {
      return (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-accent transition-colors inline-flex items-center gap-1"
          data-analytics-tab={tabName}
          data-analytics-href={link.href}
          onClick={() => handleLinkClick(tabName, link.href, link.label)}
        >
          {link.label}
          <ExternalLink size={12} />
        </a>
      );
    }

    return (
      <Link
        to={link.href}
        className="text-sm text-muted-foreground hover:text-accent transition-colors"
        data-analytics-tab={tabName}
        data-analytics-href={link.href}
        onClick={() => handleLinkClick(tabName, link.href, link.label)}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <section 
      className={cn("border-t border-border pt-8 pb-4", className)}
      aria-label="Browse funds, managers, and categories"
    >
      <p className="text-sm text-muted-foreground mb-4">
        Browse funds, managers, and categories.
      </p>

      {/* Tab buttons */}
      <div 
        role="tablist" 
        className="flex gap-1 overflow-x-auto pb-2 mb-4 scrollbar-hide"
        aria-label="Browse sections"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
            data-analytics-tab={tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels - ALL rendered for SEO, visibility controlled by CSS */}
      <div className="max-h-[200px] overflow-y-auto">
        {/* Funds Panel */}
        <div
          role="tabpanel"
          id="panel-funds"
          aria-labelledby="tab-funds"
          className={activeTab === 'funds' ? 'block' : 'hidden'}
          // aria-hidden kept false so crawlers index all links
        >
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
            {FUND_LINKS.map((link) => (
              <li key={link.href}>
                {renderLink(link, 'funds')}
              </li>
            ))}
          </ul>
          <Link 
            to="/" 
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 mt-3 font-medium"
            onClick={() => handleLinkClick('funds', '/', 'View all funds')}
          >
            View all funds <ChevronRight size={14} />
          </Link>
        </div>

        {/* Managers Panel */}
        <div
          role="tabpanel"
          id="panel-managers"
          aria-labelledby="tab-managers"
          className={activeTab === 'managers' ? 'block' : 'hidden'}
        >
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
            <li>
              {renderLink({ href: '/managers', label: 'Fund manager directory' }, 'managers')}
            </li>
            {managerLinks.map((link) => (
              <li key={link.href}>
                {renderLink(link, 'managers')}
              </li>
            ))}
          </ul>
          <Link 
            to="/managers" 
            className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 mt-3 font-medium"
            onClick={() => handleLinkClick('managers', '/managers', 'View all managers')}
          >
            View all managers <ChevronRight size={14} />
          </Link>
        </div>

        {/* Categories Panel */}
        <div
          role="tabpanel"
          id="panel-categories"
          aria-labelledby="tab-categories"
          className={activeTab === 'categories' ? 'block' : 'hidden'}
        >
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
            {CATEGORY_LINKS.map((link) => (
              <li key={link.href}>
                {renderLink(link, 'categories')}
              </li>
            ))}
          </ul>
        </div>

        {/* Tools Panel */}
        <div
          role="tabpanel"
          id="panel-tools"
          aria-labelledby="tab-tools"
          className={activeTab === 'tools' ? 'block' : 'hidden'}
        >
          <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
            {TOOL_LINKS.map((link) => (
              <li key={link.href}>
                {renderLink(link, 'tools')}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Hidden links for SEO - ensures all tab content is in DOM even when hidden */}
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
    </section>
  );
};

export default FooterBrowseSitemap;
