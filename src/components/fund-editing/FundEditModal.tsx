import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Loader2, Plus, Trash2, X, Building2, TrendingUp, FileText, Settings } from 'lucide-react';
import { Fund, GeographicAllocation, TeamMember, PdfDocument, RedemptionTerms, FAQItem, FundTeamMemberReference } from '@/data/types/funds';
import { getAllTags } from '@/data/services/tags-service';
import { useFundEditing } from '@/hooks/useFundEditing';
import { toast } from 'sonner';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import HistoricalPerformanceEditor from './HistoricalPerformanceEditor';
import { useRealTimeFunds } from '@/hooks/useRealTimeFunds';
import { FundTeamPicker } from './FundTeamPicker';

interface FundEditModalProps {
  fund: Fund;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FundEditModal: React.FC<FundEditModalProps> = ({
  fund,
  open,
  onOpenChange,
}) => {
  const { submitFundEditSuggestion, canEditFund, directUpdateFund, loading, user } = useFundEditing();
  const { toast } = useToast();
  const { funds: allFundsData } = useRealTimeFunds();
  const allDatabaseFunds = allFundsData || [];
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [hasDirectEditAccess, setHasDirectEditAccess] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(true);
  
const buildFormData = (f: Fund) => {
  const formData: any = {
    // Basic information - always present
    description: f.description,
    detailedDescription: f.detailedDescription,
    managerName: f.managerName,
    minimumInvestment: f.minimumInvestment.toString(),
    managementFee: f.managementFee.toString(),
    performanceFee: f.performanceFee != null ? f.performanceFee.toString() : '',
    subscriptionFee: f.subscriptionFee != null ? f.subscriptionFee.toString() : '',
    redemptionFee: f.redemptionFee != null ? f.redemptionFee.toString() : '',
    hurdleRate: f.hurdleRate != null ? f.hurdleRate.toString() : '',
    term: f.term.toString(),
    category: f.category,
    returnTarget: f.returnTarget,
    websiteUrl: f.websiteUrl || '',
    location: f.location,
    fundSize: f.fundSize.toString(),
    established: f.established.toString(),
    regulatedBy: f.regulatedBy,
    // Geographic allocation - always present as array
    geographicAllocation: f.geographicAllocation || [],
    // Team members - convert to references, filter out invalid legacy entries
    teamReferences: (f.team || [])
      .filter((member: any) => member.member_id && member.member_id !== '')
      .map((member: any) => ({
        member_id: member.member_id,
        fund_role: member.fund_role
      } as FundTeamMemberReference)),
    // Documents - always present as array
    documents: f.documents || [],
    // Historical performance - always present as object
    historicalPerformance: f.historicalPerformance || {},
    // FAQs - always present as array
    faqs: f.faqs || [],
    // Tags - always present as array
    tags: f.tags || [],
    // Social media links
    youtubeUrl: f.youtubeUrl || '',
    instagramUrl: f.instagramUrl || '',
    tiktokUrl: f.tiktokUrl || '',
    facebookUrl: f.facebookUrl || '',
    twitterUrl: f.twitterUrl || '',
    linkedinUrl: f.linkedinUrl || '',
    youtubeVideoUrl: f.youtubeVideoUrl || '',
    newsRssFeedUrl: f.newsRssFeedUrl || '',
  };

  // Only add optional fields if they exist in the fund data
  if (f.redemptionTerms) {
    formData.redemptionTerms = { ...f.redemptionTerms };
  }

  if (f.cmvmId !== undefined) {
    formData.cmvmId = f.cmvmId;
  }

  if (f.auditor !== undefined) {
    formData.auditor = f.auditor;
  }

  if (f.custodian !== undefined) {
    formData.custodian = f.custodian;
  }

  if (f.navFrequency !== undefined) {
    formData.navFrequency = f.navFrequency;
  }

  if (f.pficStatus !== undefined) {
    formData.pficStatus = f.pficStatus;
  }

  if (f.eligibilityBasis) {
    formData.eligibilityBasis = { ...f.eligibilityBasis };
  }

  return formData;
};
const [formData, setFormData] = useState(buildFormData(fund));

useEffect(() => {
  if (open) {
    setFormData(buildFormData(fund));
  }
}, [open, fund]);

// Check if user has direct edit permission
useEffect(() => {
  const checkPermission = async () => {
    if (user && open) {
      setCheckingPermission(true);
      try {
        const canEdit = await canEditFund(fund.id);
        setHasDirectEditAccess(canEdit);
      } catch (error) {
        console.error('Error checking edit permission:', error);
        setHasDirectEditAccess(false);
      } finally {
        setCheckingPermission(false);
      }
    } else {
      setHasDirectEditAccess(false);
      setCheckingPermission(false);
    }
  };
  checkPermission();
}, [fund.id, user, open, canEditFund]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (field: string, subField: string, value: any) => {
    setFormData(prev => {
      const fieldValue = prev[field as keyof typeof prev];
      
      // If the field doesn't exist, create it as an empty object first
      if (!fieldValue || typeof fieldValue !== 'object' || Array.isArray(fieldValue)) {
        return {
          ...prev,
          [field]: {
            [subField]: value
          }
        };
      }
      
      return {
        ...prev,
        [field]: {
          ...fieldValue,
          [subField]: value
        }
      };
    });
  };

  const handleArrayChange = (field: string, index: number, subField: string, value: any) => {
    setFormData(prev => {
      const array = [...(prev[field as keyof typeof prev] as any[])];
      array[index] = { ...array[index], [subField]: value };
      return { ...prev, [field]: array };
    });
  };


  const addArrayItem = (field: string, newItem: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as any[]), newItem]
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as any[]).filter((_, i) => i !== index)
    }));
  };

  const handleTeamReferencesChange = (references: FundTeamMemberReference[]) => {
    setFormData(prev => ({
      ...prev,
      teamReferences: references
    }));
  };

  const getCurrentValues = () => ({
    description: fund.description,
    detailedDescription: fund.detailedDescription,
    managerName: fund.managerName,
    minimumInvestment: fund.minimumInvestment,
    managementFee: fund.managementFee,
    performanceFee: fund.performanceFee,
    subscriptionFee: fund.subscriptionFee,
    redemptionFee: fund.redemptionFee,
    hurdleRate: fund.hurdleRate,
    term: fund.term,
    category: fund.category,
    returnTarget: fund.returnTarget,
    websiteUrl: fund.websiteUrl,
    location: fund.location,
    fundSize: fund.fundSize,
    established: fund.established,
    regulatedBy: fund.regulatedBy,
    geographicAllocation: fund.geographicAllocation,
    teamReferences: (fund.team || []).map((m: any) => 
      m.member_id ? { member_id: m.member_id, fund_role: m.fund_role } : { member_id: '', fund_role: m.position }
    ),
    documents: fund.documents,
    redemptionTerms: fund.redemptionTerms,
    cmvmId: fund.cmvmId,
    auditor: fund.auditor,
    custodian: fund.custodian,
    navFrequency: fund.navFrequency,
    pficStatus: fund.pficStatus,
    eligibilityBasis: fund.eligibilityBasis,
    historicalPerformance: fund.historicalPerformance,
    faqs: fund.faqs,
    tags: fund.tags,
    // Social media fields
    youtubeUrl: fund.youtubeUrl,
    instagramUrl: fund.instagramUrl,
    tiktokUrl: fund.tiktokUrl,
    facebookUrl: fund.facebookUrl,
    twitterUrl: fund.twitterUrl,
    linkedinUrl: fund.linkedinUrl,
    youtubeVideoUrl: fund.youtubeVideoUrl,
    newsRssFeedUrl: fund.newsRssFeedUrl,
  });

  const getSuggestedChanges = () => {
    const current = getCurrentValues();
    const changes: Record<string, any> = {};
    
    // Helper function to normalize empty values
    const normalizeValue = (value: any): any => {
      if (value === '' || value === null || value === undefined) {
        return undefined;
      }
      return value;
    };
    
    // Only check fields that exist in formData (avoiding default-initialized fields)
    Object.keys(formData).forEach(key => {
      const currentValue = normalizeValue(current[key as keyof typeof current]);
      let newValue: any = formData[key as keyof typeof formData];
      
      // Handle numeric fields
      if (['minimumInvestment', 'managementFee', 'performanceFee', 'subscriptionFee', 'redemptionFee', 'hurdleRate', 'term', 'fundSize', 'established'].includes(key)) {
        if (typeof newValue === 'string') {
          newValue = parseFloat(newValue) || 0;
        }
      } else {
        // Normalize non-numeric values
        newValue = normalizeValue(newValue);
      }
      
      // Deep comparison for objects and arrays, simple comparison for primitives
      const hasChanged = Array.isArray(currentValue) || (typeof currentValue === 'object' && currentValue !== null) ||
                        Array.isArray(newValue) || (typeof newValue === 'object' && newValue !== null)
        ? JSON.stringify(currentValue) !== JSON.stringify(newValue)
        : currentValue !== newValue;
      
      if (hasChanged) {
        // Only include the change if it's a meaningful difference
        // Skip if both values are effectively empty/undefined
        if (!(currentValue === undefined && newValue === undefined)) {
          changes[key] = newValue;
        }
      }
    });
    
    return changes;
  };

  const handleSubmit = async () => {
    try {
      const suggestedChanges = getSuggestedChanges();
      
      if (Object.keys(suggestedChanges).length === 0) {
        toast({
          title: "No changes detected",
          description: "Please make changes before submitting.",
        });
        return;
      }

      if (hasDirectEditAccess) {
        // Direct update for assigned managers
        await directUpdateFund(fund.id, suggestedChanges);
        toast({
          title: "Fund Updated!",
          description: "Your changes have been saved. Please allow up to 10 minutes for updates to be reflected on the public fund profile.",
        });
      } else {
        // Suggestion workflow for non-assigned users
        await submitFundEditSuggestion(
          fund.id,
          suggestedChanges,
          getCurrentValues()
        );
        toast({
          title: "Suggestion submitted!",
          description: "Thank you for your edit suggestion! We will review it and notify you by email once it's processed.",
        });
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting changes:', error);
      toast({
        title: "Submission failed",
        description: hasDirectEditAccess 
          ? "Failed to update fund. Please try again."
          : "Failed to submit edit suggestion. Please try again.",
        variant: "destructive",
      });
    }
  };

  const hasChanges = Object.keys(getSuggestedChanges()).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {checkingPermission ? 'Edit Fund Information' : hasDirectEditAccess ? 'Edit Fund' : 'Suggest Fund Edit'}
          </DialogTitle>
          <DialogDescription>
            {checkingPermission 
              ? `Loading permissions for ${fund.name}...`
              : hasDirectEditAccess 
                ? `Edit ${fund.name}. Your changes will be published immediately.`
                : `Suggest changes to ${fund.name}. All changes will be reviewed before being applied.`
            }
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
        <Tabs defaultValue="basics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50 rounded-lg">
            <TabsTrigger value="basics" className="flex items-center gap-2 text-sm font-medium py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Building2 className="h-4 w-4" />
              Fund Basics
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-2 text-sm font-medium py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Settings className="h-4 w-4" />
              Structure & Terms
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2 text-sm font-medium py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <TrendingUp className="h-4 w-4" />
              Performance & Team
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-2 text-sm font-medium py-3 px-4 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <FileText className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

            <TabsContent value="basics" className="space-y-6 mt-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  
                  <div>
                    <Label htmlFor="name">Fund Name</Label>
                    <Input
                      id="name"
                      value={fund.name}
                      disabled
                      className="bg-muted text-muted-foreground"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Fund name cannot be edited</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Short Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="detailedDescription">Detailed Description</Label>
                    <Textarea
                      id="detailedDescription"
                      value={formData.detailedDescription}
                      onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Investment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Investment Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minimumInvestment">Minimum Investment (€)</Label>
                    <Input
                      id="minimumInvestment"
                      type="number"
                      value={formData.minimumInvestment}
                      onChange={(e) => handleInputChange('minimumInvestment', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fundSize">Fund Size (€M)</Label>
                    <Input
                      id="fundSize"
                      type="number"
                      value={formData.fundSize}
                      onChange={(e) => handleInputChange('fundSize', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="returnTarget">Return Target</Label>
                    <Input
                      id="returnTarget"
                      placeholder="e.g., 8-10% annually"
                      value={formData.returnTarget}
                      onChange={(e) => handleInputChange('returnTarget', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="term">Fund Term (years)</Label>
                    <Input
                      id="term"
                      type="number"
                      value={formData.term}
                      onChange={(e) => handleInputChange('term', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="managementFee">Management Fee (%)</Label>
                    <Input
                      id="managementFee"
                      type="number"
                      step="0.1"
                      value={formData.managementFee}
                      onChange={(e) => handleInputChange('managementFee', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter 0 only if this is genuinely a no-fee fund. Leave empty if unknown.
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="performanceFee">Performance Fee</Label>
                    <Input
                      id="performanceFee"
                      type="text"
                      value={formData.performanceFee}
                      onChange={(e) => handleInputChange('performanceFee', e.target.value)}
                      placeholder="e.g., 20% or 20% above 5% net"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter a percentage (e.g., 20%) or complex structure (e.g., 20% above 5% net)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="hurdleRate">Performance Fee Hurdle (%)</Label>
                    <Input
                      id="hurdleRate"
                      type="number"
                      step="0.1"
                      value={formData.hurdleRate}
                      onChange={(e) => handleInputChange('hurdleRate', e.target.value)}
                      placeholder="e.g., 8.0"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Minimum return required before performance fees apply
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="subscriptionFee">Subscription Fee (%)</Label>
                    <Input
                      id="subscriptionFee"
                      type="number"
                      step="0.1"
                      value={formData.subscriptionFee}
                      onChange={(e) => handleInputChange('subscriptionFee', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter 0 if there's no subscription fee. Leave empty if undisclosed.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="redemptionFee">Redemption Fee (%)</Label>
                    <Input
                      id="redemptionFee"
                      type="number"
                      step="0.1"
                      value={formData.redemptionFee}
                      onChange={(e) => handleInputChange('redemptionFee', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter 0 if there's no redemption fee. Leave empty if undisclosed.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Fund Characteristics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fund Characteristics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fundType">Fund Type</Label>
                    <Select
                      value={
                        formData.tags?.includes('Open Ended' as any) ? 'open-ended' :
                        formData.tags?.includes('Closed Ended' as any) ? 'closed-ended' : ''
                      }
                      onValueChange={(value) => {
                        const updatedTags = [...(formData.tags || [])];
                        // Remove existing fund type tags
                        const filteredTags = updatedTags.filter(tag => 
                          tag !== 'Open Ended' && tag !== 'Closed Ended'
                        );
                        
                        // Add the selected fund type tag
                        if (value === 'open-ended') {
                          filteredTags.push('Open Ended' as any);
                        } else if (value === 'closed-ended') {
                          filteredTags.push('Closed Ended' as any);
                        }
                        
                        setFormData(prev => ({ ...prev, tags: filteredTags }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fund type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open-ended">Open-Ended</SelectItem>
                        <SelectItem value="closed-ended">Closed-End</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="category">Fund Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="websiteUrl">Website URL</Label>
                    <Input
                      id="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="established">Established Year</Label>
                    <Input
                      id="established"
                      type="number"
                      value={formData.established}
                      onChange={(e) => handleInputChange('established', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="regulatedBy">Regulated By</Label>
                    <Input
                      id="regulatedBy"
                      value={formData.regulatedBy}
                      onChange={(e) => handleInputChange('regulatedBy', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="managerName">Manager Name</Label>
                    <Input
                      id="managerName"
                      value={formData.managerName}
                      onChange={(e) => handleInputChange('managerName', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Social Media Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Social Media Links</h3>
                <p className="text-sm text-muted-foreground">
                  Add links to your fund's social media profiles.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="youtubeUrl">YouTube</Label>
                    <Input
                      id="youtubeUrl"
                      type="url"
                      placeholder="https://youtube.com/@yourfund"
                      value={formData.youtubeUrl || ''}
                      onChange={(e) => handleInputChange('youtubeUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagramUrl">Instagram</Label>
                    <Input
                      id="instagramUrl"
                      type="url"
                      placeholder="https://instagram.com/yourfund"
                      value={formData.instagramUrl || ''}
                      onChange={(e) => handleInputChange('instagramUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tiktokUrl">TikTok</Label>
                    <Input
                      id="tiktokUrl"
                      type="url"
                      placeholder="https://tiktok.com/@yourfund"
                      value={formData.tiktokUrl || ''}
                      onChange={(e) => handleInputChange('tiktokUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="facebookUrl">Facebook</Label>
                    <Input
                      id="facebookUrl"
                      type="url"
                      placeholder="https://facebook.com/yourfund"
                      value={formData.facebookUrl || ''}
                      onChange={(e) => handleInputChange('facebookUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitterUrl">X (Twitter)</Label>
                    <Input
                      id="twitterUrl"
                      type="url"
                      placeholder="https://x.com/yourfund"
                      value={formData.twitterUrl || ''}
                      onChange={(e) => handleInputChange('twitterUrl', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      placeholder="https://linkedin.com/company/yourfund"
                      value={formData.linkedinUrl || ''}
                      onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="youtubeVideoUrl">Featured Video URL</Label>
                    <Input
                      id="youtubeVideoUrl"
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      value={formData.youtubeVideoUrl || ''}
                      onChange={(e) => handleInputChange('youtubeVideoUrl', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Paste a YouTube video URL to embed on your fund page
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="newsRssFeedUrl">News RSS Feed URL</Label>
                    <Input
                      id="newsRssFeedUrl"
                      type="url"
                      placeholder="https://yoursite.com/rss.xml"
                      value={formData.newsRssFeedUrl || ''}
                      onChange={(e) => handleInputChange('newsRssFeedUrl', e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Add an RSS or Atom feed URL to display news articles on your fund page
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="structure" className="space-y-6 mt-4">
              {/* Fund Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fund Tags</h3>
                <p className="text-sm text-muted-foreground">
                  Select relevant tags that describe this fund's characteristics and investment strategy.
                </p>
                
                {/* Current Selected Tags */}
                {formData.tags && formData.tags.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Currently Selected ({formData.tags.length} tags)</Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md">
                      {formData.tags.map((tag: string) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 hover:bg-destructive/20"
                            onClick={() => {
                              const updatedTags = formData.tags.filter((t: string) => t !== tag);
                              handleInputChange('tags', updatedTags);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Available Tags */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Available Tags</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-3 border rounded-md">
                    {getAllTags(allDatabaseFunds).map((tag) => {
                      const isSelected = formData.tags?.includes(tag) || false;
                      return (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={`tag-${tag}`}
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const currentTags = formData.tags || [];
                              let updatedTags;
                              
                              if (checked) {
                                updatedTags = [...currentTags, tag];
                              } else {
                                updatedTags = currentTags.filter((t: string) => t !== tag);
                              }
                              
                              handleInputChange('tags', updatedTags);
                            }}
                          />
                          <Label 
                            htmlFor={`tag-${tag}`}
                            className="text-sm cursor-pointer hover:text-primary"
                          >
                            {tag}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Separator />
              {/* Geographic Allocation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Geographic Allocation</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('geographicAllocation', { region: '', percentage: 0 })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Region
                  </Button>
                </div>
                
                {formData.geographicAllocation.map((allocation: GeographicAllocation, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label>Region</Label>
                      <Input
                        value={allocation.region}
                        onChange={(e) => handleArrayChange('geographicAllocation', index, 'region', e.target.value)}
                        placeholder="e.g., Portugal"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Percentage</Label>
                      <Input
                        type="number"
                        value={allocation.percentage}
                        onChange={(e) => handleArrayChange('geographicAllocation', index, 'percentage', parseFloat(e.target.value) || 0)}
                        placeholder="0-100"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('geographicAllocation', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Redemption Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Redemption Terms</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="redemptionFrequency">Redemption Frequency</Label>
                    <Select
                      value={formData.redemptionTerms?.frequency || 'Not Available'}
                      onValueChange={(value) => handleNestedChange('redemptionTerms', 'frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                        <SelectItem value="End of Term">End of Term</SelectItem>
                        <SelectItem value="Not Available">Not Available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="redemptionOpen">Redemption Open</Label>
                    <Select
                      value={formData.redemptionTerms?.redemptionOpen ? 'true' : 'false'}
                      onValueChange={(value) => handleNestedChange('redemptionTerms', 'redemptionOpen', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="noticePeriod">Notice Period (days)</Label>
                    <Input
                      id="noticePeriod"
                      type="number"
                      value={formData.redemptionTerms?.noticePeriod || ''}
                      onChange={(e) => handleNestedChange('redemptionTerms', 'noticePeriod', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="earlyRedemptionFee">Early Redemption Fee (%)</Label>
                    <Input
                      id="earlyRedemptionFee"
                      type="number"
                      step="0.1"
                      value={formData.redemptionTerms?.earlyRedemptionFee || ''}
                      onChange={(e) => handleNestedChange('redemptionTerms', 'earlyRedemptionFee', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="minimumHoldingPeriod">Minimum Holding Period (months)</Label>
                    <Input
                      id="minimumHoldingPeriod"
                      type="number"
                      value={formData.redemptionTerms?.minimumHoldingPeriod || ''}
                      onChange={(e) => handleNestedChange('redemptionTerms', 'minimumHoldingPeriod', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="redemptionNotes">Additional Notes</Label>
                  <Textarea
                    id="redemptionNotes"
                    value={formData.redemptionTerms?.notes || ''}
                    onChange={(e) => handleNestedChange('redemptionTerms', 'notes', e.target.value)}
                    rows={3}
                  />
                </div>
                {/* Additional Regulatory Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Regulatory Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cmvmId">CMVM ID</Label>
                      <Input
                        id="cmvmId"
                        value={formData.cmvmId || ''}
                        onChange={(e) => handleInputChange('cmvmId', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="auditor">Auditor</Label>
                      <Input
                        id="auditor"
                        value={formData.auditor || ''}
                        onChange={(e) => handleInputChange('auditor', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="custodian">Custodian</Label>
                      <Input
                        id="custodian"
                        value={formData.custodian || ''}
                        onChange={(e) => handleInputChange('custodian', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="navFrequency">NAV Frequency</Label>
                      <Input
                        id="navFrequency"
                        value={formData.navFrequency || ''}
                        onChange={(e) => handleInputChange('navFrequency', e.target.value)}
                        placeholder="e.g., Daily, Monthly"
                      />
                    </div>

                    <div>
                      <Label htmlFor="pficStatus">PFIC Status</Label>
                      <Select
                        value={formData.pficStatus || 'Not provided'}
                        onValueChange={(value) => handleInputChange('pficStatus', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="QEF available">QEF available</SelectItem>
                          <SelectItem value="MTM only">MTM only</SelectItem>
                          <SelectItem value="Not provided">Not provided</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Golden Visa Eligibility Basis */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Golden Visa Eligibility Basis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="portugalAllocation">Portugal Allocation (%)</Label>
                      <Input
                        id="portugalAllocation"
                        type="number"
                        value={formData.eligibilityBasis?.portugalAllocation || ''}
                        onChange={(e) => handleNestedChange('eligibilityBasis', 'portugalAllocation', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="maturityYears">Maturity Years</Label>
                      <Input
                        id="maturityYears"
                        type="number"
                        value={formData.eligibilityBasis?.maturityYears || ''}
                        onChange={(e) => handleNestedChange('eligibilityBasis', 'maturityYears', e.target.value === '' ? undefined : parseFloat(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="realEstateExposure">Real Estate Exposure</Label>
                      <Select
                        value={formData.eligibilityBasis?.realEstateExposure || 'Not provided'}
                        onValueChange={(value) => handleNestedChange('eligibilityBasis', 'realEstateExposure', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="Direct">Direct</SelectItem>
                          <SelectItem value="Indirect">Indirect</SelectItem>
                          <SelectItem value="Not provided">Not provided</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="managerAttestation">Manager Attestation</Label>
                      <Select
                        value={formData.eligibilityBasis?.managerAttestation ? 'true' : 'false'}
                        onValueChange={(value) => handleNestedChange('eligibilityBasis', 'managerAttestation', value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Yes</SelectItem>
                          <SelectItem value="false">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 mt-4">
              {/* Historical Performance */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Historical Performance</h3>
                <HistoricalPerformanceEditor
                  value={formData.historicalPerformance}
                  onChange={(value) => handleInputChange('historicalPerformance', value)}
                />
              </div>

              <Separator />

              {/* Team Members */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fund Team</h3>
                <p className="text-sm text-muted-foreground">
                  Select team members from your company roster. Photos and bios are automatically synced from the company profile.
                </p>
                
                <FundTeamPicker
                  managerName={fund.managerName}
                  selectedMembers={formData.teamReferences || []}
                  onChange={handleTeamReferencesChange}
                  hasLegacyData={(fund.team || []).some((m: any) => !m.member_id || m.member_id === '')}
                />
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-6 mt-4">
              {/* Documents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Documents</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('documents', { title: '', url: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </Button>
                </div>
                
                {formData.documents.map((document: PdfDocument, index: number) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="flex-1">
                      <Label>Document Title</Label>
                      <Input
                        value={document.title}
                        onChange={(e) => handleArrayChange('documents', index, 'title', e.target.value)}
                        placeholder="e.g., Fund Prospectus"
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Document URL</Label>
                      <Input
                        value={document.url}
                        onChange={(e) => handleArrayChange('documents', index, 'url', e.target.value)}
                        placeholder="https://..."
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('documents', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>


              {/* FAQs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('faqs', { question: '', answer: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add FAQ
                  </Button>
                </div>
                
                {formData.faqs.map((faq: FAQItem, index: number) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">FAQ {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('faqs', index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label>Question</Label>
                        <Input
                          value={faq.question}
                          onChange={(e) => handleArrayChange('faqs', index, 'question', e.target.value)}
                          placeholder="Enter frequently asked question..."
                        />
                      </div>
                      <div>
                        <Label>Answer</Label>
                        <Textarea
                          value={faq.answer}
                          onChange={(e) => handleArrayChange('faqs', index, 'answer', e.target.value)}
                          rows={4}
                          placeholder="Enter detailed answer..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {formData.faqs.length === 0 && (
                  <div className="text-center p-8 text-muted-foreground">
                    <p>No FAQs added yet. Click "Add FAQ" to create the first question and answer.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            disabled={!hasChanges || loading || checkingPermission}
            className="gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {hasDirectEditAccess ? 'Publishing...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {hasDirectEditAccess ? 'Publish Changes' : 'Submit Suggestion'}
              </>
            )}
          </Button>
        </div>
        
        {hasChanges && (
          <p className="text-sm text-muted-foreground text-center">
            {Object.keys(getSuggestedChanges()).length} field(s) modified
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};