
import React from 'react';
import { FileText } from 'lucide-react';
import { PdfDocument } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface DocumentsSectionProps {
  documents?: PdfDocument[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  const handleRequestPDFs = () => {
    // Show success toast when button is clicked
    toast({
      title: "Request Received",
      description: "We'll get in touch with you about the fund documents soon.",
    });
  };

  return (
    <Card className="border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-5 h-5 mr-2 text-[#EF4444]" />
          <h2 className="text-2xl font-bold">Documents</h2>
        </div>
        <div className="flex flex-col space-y-4">
          <p className="text-gray-600">
            We have {documents.length} document{documents.length > 1 ? 's' : ''} available for this fund. 
            To receive PDF copies, please click the button below.
          </p>
          <Button 
            onClick={handleRequestPDFs}
            className="w-full sm:w-auto"
          >
            <FileText className="mr-2 h-4 w-4" />
            Request PDFs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
