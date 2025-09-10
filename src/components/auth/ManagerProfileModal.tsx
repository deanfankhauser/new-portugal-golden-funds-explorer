import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock, Upload, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ManagerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser;
}

const ManagerProfileModal: React.FC<ManagerProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  user 
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please choose an image under 2MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      
      toast({
        title: "Avatar Uploaded",
        description: "Your profile picture has been updated.",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload avatar. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passwords if changing
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "New passwords do not match.",
            variant: "destructive",
          });
          return;
        }
        if (newPassword.length < 6) {
          toast({
            title: "Password Too Short",
            description: "Password must be at least 6 characters.",
            variant: "destructive",
          });
          return;
        }
      }

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { 
          full_name: name,
          avatar_url: avatarUrl 
        }
      });

      if (metadataError) throw metadataError;

      // Update email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: email
        });
        if (emailError) throw emailError;
      }

      // Update password if provided
      if (newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (passwordError) throw passwordError;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      // Reset password fields
      setNewPassword('');
      setConfirmPassword('');
      onClose();
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Manager Profile
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="w-20 h-20">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-lg">
                {name.split(' ').map(n => n[0]).join('').toUpperCase() || 'M'}
              </AvatarFallback>
            </Avatar>
            <div className="relative">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={isUploadingAvatar}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={isUploadingAvatar}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {isUploadingAvatar ? "Uploading..." : "Change Photo"}
              </Button>
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="manager@example.com"
              disabled={isLoading}
            />
          </div>

          {/* Password Change */}
          <div className="space-y-3 pt-2 border-t">
            <Label className="text-sm font-medium text-muted-foreground">
              Change Password (optional)
            </Label>
            
            <div className="space-y-2">
              <Label htmlFor="new-password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {newPassword && (
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ManagerProfileModal;