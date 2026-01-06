import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TeamMemberAvatar } from '@/components/shared/TeamMemberAvatar';
import { ExternalLink, Linkedin, MapPin, Globe, Mail } from 'lucide-react';

interface TeamMemberHeroProps {
  name: string;
  role: string;
  photoUrl?: string;
  fundName: string;
  fundSlug: string;
  contactUrl?: string;
  contactEmail?: string;
  linkedinUrl?: string;
  location?: string;
  languages?: string[];
}

export const TeamMemberHero: React.FC<TeamMemberHeroProps> = ({
  name,
  role,
  photoUrl,
  fundName,
  fundSlug,
  contactUrl,
  contactEmail,
  linkedinUrl,
  location,
  languages
}) => {
  const handleContactClick = () => {
    if (contactUrl) {
      window.open(contactUrl, '_blank', 'noopener,noreferrer');
    } else if (contactEmail) {
      window.location.href = `mailto:${contactEmail}`;
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start">
        {/* Avatar */}
        <div className="shrink-0">
          <TeamMemberAvatar
            photoUrl={photoUrl}
            name={name}
            size="xl"
            className="ring-4 ring-background shadow-lg"
          />
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          {/* Name and Role */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
              {name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {role} at{' '}
              <Link 
                to={`/funds/${fundSlug}`}
                className="text-primary hover:underline"
              >
                {fundName}
              </Link>
            </p>
          </div>

          {/* Location and Languages */}
          {(location || (languages && languages.length > 0)) && (
            <div className="flex flex-wrap items-center gap-3">
              {location && (
                <Badge variant="secondary" className="gap-1.5">
                  <MapPin className="h-3 w-3" />
                  {location}
                </Badge>
              )}
              {languages && languages.length > 0 && (
                <Badge variant="secondary" className="gap-1.5">
                  <Globe className="h-3 w-3" />
                  {languages.join(', ')}
                </Badge>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild>
              <Link to={`/funds/${fundSlug}`}>
                View Fund Profile
              </Link>
            </Button>
            {(contactUrl || contactEmail) && (
              <Button variant="outline" onClick={handleContactClick}>
                <Mail className="h-4 w-4 mr-2" />
                Contact Fund
              </Button>
            )}
          </div>

          {/* External Links */}
          {linkedinUrl && (
            <div className="flex items-center gap-4 pt-2">
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn Profile
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
