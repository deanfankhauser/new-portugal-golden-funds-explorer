import React from 'react';
import { Fund } from '../../data/types/funds';
import { Link } from 'react-router-dom';
import { findAlternativeFunds } from '../../data/services/alternative-funds-service';
import { useAllFunds } from '../../hooks/useFundsQuery';
import { addTagsToFunds } from '../../data/services/funds-service';
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Users, Building2, Tag } from 'lucide-react';
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';
import { useManagerProfile } from '../../hooks/useManagerProfile';

const AlternativeFundCard: React.FC<{ fund: Fund }> = ({ fund }) => {
  const managerProfile = useManagerProfile(fund.managerName);

  return (
    <article
      className="group relative bg-background border border-border/40 rounded-xl p-5 lg:p-8 transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:translate-y-[-2px]"
    >
      {/* Left accent border on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      {/* Card Header */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="flex-1">
          <h3 className="text-[22px] font-semibold text-foreground mb-3 leading-tight tracking-tight">
            {fund.name}
          </h3>
        </div>
        {fund.fundStatus === 'Open' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-success/10 text-success shrink-0">
            {fund.fundStatus}
          </span>
        )}
      </div>

      <p className="text-[15px] text-muted-foreground leading-relaxed mb-6">
        {fund.description}
      </p>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-5 bg-muted/20 rounded-lg mb-5">
        <div className="flex items-center gap-2.5">
          <Users className="h-[18px] w-[18px] text-accent shrink-0" strokeWidth={2} />
          <div className="flex-1">
            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Minimum</span>
            <span className="text-[15px] font-semibold text-foreground">
              {fund.minimumInvestment <= 0 ? "Contact" : `€${fund.minimumInvestment.toLocaleString()}`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex-1">
            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Target Return</span>
            <span className="text-[15px] font-semibold text-foreground">{fund.returnTarget}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Clock className="h-[18px] w-[18px] text-accent shrink-0" strokeWidth={2} />
          <div className="flex-1">
            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Duration</span>
            <span className="text-[15px] font-semibold text-foreground">{fund.term && fund.term > 0 ? `${fund.term} years` : 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Tag className="h-[18px] w-[18px] text-accent shrink-0" strokeWidth={2} />
          <div className="flex-1">
            <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Category</span>
            <span className="text-[15px] font-semibold text-foreground">{fund.category}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex justify-between items-center pt-5 border-t border-border">
        <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
          {managerProfile?.logo_url ? (
            <img 
              src={managerProfile.logo_url} 
              alt={`${fund.managerName} logo`}
              className="w-6 h-6 rounded object-cover border border-border/40"
            />
          ) : (
            <Building2 className="h-4 w-4 text-accent" strokeWidth={2} />
          )}
          <span>
            Managed by <span className="font-medium text-foreground">{fund.managerName}</span>
          </span>
        </div>
        <Link to={`/${fund.id}`} onClick={() => window.scrollTo(0, 0)}>
          <Button
            variant="outline"
            className="gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200 font-semibold h-12"
          >
            View Details
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </Button>
        </Link>
      </div>
    </article>
  );
};

interface AlternativeFundsProps {
  currentFund: Fund;
}

const AlternativeFunds: React.FC<AlternativeFundsProps> = ({ currentFund }) => {
  const { data: allFunds = [], isLoading } = useAllFunds();
  const fundsWithTags = addTagsToFunds(allFunds);
  const alternativeFunds = findAlternativeFunds(fundsWithTags, currentFund);

  if (isLoading || alternativeFunds.length === 0) {
    return null;
  }

  return (
    <section className="bg-background rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-6 py-8 lg:px-10 lg:py-10 bg-gradient-to-b from-muted/30 to-background border-b border-border/60">
        <h2 className="text-xl sm:text-2xl md:text-[28px] font-bold text-foreground tracking-tight font-heading mb-3">
          Alternative Fund Suggestions
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          If this fund is full or doesn't meet your requirements, here are similar options with comparable risk profiles and investment strategies.
        </p>
      </div>

      {/* Alternative Funds List */}
      <div className="p-6 lg:p-10 space-y-3 md:space-y-4">
        {alternativeFunds.map((fund) => (
          <AlternativeFundCard key={fund.id} fund={fund} />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-6 lg:px-10 lg:py-8 bg-muted/20 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-6">
        <Link
          to={`/${currentFund.id}/alternatives`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold text-[15px] transition-all hover:gap-3"
          aria-label={`View all alternative funds similar to ${currentFund.name}`}
        >
          View all {currentFund.name} alternatives
          <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2} />
        </Link>

          <Button
            size="lg"
            onClick={() => openExternalLink(buildContactUrl('alternatives'))}
            className="gap-2.5 shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-1px] font-semibold h-12"
          >
          <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Speak with Movingto
        </Button>
      </div>
    </section>
  );
};

export default AlternativeFunds;
