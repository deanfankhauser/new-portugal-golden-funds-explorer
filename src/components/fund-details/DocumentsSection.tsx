import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { PdfDocument } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';

interface DocumentsSectionProps {
  documents?: PdfDocument[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-2xl font-bold text-foreground">Documents</h2>
        </div>
        <div className="flex flex-col space-y-4">
          <p className="text-muted-foreground">
            We have {documents.length} document{documents.length > 1 ? 's' : ''} available for this fund. 
            To receive PDF copies, please click the button below.
          </p>
          <Button 
            onClick={() => openExternalLink(buildContactUrl('documents-section'))}
            className="w-full sm:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            Request PDFs
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;