import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { Save, Upload, X, Plus, Trash2 } from 'lucide-react';
import { z } from 'zod';

interface TeamMember {
  name: string;
  role: string;
  bio?: string;
  photo?: string;
}

interface ProfileEditTabProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
  canManageTeam: boolean;
}

const profileSchema = z.object({
  company_name: z.string().trim().min(1, 'Company name is required').max(200),
  manager_name: z.string().trim().min(1, 'Manager name is required').max(200),
  description: z.string().trim().max(2000).optional(),
  website: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  city: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  founded_year: z.number().int().min(1800).max(new Date().getFullYear()).optional().nullable(),
  assets_under_management: z.number().int().min(0).optional().nullable(),
  manager_about: z.string().trim().max(3000).optional(),
});

const ProfileEditTab: React.FC<ProfileEditTabProps> = ({ profile, onProfileUpdate, canManageTeam }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  
  const [companyName, setCompanyName] = useState(profile.company_name || '');
  const [managerName, setManagerName] = useState(profile.manager_name || '');
  const [description, setDescription] = useState(profile.description || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [city, setCity] = useState(profile.city || '');
  const [country, setCountry] = useState(profile.country || '');
  const [foundedYear, setFoundedYear] = useState(profile.founded_year?.toString() || '');
  const [aum, setAum] = useState(profile.assets_under_management?.toString() || '');
  const [about, setAbout] = useState(profile.manager_about || '');
  const [logoUrl, setLogoUrl] = useState(profile.logo_url || '');
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    try {
      return profile.team_members ? JSON.parse(JSON.stringify(profile.team_members)) : [];
    } catch {
      return [];
    }
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Logo must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setUploadingLogo(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_logo.${fileExt}`;
      const filePath = `${user.id}/logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(filePath);

      setLogoUrl(publicUrl);

      toast({
        title: 'Logo Uploaded',
        description: 'Your logo has been uploaded successfully',
      });
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to upload logo',
        variant: 'destructive',
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    toast({
      title: 'Logo Removed',
      description: 'Logo has been removed. Click Save to apply changes.',
    });
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: '', role: '', bio: '' }]);
  };

  const handleRemoveTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Validate data
      const validationData = {
        company_name: companyName,
        manager_name: managerName,
        description: description || undefined,
        website: website || undefined,
        city: city || undefined,
        country: country || undefined,
        founded_year: foundedYear ? parseInt(foundedYear) : null,
        assets_under_management: aum ? parseInt(aum) : null,
        manager_about: about || undefined,
      };

      const result = profileSchema.safeParse(validationData);
      if (!result.success) {
        const firstError = result.error.errors[0];
        toast({
          title: 'Validation Error',
          description: firstError.message,
          variant: 'destructive',
        });
        return;
      }

      // Get current user for edit tracking
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Prepare update data
      const updateData: any = {
        company_name: companyName.trim(),
        manager_name: managerName.trim(),
        description: description.trim() || null,
        website: website.trim() || null,
        city: city.trim() || null,
        country: country.trim() || null,
        founded_year: foundedYear ? parseInt(foundedYear) : null,
        assets_under_management: aum ? parseInt(aum) : null,
        manager_about: about.trim() || null,
        logo_url: logoUrl || null,
        team_members: teamMembers.length > 0 ? teamMembers : null,
        updated_at: new Date().toISOString(),
      };

      // Track changes for audit
      const changes: Record<string, any> = {};
      const previousValues: Record<string, any> = {};

      Object.keys(updateData).forEach(key => {
        const oldValue = (profile as any)[key];
        const newValue = updateData[key];
        if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          changes[key] = newValue;
          previousValues[key] = oldValue;
        }
      });

      // Update profile
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', profile.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Log the edit
      if (Object.keys(changes).length > 0) {
        await supabase
          .from('manager_profile_edits')
          .insert({
            profile_id: profile.id,
            manager_user_id: user.id,
            edit_type: 'profile_update',
            previous_values: previousValues,
            changes: changes,
          });
      }

      onProfileUpdate(updatedProfile as Profile);

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Save Failed',
        description: error.message || 'Failed to save profile changes',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>
            Basic information about your company
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company Name"
                maxLength={200}
              />
            </div>
            <div>
              <Label htmlFor="manager_name">Manager Name *</Label>
              <Input
                id="manager_name"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                placeholder="Fund Manager Name"
                maxLength={200}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of your company (shown in listings)"
              rows={3}
              maxLength={2000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length}/2000 characters
            </p>
          </div>

          <div>
            <Label htmlFor="about">About Your Company</Label>
            <Textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              placeholder="Detailed information about your company, investment philosophy, and approach"
              rows={6}
              maxLength={3000}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {about.length}/3000 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourcompany.com"
              />
            </div>
            <div>
              <Label htmlFor="founded_year">Founded Year</Label>
              <Input
                id="founded_year"
                type="number"
                value={foundedYear}
                onChange={(e) => setFoundedYear(e.target.value)}
                placeholder="2020"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Lisbon"
                maxLength={100}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Portugal"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="aum">Assets Under Management (EUR)</Label>
            <Input
              id="aum"
              type="number"
              value={aum}
              onChange={(e) => setAum(e.target.value)}
              placeholder="10000000"
              min="0"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Total assets under management in EUR
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Company Logo</CardTitle>
          <CardDescription>
            Upload your company logo (max 5MB, recommended: square image)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <div className="relative">
                <img
                  src={logoUrl}
                  alt="Company Logo"
                  className="h-24 w-24 rounded-lg object-cover border-2 border-border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={handleRemoveLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="h-24 w-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                <Upload className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="max-w-xs"
              />
              {uploadingLogo && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Members */}
      {canManageTeam && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>
                  Add key team members and their roles
                </CardDescription>
              </div>
              <Button onClick={handleAddTeamMember} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {teamMembers.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No team members added yet. Click "Add Member" to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Team Member {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTeamMember(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          value={member.name}
                          onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                          placeholder="John Doe"
                          maxLength={100}
                        />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Input
                          value={member.role}
                          onChange={(e) => handleTeamMemberChange(index, 'role', e.target.value)}
                          placeholder="Portfolio Manager"
                          maxLength={100}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Bio (Optional)</Label>
                      <Textarea
                        value={member.bio || ''}
                        onChange={(e) => handleTeamMemberChange(index, 'bio', e.target.value)}
                        placeholder="Brief bio about this team member..."
                        rows={2}
                        maxLength={500}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          size="lg"
        >
          {saving ? (
            <>
              <Save className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditTab;