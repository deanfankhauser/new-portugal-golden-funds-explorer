import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload, Building2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AdminCreateCompanyProfile: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Required fields
  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [foundedYear, setFoundedYear] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Optional fields
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  const currentYear = new Date().getFullYear();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);
      toast({ title: 'Logo uploaded successfully' });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!companyName.trim()) {
      toast({ title: 'Company name is required', variant: 'destructive' });
      return false;
    }
    if (!managerName.trim()) {
      toast({ title: 'Key contact name is required', variant: 'destructive' });
      return false;
    }
    if (!city.trim()) {
      toast({ title: 'City is required', variant: 'destructive' });
      return false;
    }
    if (!country.trim()) {
      toast({ title: 'Country is required', variant: 'destructive' });
      return false;
    }
    if (!foundedYear) {
      toast({ title: 'Founded year is required', variant: 'destructive' });
      return false;
    }
    const year = parseInt(foundedYear);
    if (isNaN(year) || year < 1800 || year > currentYear) {
      toast({ title: `Founded year must be between 1800 and ${currentYear}`, variant: 'destructive' });
      return false;
    }
    if (!logoUrl.trim()) {
      toast({ title: 'Logo URL is required', variant: 'destructive' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: crypto.randomUUID(),
          email: `admin-created-${Date.now()}@placeholder.internal`,
          company_name: companyName.trim(),
          manager_name: managerName.trim(),
          city: city.trim(),
          country: country.trim(),
          founded_year: parseInt(foundedYear),
          logo_url: logoUrl.trim(),
          description: description.trim() || null,
          website: website.trim() || null,
        });

      if (error) throw error;

      toast({ title: 'Company profile created successfully' });
      navigate('/admin/edit-profiles');
    } catch (error: any) {
      console.error('Create error:', error);
      toast({
        title: 'Failed to create profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/admin/edit-profiles')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Company Profile</h1>
          <p className="text-muted-foreground">Add a new fund manager company to the platform</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Required fields marked with *</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>Company Logo *</Label>
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt="Company logo"
                  className="h-20 w-20 rounded-lg object-cover border border-border"
                />
              ) : (
                <div className="h-20 w-20 rounded-lg bg-muted/30 border border-dashed border-border flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploading}
                  className="w-auto"
                />
                <span className="text-xs text-muted-foreground">Or enter URL directly:</span>
                <Input
                  placeholder="https://..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-80"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Acme Capital"
                maxLength={200}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerName">Key Contact Name *</Label>
              <Input
                id="managerName"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="e.g. John Smith"
                maxLength={200}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Lisbon"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. Portugal"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundedYear">Founded Year *</Label>
              <Input
                id="foundedYear"
                type="number"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder={`e.g. ${currentYear - 10}`}
                min={1800}
                max={currentYear}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website (optional)</Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the company..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate('/admin/edit-profiles')}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving || uploading}>
          {saving ? 'Creating...' : 'Create Profile'}
        </Button>
      </div>
    </div>
  );
};
