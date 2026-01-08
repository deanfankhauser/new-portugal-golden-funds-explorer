import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, ChevronDown, ChevronUp } from 'lucide-react';
import { FundTeamMemberReference } from '@/types/team';
import { useCompanyTeamMembers } from '@/hooks/useCompanyTeamMembers';

interface FundTeamPickerProps {
  managerName: string;
  selectedMembers: FundTeamMemberReference[];
  onChange: (members: FundTeamMemberReference[]) => void;
  hasLegacyData?: boolean;
}

export const FundTeamPicker: React.FC<FundTeamPickerProps> = ({
  managerName,
  selectedMembers,
  onChange,
  hasLegacyData = false,
}) => {
  const { members: companyTeam, loading, error } = useCompanyTeamMembers(managerName);
  const [expanded, setExpanded] = useState(false);

  const handleToggleMember = (memberId: string) => {
    const isSelected = selectedMembers.some(m => m.member_id === memberId);
    
    if (isSelected) {
      onChange(selectedMembers.filter(m => m.member_id !== memberId));
    } else {
      onChange([...selectedMembers, { member_id: memberId }]);
    }
  };

  const handleRoleChange = (memberId: string, fundRole: string) => {
    const updated = selectedMembers.map(m =>
      m.member_id === memberId
        ? { ...m, fund_role: fundRole || undefined }
        : m
    );
    onChange(updated);
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
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4 animate-pulse" />
        Loading company team...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-destructive/10">
        <p className="text-sm text-destructive">
          Error loading team members: {error.message}
        </p>
      </div>
    );
  }

  if (companyTeam.length === 0) {
    return (
      <div className="p-4 border rounded-lg bg-muted/30">
        <p className="text-sm text-muted-foreground">
          No team members found. Add team members to your company profile first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {hasLegacyData && (
        <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            This fund had team members in the old format. Please re-select team members from your company roster below.
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <Label>Select Team Members for This Fund</Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Expand All
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {companyTeam.map((member) => {
          const isSelected = selectedMembers.some(m => m.member_id === member.member_id);
          const fundMember = selectedMembers.find(m => m.member_id === member.member_id);

          return (
            <div
              key={member.member_id}
              className={`p-4 border rounded-lg transition-colors ${
                isSelected ? 'border-primary bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => handleToggleMember(member.member_id)}
                />
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.photoUrl} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{member.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {member.role}
                    </Badge>
                  </div>
                  
                  {(expanded || isSelected) && member.bio && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  {isSelected && (
                    <div className="mt-3">
                      <Label className="text-xs">Fund-Specific Role (Optional)</Label>
                      <Input
                        value={fundMember?.fund_role || ''}
                        onChange={(e) => handleRoleChange(member.member_id, e.target.value)}
                        placeholder={`Leave empty to use company role: "${member.role}"`}
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Override company role for this fund only
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedMembers.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
  );
};
