import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Linkedin } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';

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
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const displayRole = fundRole || role;

  return (
    <div className="group relative flex gap-4 items-start p-6 bg-muted/20 border border-border/40 rounded-xl transition-all duration-200 hover:bg-muted/30 hover:border-primary/20 hover:shadow-lg">
      {/* Left border accent on hover */}
      <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <Avatar className="h-[72px] w-[72px] border-2 border-border transition-all duration-200 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/10">
          {photoUrl ? (
            <AvatarImage 
              src={photoUrl} 
              alt={`${name} profile picture`}
              className="object-cover"
            />
          ) : null}
          <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        {/* Online indicator - shows on hover */}
        <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-card opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      </div>

      {/* Member Info */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {slug ? (
            <Link 
              to={`/team/${slug}`}
              className="text-xl font-semibold text-foreground tracking-tight leading-tight hover:text-primary transition-colors"
            >
              {name}
            </Link>
          ) : (
            <h3 className="text-xl font-semibold text-foreground tracking-tight leading-tight">
              {name}
            </h3>
          )}
          {fundRole && (
            <Badge variant="secondary" className="text-xs">
              Fund-specific
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5 opacity-50" />
          {displayRole}
        </div>

        {bio && (
          <p className="text-sm text-muted-foreground leading-relaxed pt-1">
            {bio}
          </p>
        )}

        {/* Actions */}
        {linkedinUrl && (
          <div className="pt-3">
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-transparent border border-border/50 rounded-md text-[13px] font-medium text-[#0077b5] hover:bg-[#0077b5]/8 hover:border-[#0077b5]/30 transition-all duration-150"
            >
              <Linkedin className="h-3.5 w-3.5" />
              LinkedIn
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;
