import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Linkedin, ArrowRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TeamMemberCardProps {
  name: string;
  role: string;
  bio?: string | null;
  photoUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
  slug?: string | null;
  fundRole?: string | null; // For fund-specific role override
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  role,
  bio,
  photoUrl,
  linkedinUrl,
  slug,
  fundRole
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const truncateBio = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    const truncated = text.slice(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
  };

  const displayRole = fundRole || role;
  const shouldTruncate = bio && bio.length > 150;

  return (
    <div className="group relative flex gap-3 sm:gap-4 items-start p-4 sm:p-6 bg-card border border-border/40 rounded-xl transition-all duration-200 hover:border-primary/20 hover:shadow-lg">
      {/* Left border accent on hover */}
      <div className="absolute left-0 top-4 sm:top-6 bottom-4 sm:bottom-6 w-[3px] rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-14 w-14 sm:h-[72px] sm:w-[72px] border-2 border-border transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/10">
          {photoUrl ? (
            <AvatarImage 
              src={photoUrl} 
              alt={`${name} profile picture`}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary text-lg sm:text-xl font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        {/* Online indicator - shows on hover */}
        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-primary rounded-full border-2 border-card opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Member Info */}
      <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {slug ? (
            <Link 
              to={`/team/${slug}`}
              className="text-base sm:text-xl font-semibold text-foreground tracking-tight leading-tight hover:text-primary transition-colors"
            >
              {name}
            </Link>
          ) : (
            <h3 className="text-base sm:text-xl font-semibold text-foreground tracking-tight leading-tight">
              {name}
            </h3>
          )}
          {fundRole && (
            <Badge variant="secondary" className="text-[11px] sm:text-xs">
              Fund-specific
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5 opacity-50" />
          {displayRole}
        </div>

        {bio && (
          <div className="pt-1">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isExpanded ? bio : truncateBio(bio)}
            </p>
            {shouldTruncate && !slug && (
              <Button
                variant="link"
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-0 h-auto font-normal text-primary hover:text-primary/80 mt-2 text-sm"
              >
                {isExpanded ? 'Read less' : 'Read more'}
              </Button>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-3">
          {slug && (
            <Link
              to={`/team/${slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
