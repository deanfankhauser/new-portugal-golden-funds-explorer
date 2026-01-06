import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Linkedin, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { extractEducation } from '@/utils/bioParser';

interface TeamMemberCredentialsProps {
  role: string;
  companyName: string;
  companySlug?: string;
  companyLogoUrl?: string;
  linkedinUrl?: string;
  bio?: string;
  education?: string;
  certifications?: string[];
}

export const TeamMemberCredentials: React.FC<TeamMemberCredentialsProps> = ({
  role,
  companyName,
  companySlug,
  companyLogoUrl,
  linkedinUrl,
  bio,
  education,
  certifications
}) => {
  // Use explicit education field if available, otherwise try to extract from bio
  const parsedEducation = bio ? extractEducation(bio) : null;
  const displayEducation = education || (parsedEducation ? `${parsedEducation.degree || ''} ${parsedEducation.institution ? `at ${parsedEducation.institution}` : ''}`.trim() : null);

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
        {displayEducation && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Education</p>
            <div className="flex items-start gap-2">
              <span className="text-lg">🎓</span>
              <p className="font-medium text-foreground">{displayEducation}</p>
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div>
            <p className="text-sm text-muted-foreground mb-1">Certifications</p>
            <ul className="space-y-1">
              {certifications.map((cert, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Award className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm font-medium text-foreground">{cert}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Company Link */}
        {companySlug && (
          <div className="pt-2 border-t">
            <Link
              to={`/manager/${companySlug}`}
              className="flex items-center gap-2 text-primary hover:underline"
            >
              {companyLogoUrl ? (
                <img 
                  src={companyLogoUrl} 
                  alt="" 
                  className="h-5 w-5 object-contain rounded"
                />
              ) : (
                <Building2 className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">{companyName}</span>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
