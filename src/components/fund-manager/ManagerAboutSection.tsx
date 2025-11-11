import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from 'lucide-react';

interface ManagerAboutSectionProps {
  managerName: string;
  about: string;
}

const ManagerAboutSection: React.FC<ManagerAboutSectionProps> = ({ managerName, about }) => {
  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          About {managerName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-foreground">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {about}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerAboutSection;
