import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Edit, Trash2, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyTeamMembers } from '@/hooks/useCompanyTeamMembers';
import { toast } from 'sonner';
import { uploadTeamMemberPhoto, deleteTeamMemberPhoto } from '@/utils/imageUpload';

interface TeamMemberFormData {
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  linkedinUrl?: string;
  email?: string;
  location?: string;
  languages?: string;
  teamSince?: string;
  education?: string;
  certifications?: string;
}

export default function CompanyTeamManagement() {
  const { profileId } = useParams<{ profileId: string }>();
  const [companyName, setCompanyName] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    role: '',
    bio: '',
    photoUrl: '',
    linkedinUrl: '',
    email: '',
    location: '',
    languages: '',
    teamSince: '',
    education: '',
    certifications: '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Fetch company name from profile
  React.useEffect(() => {
    const fetchCompanyName = async () => {
      if (!profileId) return;
      const { data } = await supabase
        .from('profiles')
        .select('company_name')
        .eq('id', profileId)
        .single();
      if (data) setCompanyName(data.company_name);
    };
    fetchCompanyName();
  }, [profileId]);

  const { members, loading, error, refetch } = useCompanyTeamMembers(companyName);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenDialog = (member?: any) => {
    if (member) {
      setEditingMemberId(member.member_id);
      setFormData({
        name: member.name,
        role: member.role,
        bio: member.bio || '',
        photoUrl: member.photoUrl || '',
        linkedinUrl: member.linkedinUrl || '',
        email: member.email || '',
        location: member.location || '',
        languages: member.languages?.join(', ') || '',
        teamSince: member.teamSince || '',
        education: member.education || '',
        certifications: member.certifications?.join('\n') || '',
      });
    } else {
      setEditingMemberId(null);
      setFormData({
        name: '',
        role: '',
        bio: '',
        photoUrl: '',
        linkedinUrl: '',
        email: '',
        location: '',
        languages: '',
        teamSince: '',
        education: '',
        certifications: '',
      });
    }
    setIsDialogOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileId) return;

    try {
      setUploadingPhoto(true);
      const photoUrl = await uploadTeamMemberPhoto(file, profileId);
      setFormData(prev => ({ ...prev, photoUrl }));
      toast.success('Photo uploaded successfully');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!formData.photoUrl) return;

    try {
      await deleteTeamMemberPhoto(formData.photoUrl);
      setFormData(prev => ({ ...prev, photoUrl: '' }));
      toast.success('Photo removed');
    } catch (error) {
      console.error('Error removing photo:', error);
      toast.error('Failed to remove photo');
    }
  };

  const handleSave = async () => {
    if (!profileId || !formData.name.trim() || !formData.role.trim()) {
      toast.error('Name and role are required');
      return;
    }

    setSaving(true);
    try {
      const slug = generateSlug(formData.name);
      
      // Parse languages and certifications from comma/newline separated strings
      const languagesArray = formData.languages
        ? formData.languages.split(',').map(l => l.trim()).filter(Boolean)
        : null;
      const certificationsArray = formData.certifications
        ? formData.certifications.split('\n').map(c => c.trim()).filter(Boolean)
        : null;

      if (editingMemberId) {
        // Update existing member
        const { error } = await supabase
          .from('team_members')
          .update({
            name: formData.name.trim(),
            role: formData.role.trim(),
            bio: formData.bio.trim() || null,
            photo_url: formData.photoUrl || null,
            linkedin_url: formData.linkedinUrl?.trim() || null,
            email: formData.email?.trim() || null,
            location: formData.location?.trim() || null,
            languages: languagesArray,
            team_since: formData.teamSince || null,
            education: formData.education?.trim() || null,
            certifications: certificationsArray,
            slug,
          })
          .eq('id', editingMemberId);

        if (error) throw error;
        toast.success('Team member updated successfully');
      } else {
        // Create new member
        const { error } = await supabase
          .from('team_members')
          .insert({
            profile_id: profileId,
            name: formData.name.trim(),
            role: formData.role.trim(),
            bio: formData.bio.trim() || null,
            photo_url: formData.photoUrl || null,
            linkedin_url: formData.linkedinUrl?.trim() || null,
            email: formData.email?.trim() || null,
            location: formData.location?.trim() || null,
            languages: languagesArray,
            team_since: formData.teamSince || null,
            education: formData.education?.trim() || null,
            certifications: certificationsArray,
            slug,
          });

        if (error) throw error;
        toast.success('Team member added successfully');
      }

      refetch();
      setIsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving team member:', error);
      toast.error(error.message || 'Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      toast.success('Team member deleted successfully');
      refetch();
    } catch (error: any) {
      console.error('Error deleting team member:', error);
      toast.error(error.message || 'Failed to delete team member');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading team members: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Team Members</h1>
          <p className="text-muted-foreground mt-1">
            Manage your company's team member profiles
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No team members yet. Click "Add Team Member" to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {members.map((member) => (
            <Card key={member.member_id}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.photoUrl} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <Badge variant="outline" className="mt-1">
                          {member.role}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(member.member_id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {member.bio && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {member.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mt-3">
                      {member.slug && (
                        <a
                          href={`/team/${member.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <LinkIcon className="h-3 w-3" />
                          View Profile
                        </a>
                      )}
                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMemberId ? 'Edit Team Member' : 'Add Team Member'}
            </DialogTitle>
            <DialogDescription>
              Fill in the team member details. Name and role are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="photo">Profile Photo</Label>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.photoUrl} alt={formData.name} />
                  <AvatarFallback>{getInitials(formData.name || 'TM')}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="max-w-xs"
                  />
                  {formData.photoUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemovePhoto}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Job title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Professional background and experience..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages">Languages</Label>
                <Input
                  id="languages"
                  value={formData.languages}
                  onChange={(e) => setFormData(prev => ({ ...prev, languages: e.target.value }))}
                  placeholder="English, Portuguese, Spanish"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamSince">Team Since</Label>
                <Input
                  id="teamSince"
                  type="date"
                  value={formData.teamSince}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamSince: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Education</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
                  placeholder="MBA, Harvard Business School"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certifications">Certifications</Label>
              <Textarea
                id="certifications"
                value={formData.certifications}
                onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
                placeholder="One certification per line..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || uploadingPhoto}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingMemberId ? 'Update' : 'Add'} Team Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
