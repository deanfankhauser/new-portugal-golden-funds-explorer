import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Loader2, Plus, Trash2, X, Building2, TrendingUp, FileText, Settings, AlertCircle } from 'lucide-react';
import { Fund, GeographicAllocation, TeamMember, PdfDocument, FAQItem } from '@/data/types/funds';
import { getAllTags } from '@/data/services/tags-service';
import { useFundEditing } from '@/hooks/useFundEditing';
import { uploadTeamMemberPhoto, deleteTeamMemberPhoto } from '@/utils/imageUpload';
import { useToast } from '@/hooks/use-toast';
import HistoricalPerformanceEditor from '../fund-editing/HistoricalPerformanceEditor';

interface UpdateFundTabProps {
  fund: Fund;
  canDirectEdit: boolean;
}

const UpdateFundTab: React.FC<UpdateFundTabProps> = ({ fund, canDirectEdit }) => {
  const { directUpdateFund, submitFundEditSuggestion, loading } = useFundEditing();
  const { toast } = useToast();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const buildFormData = (f: Fund) => ({
    description: f.description ?? '',
    detailedDescription: f.detailedDescription ?? '',
    managerName: f.managerName ?? '',
    minimumInvestment: f.minimumInvestment != null ? f.minimumInvestment.toString() : '0',
    managementFee: f.managementFee != null ? f.managementFee.toString() : '0',
    performanceFee: f.performanceFee != null ? f.performanceFee.toString() : '',
    subscriptionFee: f.subscriptionFee != null ? f.subscriptionFee.toString() : '',
    redemptionFee: f.redemptionFee != null ? f.redemptionFee.toString() : '',
    hurdleRate: f.hurdleRate != null ? f.hurdleRate.toString() : '',
    term: f.term != null ? f.term.toString() : '0',
    category: f.category ?? '',
    websiteUrl: f.websiteUrl ?? '',
    location: f.location ?? '',
    fundSize: f.fundSize != null ? f.fundSize.toString() : '0',
    established: f.established != null ? f.established.toString() : new Date().getFullYear().toString(),
    regulatedBy: f.regulatedBy ?? '',
    geographicAllocation: f.geographicAllocation ?? [],
    team: f.team?.map(member => ({ ...member, photoUrl: member.photoUrl || '' })) ?? [],
    documents: f.documents ?? [],
    historicalPerformance: f.historicalPerformance ?? {},
    faqs: f.faqs ?? [],
    tags: f.tags ?? [],
    cmvmId: f.cmvmId ?? '',
    auditor: f.auditor ?? '',
    custodian: f.custodian ?? '',
    navFrequency: f.navFrequency ?? '',
    pficStatus: f.pficStatus ?? '',
    eligibilityBasis: f.eligibilityBasis ?? null,
    redemptionTerms: f.redemptionTerms ?? null,
  });

  const [formData, setFormData] = useState(buildFormData(fund));

  useEffect(() => {
    setFormData(buildFormData(fund));
  }, [fund]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (field: string, subField: string, value: any) => {
    setFormData(prev => {
      const fieldValue = prev[field as keyof typeof prev];
      
      if (!fieldValue || typeof fieldValue !== 'object' || Array.isArray(fieldValue)) {
        return {
          ...prev,
          [field]: { [subField]: value }
        };
      }
      
      return {
        ...prev,
        [field]: { ...fieldValue, [subField]: value }
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

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>, memberIndex: number) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingPhoto(true);
    try {
      const teamMember = formData.team[memberIndex];
      const photoUrl = await uploadTeamMemberPhoto(file, teamMember.name || `member-${memberIndex}`);
      handleArrayChange('team', memberIndex, 'photoUrl', photoUrl);
      toast({
        title: "Photo uploaded",
        description: "Profile picture has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleRemoveProfilePicture = async (memberIndex: number) => {
    const teamMember = formData.team[memberIndex];
    if (teamMember.photoUrl) {
      try {
        await deleteTeamMemberPhoto(teamMember.photoUrl);
        handleArrayChange('team', memberIndex, 'photoUrl', '');
        toast({
          title: "Photo removed",
          description: "Profile picture has been removed.",
        });
      } catch (error) {
        console.error('Delete error:', error);
        toast({
          title: "Failed to remove photo",
          description: "Photo removal failed. Please try again.",
          variant: "destructive",
        });
      }
    }
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
    websiteUrl: fund.websiteUrl,
    location: fund.location,
    fundSize: fund.fundSize,
    established: fund.established,
    regulatedBy: fund.regulatedBy,
    geographicAllocation: fund.geographicAllocation,
    team: fund.team,
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
  });

  const getSuggestedChanges = () => {
    const current = getCurrentValues();
    const changes: Record<string, any> = {};
    
    const normalizeValue = (value: any): any => {
      if (value === '' || value === null || value === undefined) return undefined;
      return value;
    };
    
    // Special handling for array comparison - sort before comparing
    const compareArrays = (arr1: any[], arr2: any[]): boolean => {
      if (arr1.length !== arr2.length) return false;
      
      // For simple arrays (like tags), sort and compare
      if (arr1.every(item => typeof item === 'string')) {
        const sorted1 = [...arr1].sort();
        const sorted2 = [...arr2].sort();
        return JSON.stringify(sorted1) === JSON.stringify(sorted2);
      }
      
      // For complex arrays, use JSON comparison
      return JSON.stringify(arr1) === JSON.stringify(arr2);
    };
    
    console.log('🔍 [getSuggestedChanges] Starting change detection');
    console.log('Current fund data:', current);
    console.log('Form data:', formData);
    
    Object.keys(formData).forEach(key => {
      const currentValue = normalizeValue(current[key as keyof typeof current]);
      let newValue: any = formData[key as keyof typeof formData];
      
      if (['minimumInvestment', 'managementFee', 'performanceFee', 'subscriptionFee', 'redemptionFee', 'hurdleRate', 'term', 'fundSize', 'established'].includes(key)) {
        if (typeof newValue === 'string') {
          newValue = parseFloat(newValue) || 0;
        }
      } else {
        newValue = normalizeValue(newValue);
      }
      
      let hasChanged = false;
      
      // Special handling for arrays
      if (Array.isArray(currentValue) && Array.isArray(newValue)) {
        hasChanged = !compareArrays(currentValue, newValue);
        
        if (key === 'tags') {
          console.log('🏷️ [Tags] Comparison:', {
            currentTags: currentValue,
            newTags: newValue,
            hasChanged,
            currentSorted: [...currentValue].sort(),
            newSorted: [...newValue].sort()
          });
        }
      } else if ((typeof currentValue === 'object' && currentValue !== null) || 
                 (typeof newValue === 'object' && newValue !== null)) {
        hasChanged = JSON.stringify(currentValue) !== JSON.stringify(newValue);
      } else {
        hasChanged = currentValue !== newValue;
      }
      
      if (hasChanged) {
        if (!(currentValue === undefined && newValue === undefined)) {
          changes[key] = newValue;
          console.log(`✏️ Change detected in "${key}":`, {
            from: currentValue,
            to: newValue
          });
        }
      }
    });
    
    console.log('📋 Final changes object:', changes);
    console.log(`Total fields changed: ${Object.keys(changes).length}`);
    
    return changes;
  };

  const handleSubmit = async () => {
    try {
      console.log('🚀 [handleSubmit] Starting submission...');
      const suggestedChanges = getSuggestedChanges();
      
      console.log('📊 [handleSubmit] Suggested changes:', suggestedChanges);
      
      if (Object.keys(suggestedChanges).length === 0) {
        console.warn('⚠️ [handleSubmit] No changes detected');
        toast({
          title: "No changes detected",
          description: "Please make changes before submitting.",
        });
        return;
      }

      if (canDirectEdit) {
        console.log('✅ [handleSubmit] User has direct edit permission, updating fund...');
        await directUpdateFund(fund.id, suggestedChanges);
        toast({
          title: "Fund Updated!",
          description: "Your changes have been published and are now live.",
        });
      } else {
        console.log('📝 [handleSubmit] Submitting as suggestion...');
        await submitFundEditSuggestion(fund.id, suggestedChanges, getCurrentValues());
        toast({
          title: "Suggestion submitted!",
          description: "Thank you for your edit suggestion! We will review it and notify you by email once it's processed.",
        });
      }
    } catch (error) {
      console.error('❌ [handleSubmit] Error submitting changes:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      toast({
        title: "Submission failed",
        description: canDirectEdit 
          ? `Failed to update fund: ${error instanceof Error ? error.message : 'Unknown error'}`
          : "Failed to submit edit suggestion. Please try again.",
        variant: "destructive",
      });
    }
  };

  const hasChanges = Object.keys(getSuggestedChanges()).length > 0;

  return (
    <div className="space-y-6">
      <Alert variant={canDirectEdit ? "info" : "default"}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {canDirectEdit 
            ? "You have direct edit access. Your changes will be published immediately."
            : "You can suggest edits to this fund. All changes will be reviewed before being applied."
          }
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted/50 rounded-lg">
          <TabsTrigger value="basics" className="flex items-center gap-2 text-sm font-medium py-3 px-4">
            <Building2 className="h-4 w-4" />
            Fund Basics
          </TabsTrigger>
          <TabsTrigger value="structure" className="flex items-center gap-2 text-sm font-medium py-3 px-4">
            <Settings className="h-4 w-4" />
            Structure & Terms
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2 text-sm font-medium py-3 px-4">
            <TrendingUp className="h-4 w-4" />
            Performance & Team
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2 text-sm font-medium py-3 px-4">
            <FileText className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Investment Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Enter a percentage (e.g., 20%) or complex structure
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fund Characteristics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fundType">Fund Type</Label>
                <Select
                  value={
                    formData.tags?.includes('Open Ended' as any) ? 'open-ended' :
                    formData.tags?.includes('Closed Ended' as any) ? 'closed-ended' : ''
                  }
                  onValueChange={(value) => {
                    const updatedTags = [...(formData.tags || [])];
                    const filteredTags = updatedTags.filter(tag => 
                      tag !== 'Open Ended' && tag !== 'Closed Ended'
                    );
                    
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fund Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select relevant tags that describe this fund's characteristics and investment strategy.
              </p>
              
              {formData.tags && formData.tags.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Currently Selected ({formData.tags.length} tags)</Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/30 rounded-md">
                    {formData.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
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
              
              <div className="space-y-3">
                <Label className="text-sm font-medium">Available Tags</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-3 border rounded-md">
                  {getAllTags().map((tag) => {
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Geographic Allocation</CardTitle>
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
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Redemption Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regulatory Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Golden Visa Eligibility Basis</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <HistoricalPerformanceEditor
                value={formData.historicalPerformance}
                onChange={(value) => handleInputChange('historicalPerformance', value)}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Team Members</CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem('team', { name: '', position: '', bio: '', linkedinUrl: '', photoUrl: '' })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.team.map((member: TeamMember, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Team Member {index + 1}</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeArrayItem('team', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => handleArrayChange('team', index, 'name', e.target.value)}
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        value={member.position}
                        onChange={(e) => handleArrayChange('team', index, 'position', e.target.value)}
                        placeholder="Job title"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>LinkedIn URL</Label>
                      <Input
                        value={member.linkedinUrl || ''}
                        onChange={(e) => handleArrayChange('team', index, 'linkedinUrl', e.target.value)}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Profile Picture</Label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProfilePictureUpload(e, index)}
                          className="hidden"
                          id={`photo-upload-${index}`}
                        />
                        <div className="flex items-center space-x-4">
                          {member.photoUrl && (
                            <img 
                              src={member.photoUrl} 
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover border"
                            />
                          )}
                          <div className="space-y-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => document.getElementById(`photo-upload-${index}`)?.click()}
                              disabled={isUploadingPhoto}
                            >
                              {isUploadingPhoto ? 'Uploading...' : (member.photoUrl ? 'Change Photo' : 'Upload Photo')}
                            </Button>
                            {member.photoUrl && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveProfilePicture(index)}
                              >
                                Remove Photo
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="flex items-center justify-between">
                        <Label>Bio</Label>
                        <span className={`text-xs ${(member.bio || '').length > 120 ? 'text-destructive' : (member.bio || '').length > 100 ? 'text-warning' : 'text-muted-foreground'}`}>
                          {(member.bio || '').length}/140
                        </span>
                      </div>
                      <Textarea
                        value={member.bio || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value.length <= 140) {
                            handleArrayChange('team', index, 'bio', value);
                          }
                        }}
                        rows={3}
                        placeholder="Professional background and experience (max 140 characters)"
                        maxLength={140}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documents</CardTitle>
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
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Frequently Asked Questions</CardTitle>
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
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button 
          onClick={handleSubmit} 
          disabled={!hasChanges || loading}
          className="gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {canDirectEdit ? 'Publishing...' : 'Submitting...'}
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {canDirectEdit ? 'Publish Changes' : 'Submit Suggestion'}
            </>
          )}
        </Button>
      </div>
      
      {hasChanges && (
        <p className="text-sm text-muted-foreground text-center">
          {Object.keys(getSuggestedChanges()).length} field(s) modified
        </p>
      )}
    </div>
  );
};

export default UpdateFundTab;
