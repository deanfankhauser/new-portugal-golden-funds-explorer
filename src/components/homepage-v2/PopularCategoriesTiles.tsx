import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, TrendingDown, Shield, Clock, Leaf, Layers, Building, Rocket } from 'lucide-react';

const categories = [
  {
    title: 'Verified funds',
    description: 'Funds that passed our verification checks',
    href: '/verified-funds',
    icon: ShieldCheck,
  },
  {
    title: 'Lower fees',
    description: 'Funds with below-average management fees',
    href: '/tags/low-fees',
    icon: TrendingDown,
  },
  {
    title: 'Lower risk',
    description: 'Conservative investment strategies',
    href: '/tags/low-risk',
    icon: Shield,
  },
  {
    title: 'Short lock-up',
    description: 'Lock-ups under 5 years',
    href: '/tags/short-lock-up-less-than-5-years',
    icon: Clock,
  },
  {
    title: 'ESG & Sustainability',
    description: 'Environmentally focused funds',
    href: '/tags/esg',
    icon: Leaf,
  },
  {
    title: 'Debt',
    description: 'Fixed income strategies',
    href: '/categories/debt',
    icon: Layers,
  },
  {
    title: 'Private equity',
    description: 'PE-focused funds',
    href: '/categories/private-equity',
    icon: Building,
  },
  {
    title: 'Venture capital',
    description: 'VC-focused funds',
    href: '/categories/venture-capital',
    icon: Rocket,
  },
];

const PopularCategoriesTiles: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
          Popular categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={category.href}
                to={category.href}
                className="group bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularCategoriesTiles;
