import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { extractEducation } from '@/utils/bioParser';

interface TeamMemberCredentialsProps {
  role: string;
  companyName: string;
  companySlug?: string;
  linkedinUrl?: string;
  bio?: string;
}

export const TeamMemberCredentials: React.FC<TeamMemberCredentialsProps> = ({
  role,
  companyName,
  companySlug,
  linkedinUrl,
  bio
}) => {
  const education = bio ? extractEducation(bio) : null;

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6 space-y-4">
        {/* Current Role */}
        <div>
          <p className="text-sm text-muted-foreground mb-1">Current Role</p>
          <p className="font-medium text-foreground">{role}</p>
        </div>

        {/* LinkedIn Button */}
        {linkedinUrl && (
          <Button
            asChild
            className="w-full bg-[#0A66C2] hover:bg-[#004182] text-white"
          >
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Linkedin className="h-4 w-4" />
              View LinkedIn Profile
            </a>
          </Button>
        )}

        {/* Education */}
        {education && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Education</p>
            <div className="flex items-start gap-2">
              <span className="text-lg">🎓</span>
              <div className="flex-1">
                {education.degree && (
                  <p className="font-medium text-foreground">{education.degree}</p>
                )}
                {education.institution && (
                  <p className="text-sm text-muted-foreground">{education.institution}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Company Link */}
        {companySlug && (
          <div className="pt-2 border-t">
            <Link
              to={`/manager/${companySlug}`}
              className="flex items-center gap-2 text-primary hover:underline"
            >
              <Building2 className="h-4 w-4" />
              <span className="text-sm font-medium">{companyName}</span>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
