import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface FundBriefUploadProps {
  fundId: string;
  fundName: string;
  currentBriefUrl?: string;
  onBriefUpdate: (briefUrl: string | null) => void;
}

const FundBriefUpload: React.FC<FundBriefUploadProps> = ({
  fundId,
  fundName,
  currentBriefUrl,
  onBriefUpdate,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { user } = useAuth();

  const validateFile = (file: File): string | null => {
    // Check file type - only allow PDF files
    if (file.type !== 'application/pdf') {
      return 'Only PDF files are allowed for fund briefs';
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const uploadBrief = async (file: File) => {
    const validation = validateFile(file);
    if (validation) {
      toast.error(validation);
      return;
    }

    setUploading(true);
    try {
      // Create unique filename
      const fileExt = 'pdf';
      const fileName = `${fundId}-fund-brief-${Date.now()}.${fileExt}`;

      // Delete old brief if it exists
      if (currentBriefUrl) {
        const oldFileName = currentBriefUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('fund-briefs')
            .remove([oldFileName]);
        }
      }

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('fund-briefs')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fund-briefs')
        .getPublicUrl(fileName);

      // Call the callback to update parent component
      onBriefUpdate(publicUrl);
      
      toast.success('Fund brief uploaded successfully');
    } catch (error) {
      console.error('Error uploading fund brief:', error);
      toast.error('Failed to upload fund brief');
    } finally {
      setUploading(false);
    }
  };

  const removeBrief = async () => {
    if (!currentBriefUrl) return;

    try {
      // Extract filename from URL
      const fileName = currentBriefUrl.split('/').pop();
      if (!fileName) return;

      // Delete from storage
      const { error } = await supabase.storage
        .from('fund-briefs')
        .remove([fileName]);

      if (error) throw error;

      // Call the callback to update parent component
      onBriefUpdate(null);
      
      toast.success('Fund brief removed successfully');
    } catch (error) {
      console.error('Error removing fund brief:', error);
      toast.error('Failed to remove fund brief');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadBrief(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadBrief(files[0]);
    }
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-medium">Fund Brief Document</Label>
            <p className="text-sm text-muted-foreground">
              Upload a PDF fund brief that will be sent to investors when requested.
            </p>
          </div>

          {/* Current Brief Display */}
          {currentBriefUrl && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Current Fund Brief</p>
                <p className="text-xs text-muted-foreground">
                  PDF document ready for distribution
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={removeBrief}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Remove
              </Button>
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragOver
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-muted-foreground/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading fund brief...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    Drop your PDF here or{' '}
                    <Button
                      variant="link"
                      className="p-0 h-auto font-medium"
                      onClick={() => document.getElementById('brief-upload')?.click()}
                    >
                      browse files
                    </Button>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF only, max 10MB
                  </p>
                </div>
              </div>
            )}
            <input
              id="brief-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </div>

          {/* Usage Guidelines */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Only admin users can upload fund brief documents</p>
            <p>• The fund brief will be automatically sent when investors request it</p>
            <p>• Make sure the document contains up-to-date fund information</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundBriefUpload;