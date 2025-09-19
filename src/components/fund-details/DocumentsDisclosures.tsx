import React, { useState } from 'react';
import { FileText, ExternalLink, Lock, Download, Calendar, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { buildContactUrl, openExternalLink } from '../../utils/urlHelpers';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Fund } from '../../data/types/funds';

interface DocumentsDisclosuresProps {
  fund: Fund;
}

interface DocumentItem {
  name: string;
  type: 'public' | 'gated' | 'restricted';
  lastUpdated: string;
  description: string;
  icon: React.ReactNode;
}

const DocumentsDisclosures: React.FC<DocumentsDisclosuresProps> = ({ fund }) => {
  const [isRequestingBrief, setIsRequestingBrief] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  // Mock document structure - in production this would come from fund data
  const documents: DocumentItem[] = [
    {
      name: 'Fund Factsheet',
      type: 'public',
      lastUpdated: '2024-01-15',
      description: 'Key fund information and performance summary',
      icon: <FileText className="w-4 h-4" />
    },
    {
      name: 'Key Information Document (KID)',
      type: 'public', 
      lastUpdated: '2024-01-01',
      description: 'Regulatory disclosure document',
      icon: <FileText className="w-4 h-4" />
    },
    {
      name: 'Offering Memorandum',
      type: 'gated',
      lastUpdated: '2023-12-01',
      description: 'Complete fund terms and conditions',
      icon: <Lock className="w-4 h-4" />
    },
    {
      name: 'Audited Financial Statements',
      type: 'gated',
      lastUpdated: '2023-12-31',
      description: 'Annual audited fund financials',
      icon: <Lock className="w-4 h-4" />
    },
    {
      name: 'Custodian Letter',
      type: 'restricted',
      lastUpdated: '2024-01-01',
      description: 'Custodian appointment confirmation',
      icon: <Lock className="w-4 h-4" />
    },
    {
      name: 'Performance Pack',
      type: 'gated',
      lastUpdated: '2024-01-31',
      description: 'Detailed performance attribution and analytics',
      icon: <Lock className="w-4 h-4" />
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDocumentBadge = (type: DocumentItem['type']) => {
    switch (type) {
      case 'public':
        return <Badge variant="secondary" className="text-xs">Free Access</Badge>;
      case 'gated':
        return <Badge variant="outline" className="text-xs">Email Required</Badge>;
      case 'restricted':
        return <Badge variant="secondary" className="text-xs border-amber-200 bg-amber-50 text-amber-800">Investor Only</Badge>;
    }
  };

  const handleDocumentRequest = (doc: DocumentItem) => {
    if (doc.type === 'public') {
      // In production, this would download the document
      openExternalLink(buildContactUrl('document-download'));
    } else {
      // Gated or restricted - request via email
      openExternalLink(buildContactUrl('document-request'));
    }
  };

  const handleGetFundBrief = async () => {
    if (!isAuthenticated || !user?.email) {
      toast({
        title: "Authentication Required", 
        description: "Please log in to request fund brief",
        variant: "destructive",
      });
      return;
    }

    setIsRequestingBrief(true);

    try {
      const { error } = await supabase.functions.invoke('send-fund-brief', {
        body: {
          userEmail: user.email,
          fundName: fund.name,
          fundId: fund.id,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Fund Brief Requested",
        description: `We'll send the ${fund.name} brief to ${user.email} within 24 hours.`,
      });
    } catch (error: any) {
      console.error('Error requesting fund brief:', error);
      toast({
        title: "Error",
        description: "Failed to request fund brief. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRequestingBrief(false);
    }
  };

  const publicDocs = documents.filter(doc => doc.type === 'public');
  const gatedDocs = documents.filter(doc => doc.type === 'gated');
  const restrictedDocs = documents.filter(doc => doc.type === 'restricted');

  return (
    <Card className="border border-border shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-bold text-foreground">
          <FileText className="w-5 h-5 mr-2 text-primary" />
          Documents & Disclosures
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Public Documents */}
        {publicDocs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Public Documents</h3>
            <div className="space-y-3">
              {publicDocs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-primary mt-1">{doc.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        {getDocumentBadge(doc.type)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{doc.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        Updated {formatDate(doc.lastUpdated)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDocumentRequest(doc)}
                    className="ml-3"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Request
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gated Documents */}
        {gatedDocs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Detailed Documentation</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Request access to comprehensive fund documentation via email.
            </p>
            <div className="space-y-3">
              {gatedDocs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-primary mt-1">{doc.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-foreground">{doc.name}</h4>
                        {getDocumentBadge(doc.type)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{doc.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        Updated {formatDate(doc.lastUpdated)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDocumentRequest(doc)}
                    className="ml-3"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Request
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Restricted Documents */}
        {restrictedDocs.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Investor Documents</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Available to existing investors and qualified prospects only.
            </p>
            <div className="space-y-3">
              {restrictedDocs.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg opacity-75">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="text-muted-foreground mt-1">{doc.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium text-muted-foreground">{doc.name}</h4>
                        {getDocumentBadge(doc.type)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{doc.description}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        Updated {formatDate(doc.lastUpdated)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="ml-3"
                  >
                    <Lock className="w-4 h-4 mr-1" />
                    Restricted
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Access CTA */}
        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-foreground mb-1">Get Complete Documentation Pack</h4>
              <p className="text-sm text-muted-foreground">
                Request all available documents in one go via our Fund Brief service.
              </p>
            </div>
            <Button 
              onClick={handleGetFundBrief}
              disabled={isRequestingBrief}
              className="ml-4 whitespace-nowrap"
            >
              <Mail className="w-4 h-4 mr-1" />
              {isRequestingBrief ? "Requesting..." : "Get Fund Brief"}
            </Button>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Document Disclaimer:</strong> All documents are subject to the terms and conditions outlined in the offering memorandum. 
            Information is provided for evaluation purposes only and does not constitute an offer to sell or solicitation to buy securities. 
            Documents may be updated periodically - always verify you have the latest version.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentsDisclosures;