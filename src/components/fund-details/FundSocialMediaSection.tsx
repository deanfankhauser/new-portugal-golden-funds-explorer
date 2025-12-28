import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Youtube, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';

interface FundSocialMediaSectionProps {
  youtubeUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
}

// Custom TikTok icon since Lucide doesn't have one
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const FundSocialMediaSection: React.FC<FundSocialMediaSectionProps> = ({
  youtubeUrl,
  instagramUrl,
  tiktokUrl,
  facebookUrl,
  twitterUrl,
  linkedinUrl,
}) => {
  const socialLinks = [
    { url: youtubeUrl, label: 'YouTube', icon: Youtube, color: 'hover:text-red-600' },
    { url: instagramUrl, label: 'Instagram', icon: Instagram, color: 'hover:text-pink-600' },
    { url: tiktokUrl, label: 'TikTok', icon: TikTokIcon, color: 'hover:text-foreground' },
    { url: facebookUrl, label: 'Facebook', icon: Facebook, color: 'hover:text-blue-600' },
    { url: twitterUrl, label: 'X (Twitter)', icon: Twitter, color: 'hover:text-foreground' },
    { url: linkedinUrl, label: 'LinkedIn', icon: Linkedin, color: 'hover:text-blue-700' },
  ].filter(link => link.url);

  // Don't render if no social links are available
  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Follow Us</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          {socialLinks.map(({ url, label, icon: Icon, color }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              asChild
              className={`gap-2 ${color} transition-colors`}
            >
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${label} page`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FundSocialMediaSection;
