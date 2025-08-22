
import React, { useState } from 'react';
import { FileText, ExternalLink, Lock, Eye } from 'lucide-react';
import { PdfDocument } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from '../../contexts/AuthContext';
import LazyPasswordDialog from '../common/LazyPasswordDialog';
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';

interface DocumentsSectionProps {
  documents?: PdfDocument[];
}

const DocumentsSection: React.FC<DocumentsSectionProps> = ({ documents }) => {
  const { isAuthenticated } = useAuth();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  if (!documents || documents.length === 0) {
    return null;
  }

  const handleUnlockClick = () => {
    setShowPasswordDialog(true);
  };

  // Show gated content for non-authenticated users
  if (!isAuthenticated) {
    return (
      <>
        <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300 relative overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">Due Diligence Documents</h2>
              </div>
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            
            {/* Blurred preview */}
            <div className="relative">
              <div className="filter blur-sm">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-foreground">Fund Prospectus</h4>
                      <p className="text-sm text-muted-foreground">•• pages • PDF</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-foreground">Annual Report</h4>
                      <p className="text-sm text-muted-foreground">•• pages • PDF</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium text-foreground">KID Document</h4>
                      <p className="text-sm text-muted-foreground">• pages • PDF</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Overlay with unlock button */}
              <div className="absolute inset-0 bg-card/80 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">Due Diligence Documents</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xs">
                    Access prospectus, annual reports, and legal documentation
                  </p>
                  <Button 
                    onClick={handleUnlockClick}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Access Documents
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Public teaser info */}
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                📋 <strong>Available documents:</strong> Fund prospectus, annual reports, 
                KID documents, and regulatory filings for comprehensive due diligence.
              </p>
            </div>
          </CardContent>
        </Card>

        <LazyPasswordDialog 
          open={showPasswordDialog}
          onOpenChange={setShowPasswordDialog}
        />
      </>
    );
  }

  // Show full content for authenticated users
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
