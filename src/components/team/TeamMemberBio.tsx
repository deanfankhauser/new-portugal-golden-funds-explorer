import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';

interface TeamMemberBioProps {
  bio?: string;
  highlights?: string[];
}

export const TeamMemberBio: React.FC<TeamMemberBioProps> = ({ bio, highlights }) => {
  if (!bio && (!highlights || highlights.length === 0)) return null;

  return (
    <section className="py-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {bio && (
            <p className="text-muted-foreground leading-relaxed">
              {bio}
            </p>
          )}
          {highlights && highlights.length > 0 && (
            <div className="pt-2">
              <p className="text-sm font-medium text-foreground mb-2">Highlights</p>
              <ul className="space-y-1.5">
                {highlights.map((highlight, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
