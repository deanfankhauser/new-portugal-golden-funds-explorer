import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';
import { FundSubmissionData } from '@/hooks/useFundSubmission';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanyInfoStepProps {
  formData: FundSubmissionData;
  updateFormData: (updates: Partial<FundSubmissionData>) => void;
}

const COUNTRIES = [
  'Portugal', 'Spain', 'United Kingdom', 'Germany', 'France', 'Italy', 
  'Netherlands', 'Belgium', 'Switzerland', 'Luxembourg', 'Ireland',
  'United States', 'Canada', 'Australia', 'Singapore', 'Hong Kong',
];

const ENTITY_TYPES = [
  { value: 'SCR', label: 'SCR (Sociedade de Capital de Risco)' },
  { value: 'SGOIC', label: 'SGOIC' },
  { value: 'Gestora', label: 'Gestora' },
  { value: 'SGIIC', label: 'SGIIC' },
  { value: 'Other', label: 'Other' },
];

export default function CompanyInfoStep({ formData, updateFormData }: CompanyInfoStepProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
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
      const fileName = `${Date.now()}_company_logo.${fileExt}`;
      const filePath = `${user.id}/submissions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      updateFormData({ company_logo_url: publicUrl });
      toast.success('Logo uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload logo');
    } finally {
      setIsUploading(false);
    }
  };

  const removeLogo = () => {
    updateFormData({ company_logo_url: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="company_name">
            Company Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company_name"
            value={formData.company_name}
            onChange={(e) => updateFormData({ company_name: e.target.value })}
            placeholder="e.g., Acme Capital Partners"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="company_description">
            Company Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="company_description"
            value={formData.company_description}
            onChange={(e) => updateFormData({ company_description: e.target.value })}
            placeholder="Describe your company, its mission, and investment philosophy..."
            rows={4}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="company_website">
            Website <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company_website"
            type="url"
            value={formData.company_website}
            onChange={(e) => updateFormData({ company_website: e.target.value })}
            placeholder="https://www.yourcompany.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_city">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company_city"
            value={formData.company_city}
            onChange={(e) => updateFormData({ company_city: e.target.value })}
            placeholder="e.g., Lisbon"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_country">
            Country <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.company_country}
            onValueChange={(value) => updateFormData({ company_country: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="entity_type">Entity Type</Label>
          <Select
            value={formData.entity_type}
            onValueChange={(value) => updateFormData({ entity_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>
            Company Logo <span className="text-destructive">*</span>
          </Label>
          {formData.company_logo_url ? (
            <div className="flex items-center gap-4">
              <img
                src={formData.company_logo_url}
                alt="Company logo"
                className="w-20 h-20 object-contain rounded-lg border bg-white"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeLogo}
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
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
                disabled={isUploading}
              />
              <label
                htmlFor="logo-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {isUploading ? (
                  <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">
                  {isUploading ? 'Uploading...' : 'Click to upload your company logo'}
                </span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG up to 5MB
                </span>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
