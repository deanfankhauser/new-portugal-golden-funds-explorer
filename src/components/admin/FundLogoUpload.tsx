import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import FundLogo from '../fund-details/FundLogo';

interface FundLogoUploadProps {
  fundId: string;
  fundName: string;
  currentLogoUrl?: string;
  onLogoUpdate: (logoUrl: string | null) => void;
}

const FundLogoUpload: React.FC<FundLogoUploadProps> = ({
  fundId,
  fundName,
  currentLogoUrl,
  onLogoUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, PNG, WebP, and SVG files are allowed';
    }

    // Check file size (max 500KB)
    if (file.size > 500 * 1024) {
      return 'File size must be less than 500KB';
    }

    return null;
  };

  const uploadLogo = async (file: File) => {
    setUploading(true);
    
    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        toast({
          title: 'Invalid File',
          description: validationError,
          variant: 'destructive'
        });
        return;
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${fundId}-${Date.now()}.${fileExt}`;

      // Delete existing logo if any
      if (currentLogoUrl) {
        const oldFileName = currentLogoUrl.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('fund-logos')
            .remove([oldFileName]);
        }
      }

      // Upload new logo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fund-logos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fund-logos')
        .getPublicUrl(fileName);

      // Update fund in database
      const { error: updateError } = await supabase
        .from('funds')
        .update({ logo_url: publicUrl })
        .eq('id', fundId);

      if (updateError) {
        throw updateError;
      }

      onLogoUpdate(publicUrl);
      
      toast({
        title: 'Logo Uploaded',
        description: 'Fund logo has been successfully updated'
      });

    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload logo. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    if (!currentLogoUrl) return;

    setUploading(true);
    
    try {
      // Remove from storage
      const fileName = currentLogoUrl.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('fund-logos')
          .remove([fileName]);
      }

      // Update database
      const { error } = await supabase
        .from('funds')
        .update({ logo_url: null })
        .eq('id', fundId);

      if (error) {
        throw error;
      }

      onLogoUpdate(null);
      
      toast({
        title: 'Logo Removed',
        description: 'Fund logo has been removed'
      });

    } catch (error) {
      console.error('Error removing logo:', error);
      toast({
        title: 'Removal Failed',
        description: 'Failed to remove logo. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    uploadLogo(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Fund Logo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Logo Display */}
        <div className="flex items-center gap-4">
          <FundLogo 
            logoUrl={currentLogoUrl} 
            fundName={fundName} 
            size="lg" 
          />
          <div>
            <p className="font-medium">{currentLogoUrl ? 'Current Logo' : 'No Logo Set'}</p>
            <p className="text-sm text-muted-foreground">
              {currentLogoUrl ? 'Logo is displayed across the platform' : 'Fund initials will be shown instead'}
            </p>
          </div>
          {currentLogoUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeLogo}
              disabled={uploading}
            >
              <X className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )}
        </div>

        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            uploading && "pointer-events-none opacity-50"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/jpeg,image/jpg,image/png,image/webp,image/svg+xml';
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              if (files && files.length > 0) {
                handleFileSelect(files[0]);
              }
            };
            input.click();
          }}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading logo...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">Drop a logo here or click to browse</p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG, WebP, or SVG • Max 500KB • Square format recommended
              </p>
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Logo Guidelines:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use high-resolution images for best quality</li>
            <li>Square aspect ratio (1:1) works best</li>
            <li>Transparent backgrounds are recommended</li>
            <li>Logos should be recognizable at small sizes</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundLogoUpload;