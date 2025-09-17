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
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { Fund, GeographicAllocation, TeamMember, PdfDocument, RedemptionTerms } from '@/data/types/funds';
import { useFundEditing } from '@/hooks/useFundEditing';
import { toast } from 'sonner';

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
  const { submitFundEditSuggestion, loading } = useFundEditing();
const buildFormData = (f: Fund) => ({
  // Basic information
  description: f.description,
  detailedDescription: f.detailedDescription,
  managerName: f.managerName,
  minimumInvestment: f.minimumInvestment.toString(),
  managementFee: f.managementFee.toString(),
  performanceFee: f.performanceFee != null ? f.performanceFee.toString() : '',
  subscriptionFee: f.subscriptionFee != null ? f.subscriptionFee.toString() : '',
  redemptionFee: f.redemptionFee != null ? f.redemptionFee.toString() : '',
  term: f.term.toString(),
  category: f.category,
  returnTarget: f.returnTarget,
  websiteUrl: f.websiteUrl || '',
  location: f.location,
  fundSize: f.fundSize.toString(),
  established: f.established.toString(),
  regulatedBy: f.regulatedBy,
  // Geographic allocation
  geographicAllocation: f.geographicAllocation || [],
  // Team members
  team: f.team || [],
  // Documents
  documents: f.documents || [],
  // Redemption terms
  redemptionTerms: f.redemptionTerms ? { ...f.redemptionTerms } : {
    frequency: 'Not Available' as const,
    redemptionOpen: false,
    noticePeriod: undefined,
    earlyRedemptionFee: undefined,
    minimumHoldingPeriod: undefined,
    notes: ''
  },
  // Regulatory info
  cmvmId: f.cmvmId || '',
  auditor: f.auditor || '',
  custodian: f.custodian || '',
  navFrequency: f.navFrequency || '',
  pficStatus: f.pficStatus || 'Not provided',
  eligibilityBasis: f.eligibilityBasis ? { ...f.eligibilityBasis } : {
    portugalAllocation: undefined,
    maturityYears: undefined,
    realEstateExposure: 'Not provided' as const,
    managerAttestation: false
  }
});
const [formData, setFormData] = useState(buildFormData(fund));

useEffect(() => {
  if (open) {
    setFormData(buildFormData(fund));
  }
}, [open, fund]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (field: string, subField: string, value: any) => {
    setFormData(prev => {
      const fieldValue = prev[field as keyof typeof prev];
      if (typeof fieldValue === 'object' && fieldValue !== null && !Array.isArray(fieldValue)) {
        return {
          ...prev,
          [field]: {
            ...fieldValue,
            [subField]: value
          }
        };
      }
      return prev;
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

  const getCurrentValues = () => ({
    description: fund.description,
    detailedDescription: fund.detailedDescription,
    managerName: fund.managerName,
    minimumInvestment: fund.minimumInvestment,
    managementFee: fund.managementFee,
    performanceFee: fund.performanceFee,
    subscriptionFee: fund.subscriptionFee,
    redemptionFee: fund.redemptionFee,
    term: fund.term,
    category: fund.category,
    returnTarget: fund.returnTarget,
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
    
    Object.keys(formData).forEach(key => {
      const currentValue = normalizeValue(current[key as keyof typeof current]);
      let newValue: any = formData[key as keyof typeof formData];
      
      // Handle numeric fields
      if (['minimumInvestment', 'managementFee', 'performanceFee', 'subscriptionFee', 'redemptionFee', 'term', 'fundSize', 'established'].includes(key)) {
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
        // Only include the change if the new value is not just empty/undefined when current is also empty/undefined
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
        toast.info("No changes detected");
        return;
      }

      await submitFundEditSuggestion(
        fund.id,
        suggestedChanges,
        getCurrentValues()
      );
      
      toast.success("Thank you for your edit suggestion! We will review it and notify you by email once it's processed.");
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting edit suggestion:', error);
      toast.error("Failed to submit edit suggestion. Please try again.");
    }
  };

  const hasChanges = Object.keys(getSuggestedChanges()).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Fund Information</DialogTitle>
          <DialogDescription>
            Suggest changes to {fund.name}. All changes will be reviewed before being applied.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] pr-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="structure">Structure</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-4">
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
                  </div>
                  
                  <div>
                    <Label htmlFor="performanceFee">Performance Fee (%)</Label>
                    <Input
                      id="performanceFee"
                      type="number"
                      step="0.1"
                      value={formData.performanceFee}
                      onChange={(e) => handleInputChange('performanceFee', e.target.value)}
                    />
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
                </div>
              </div>

              <Separator />

              {/* Fund Characteristics */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fund Characteristics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </TabsContent>

            <TabsContent value="structure" className="space-y-6 mt-4">
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
                      value={formData.redemptionTerms.frequency}
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
                      value={formData.redemptionTerms.redemptionOpen ? 'true' : 'false'}
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
                      value={formData.redemptionTerms.noticePeriod || ''}
                      onChange={(e) => handleNestedChange('redemptionTerms', 'noticePeriod', parseFloat(e.target.value) || undefined)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="earlyRedemptionFee">Early Redemption Fee (%)</Label>
                    <Input
                      id="earlyRedemptionFee"
                      type="number"
                      step="0.1"
                      value={formData.redemptionTerms.earlyRedemptionFee || ''}
                      onChange={(e) => handleNestedChange('redemptionTerms', 'earlyRedemptionFee', parseFloat(e.target.value) || undefined)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="minimumHoldingPeriod">Minimum Holding Period (months)</Label>
                    <Input
                      id="minimumHoldingPeriod"
                      type="number"
                      value={formData.redemptionTerms.minimumHoldingPeriod || ''}
                      onChange={(e) => handleNestedChange('redemptionTerms', 'minimumHoldingPeriod', parseFloat(e.target.value) || undefined)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="redemptionNotes">Additional Notes</Label>
                  <Textarea
                    id="redemptionNotes"
                    value={formData.redemptionTerms.notes || ''}
                    onChange={(e) => handleNestedChange('redemptionTerms', 'notes', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Team Members</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addArrayItem('team', { name: '', position: '', bio: '', linkedinUrl: '' })}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>
                
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
                        <Label>Bio</Label>
                        <Textarea
                          value={member.bio || ''}
                          onChange={(e) => handleArrayChange('team', index, 'bio', e.target.value)}
                          rows={3}
                          placeholder="Professional background and experience"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6 mt-4">
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
            </TabsContent>

            <TabsContent value="regulatory" className="space-y-6 mt-4">
              {/* Regulatory Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Regulatory Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cmvmId">CMVM ID</Label>
                    <Input
                      id="cmvmId"
                      value={formData.cmvmId}
                      onChange={(e) => handleInputChange('cmvmId', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="auditor">Auditor</Label>
                    <Input
                      id="auditor"
                      value={formData.auditor}
                      onChange={(e) => handleInputChange('auditor', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="custodian">Custodian</Label>
                    <Input
                      id="custodian"
                      value={formData.custodian}
                      onChange={(e) => handleInputChange('custodian', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="navFrequency">NAV Frequency</Label>
                    <Input
                      id="navFrequency"
                      value={formData.navFrequency}
                      onChange={(e) => handleInputChange('navFrequency', e.target.value)}
                      placeholder="e.g., Daily, Monthly"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pficStatus">PFIC Status</Label>
                    <Select
                      value={formData.pficStatus}
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

              {/* Eligibility Basis */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Golden Visa Eligibility Basis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="portugalAllocation">Portugal Allocation (%)</Label>
                    <Input
                      id="portugalAllocation"
                      type="number"
                      value={formData.eligibilityBasis.portugalAllocation || ''}
                      onChange={(e) => handleNestedChange('eligibilityBasis', 'portugalAllocation', parseFloat(e.target.value) || undefined)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="maturityYears">Maturity Years</Label>
                    <Input
                      id="maturityYears"
                      type="number"
                      value={formData.eligibilityBasis.maturityYears || ''}
                      onChange={(e) => handleNestedChange('eligibilityBasis', 'maturityYears', parseFloat(e.target.value) || undefined)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="realEstateExposure">Real Estate Exposure</Label>
                    <Select
                      value={formData.eligibilityBasis.realEstateExposure}
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
                      value={formData.eligibilityBasis.managerAttestation ? 'true' : 'false'}
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
            </TabsContent>
          </Tabs>
        </ScrollArea>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          
          <Button 
            onClick={handleSubmit} 
            disabled={!hasChanges || loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Submit Changes
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