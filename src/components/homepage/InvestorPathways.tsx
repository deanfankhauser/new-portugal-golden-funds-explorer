import React from 'react';
import { Shield, TrendingUp, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PathwayCard {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  filterAction: () => void;
}

const InvestorPathways: React.FC = () => {
  const navigate = useNavigate();

  const pathways: PathwayCard[] = [
    {
      icon: Shield,
      title: 'Conservative Strategy',
      subtitle: 'Capital preservation & Real Estate backed.',
      filterAction: () => {
        navigate('/?category=Real+Estate&tag=Low-risk');
        setTimeout(() => {
          const fundsSection = document.getElementById('funds-section');
          if (fundsSection) {
            fundsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    },
    {
      icon: TrendingUp,
      title: 'Growth Strategy',
      subtitle: 'Private Equity & VC with higher upside.',
      filterAction: () => {
        navigate('/?category=Private+Equity&tag=High-risk');
        setTimeout(() => {
          const fundsSection = document.getElementById('funds-section');
          if (fundsSection) {
            fundsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    },
    {
      icon: Shield,
      title: 'Verified & Trusted',
      subtitle: 'CMVM-verified funds with proven track records.',
      filterAction: () => {
        navigate('/?verified=true');
        setTimeout(() => {
          const fundsSection = document.getElementById('funds-section');
          if (fundsSection) {
            fundsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-background">
      <div className="max-w-7xl mx-auto container-responsive-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pathways.map((pathway, index) => {
            const IconComponent = pathway.icon;
            return (
              <button
                key={index}
                onClick={pathway.filterAction}
                className="bg-card border border-border rounded-xl p-8 shadow-sm hover:shadow-lg hover:border-accent/30 transition-all duration-300 text-left group"
              >
                <div className="flex flex-col items-start gap-4">
                  <div className="p-3 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-high-contrast mb-2 group-hover:text-accent transition-colors">
                      {pathway.title}
                    </h3>
                    <p className="text-medium-contrast text-sm leading-relaxed">
                      {pathway.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InvestorPathways;
