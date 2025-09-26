import { supabase } from '@/integrations/supabase/client';

export const uploadTeamMemberPhoto = async (file: File, teamMemberName: string): Promise<string> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to upload photos');
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${teamMemberName.replace(/\s+/g, '_')}.${fileExt}`;
    const filePath = `${user.id}/team-members/${fileName}`;

    // Upload the file
    const { data, error } = await supabase.storage
      .from('profile-photos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading team member photo:', error);
    throw new Error('Failed to upload photo');
  }
};

export const deleteTeamMemberPhoto = async (photoUrl: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlParts = photoUrl.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'profile-photos');
    if (bucketIndex === -1) return;
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from('profile-photos')
      .remove([filePath]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting team member photo:', error);
  }
};