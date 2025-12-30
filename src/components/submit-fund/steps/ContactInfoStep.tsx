import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, User } from 'lucide-react';
import { FundSubmissionData } from '@/hooks/useFundSubmission';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ContactInfoStepProps {
  formData: FundSubmissionData;
  updateFormData: (updates: Partial<FundSubmissionData>) => void;
}

export default function ContactInfoStep({ formData, updateFormData }: ContactInfoStepProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload files');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_contact_photo.${fileExt}`;
      const filePath = `${user.id}/submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      updateFormData({ contact_photo_url: publicUrl });
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = () => {
    updateFormData({ contact_photo_url: '' });
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        This person will be listed as a team member on your fund page.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact_name">
            Full Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact_name"
            value={formData.contact_name}
            onChange={(e) => updateFormData({ contact_name: e.target.value })}
            placeholder="e.g., John Smith"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact_role">
            Role / Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact_role"
            value={formData.contact_role}
            onChange={(e) => updateFormData({ contact_role: e.target.value })}
            placeholder="e.g., Managing Partner"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact_bio">Bio (Optional)</Label>
          <Textarea
            id="contact_bio"
            value={formData.contact_bio}
            onChange={(e) => updateFormData({ contact_bio: e.target.value })}
            placeholder="Brief professional biography..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            A short bio helps investors get to know your team.
          </p>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="contact_linkedin">LinkedIn URL (Optional)</Label>
          <Input
            id="contact_linkedin"
            type="url"
            value={formData.contact_linkedin}
            onChange={(e) => updateFormData({ contact_linkedin: e.target.value })}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Profile Photo (Optional)</Label>
          {formData.contact_photo_url ? (
            <div className="flex items-center gap-4">
              <img
                src={formData.contact_photo_url}
                alt="Contact photo"
                className="w-20 h-20 object-cover rounded-full border"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removePhoto}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="photo-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                ) : (
                  <User className="h-8 w-8 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isUploading ? 'Uploading...' : 'Click to upload a profile photo'}
                </span>
                <span className="text-xs text-muted-foreground">
                  If no photo is provided, initials will be displayed instead
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
