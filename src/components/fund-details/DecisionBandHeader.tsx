import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { CheckCircle2 } from 'lucide-react';
import { Fund } from '../../data/types/funds';


interface DecisionBandHeaderProps {
  fund: Fund;
}

const DecisionBandHeader: React.FC<DecisionBandHeaderProps> = ({ fund }) => {
  const isOpenForSubscriptions = fund.fundStatus === 'Open';

  // Helper function to generate keyword-rich subheader using ONLY structured data fields
  // This ensures the auto-generated text cannot contradict structured data
  const generateSubheader = () => {
    const fundType = fund.isVerified && fund.tags?.includes('Golden Visa Eligible')
      ? 'investment fund marketed for the Portugal Golden Visa route'
      : 'CMVM-regulated investment fund';
    
    const parts: string[] = [
      `${fund.name} is a ${fundType} managed by ${fund.managerName}, investing`
    ];

    // Add investment focus based on category
    if (fund.category) {
      const categoryLower = fund.category.toLowerCase();
      
      // Add "primarily in" or "in" based on context
      if (categoryLower.includes('mixed') || categoryLower.includes('multi')) {
        parts.push(`in ${categoryLower}`);
      } else {
        parts.push(`primarily in ${categoryLower}`);
      }
    }

    // IMPORTANT: Use ONLY redemptionTerms structured data for liquidity claims
    // Never use tags to generate liquidity statements - this prevents contradictions
    const redemptionFrequency = fund.redemptionTerms?.frequency?.toLowerCase();
    const holdingPeriod = fund.redemptionTerms?.minimumHoldingPeriod;
    
    if (redemptionFrequency === 'daily' || redemptionFrequency === 'continuous trading') {
      parts.push('with daily liquidity for investors');
    } else if (redemptionFrequency === 'weekly') {
      parts.push('with weekly redemption opportunities');
    } else if (redemptionFrequency === 'monthly') {
      parts.push('with monthly redemption opportunities');
    } else if (redemptionFrequency === 'quarterly') {
      parts.push('with quarterly redemption opportunities');
    } else if (holdingPeriod && holdingPeriod > 0) {
      parts.push(`with ${holdingPeriod}-month minimum holding period`);
    } else if (fund.redemptionTerms?.frequency) {
      const freq = fund.redemptionTerms.frequency.toLowerCase();
      if (freq !== 'not available' && freq !== 'end of term') {
        parts.push(`with ${freq} redemption opportunities`);
      } else {
        parts.push('with long-term investment horizon');
      }
    }

    return parts.join(' ') + '.';
  };

  // Helper function to bold percentages and key investment terms in description
  const formatDescription = (text: string) => {
    let formatted = text;
    
    // For unverified funds, strip Golden Visa mentions from description
    if (!fund.isVerified) {
      formatted = formatted
        .replace(/Portugal Golden Visa[–-]eligible\s*/gi, '')
        .replace(/Golden Visa[–-]eligible\s*/gi, '')
        .replace(/Golden Visa eligible\s*/gi, '')
        .replace(/Golden Visa\s*/gi, '')
        .trim();
    }
    
    // Bold percentages (e.g., "65%", "35%")
    formatted = formatted.replace(/(\d+%)/g, '<strong>$1</strong>');
    
    // Bold key investment terms
    const termsToHighlight = [
      'Portuguese fixed income',
      'digital assets',
      'real estate',
      'private equity',
      'venture capital',
      'public markets',
      'fixed income',
      'equities'
    ];
    
    termsToHighlight.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      formatted = formatted.replace(regex, '<strong>$1</strong>');
    });
    
    // Add discrete Golden Visa links if fund is GV eligible and verified
    if (fund.tags?.includes('Golden Visa Eligible') && fund.isVerified) {
      // Link "Golden Visa" text to eligibility requirements
      formatted = formatted.replace(
        /Golden Visa/gi,
        '<a href="https://movingto.com/pt/portugal-golden-visa" target="_blank" rel="noopener noreferrer" class="text-accent hover:text-accent/80 underline decoration-1 underline-offset-2">Golden Visa</a>'
      );
    }
    
    return formatted;
  };

  return (
    <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-8 md:p-10">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 space-y-6">
          {/* Badges */}
          <div className="flex items-center gap-3 flex-wrap">
            {fund.isVerified && (
              <Link to="/verification-program" className="inline-block hover:opacity-80 transition-opacity">
                <div className="bg-success/10 text-success px-4 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-2 border border-success/20">
                  <CheckCircle2 className="w-4 h-4" />
                  Verified Fund
                </div>
              </Link>
            )}
            {isOpenForSubscriptions && (
              <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[13px] font-semibold border border-primary/20">
                Open for subscriptions
              </div>
            )}
            {!fund.isVerified && (
              <Badge variant="outline" className="text-[13px] font-medium px-4 py-2 rounded-xl">
                Unverified
              </Badge>
            )}
          </div>
          
          {/* Fund Name */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
            {fund.name}
          </h1>
          
          {/* Dynamic keyword-rich subheader */}
          <p className="text-xl font-semibold text-foreground/80 leading-relaxed">
            {generateSubheader()}
          </p>
          
          {/* Description with bold key terms */}
          <p 
            className="text-lg text-foreground/70 max-w-3xl leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatDescription(fund.description) }}
          />
        </div>
        
        {/* Edit actions removed on public profile */}
      </div>
    </div>
  );
};

export default DecisionBandHeader;
