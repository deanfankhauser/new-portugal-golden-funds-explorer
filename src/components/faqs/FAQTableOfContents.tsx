import React from 'react';

interface TOCItem {
  id: string;
  label: string;
}

const tocItems: TOCItem[] = [
  { id: 'eligibility', label: 'Eligibility & Fund Rules' },
  { id: 'fees', label: 'Fees & Costs' },
  { id: 'process', label: 'Process & Timeline' },
  { id: 'family', label: 'Family Members' },
  { id: 'exit', label: 'Holding & Exit' },
  { id: 'citizenship', label: 'Citizenship' },
  { id: 'us-persons', label: 'US Persons' },
  { id: 'compare', label: 'Due Diligence' },
];

const FAQTableOfContents = () => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL without triggering navigation
      window.history.pushState(null, '', `#${id}`);
    }
  };

  return (
    <nav className="bg-card border border-border rounded-xl p-6 sticky top-24" aria-label="FAQ Topics">
      <h2 className="text-lg font-semibold text-foreground mb-4">Topics</h2>
      <ul className="space-y-2">
        {tocItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              className="text-muted-foreground hover:text-primary transition-colors text-sm block py-1"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default FAQTableOfContents;
