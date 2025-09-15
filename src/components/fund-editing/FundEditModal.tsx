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
import { Save, Loader2 } from 'lucide-react';
import { Fund } from '@/data/funds';
import { useFundEditing } from '@/hooks/useFundEditing';

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
  description: f.description,
  detailedDescription: f.detailedDescription,
  managerName: f.managerName,
  minimumInvestment: f.minimumInvestment.toString(),
  managementFee: f.managementFee.toString(),
  performanceFee: f.performanceFee != null ? f.performanceFee.toString() : '',
  term: f.term.toString(),
  category: f.category,
  returnTarget: f.returnTarget,
  websiteUrl: f.websiteUrl || '',
  location: f.location,
});
const [formData, setFormData] = useState(buildFormData(fund));

useEffect(() => {
  if (open) {
    setFormData(buildFormData(fund));
  }
}, [open, fund]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getCurrentValues = () => ({
    description: fund.description,
    detailedDescription: fund.detailedDescription,
    managerName: fund.managerName,
    minimumInvestment: fund.minimumInvestment,
    managementFee: fund.managementFee,
    performanceFee: fund.performanceFee,
    term: fund.term,
    category: fund.category,
    returnTarget: fund.returnTarget,
    websiteUrl: fund.websiteUrl,
    location: fund.location,
  });

  const getSuggestedChanges = () => {
    const current = getCurrentValues();
    const changes: Record<string, any> = {};
    
    Object.keys(formData).forEach(key => {
      const currentValue = current[key as keyof typeof current];
      const newValue = key.includes('Fee') || key === 'minimumInvestment' || key === 'term'
        ? parseFloat(formData[key as keyof typeof formData]) || 0
        : formData[key as keyof typeof formData];
      
      if (currentValue !== newValue) {
        changes[key] = newValue;
      }
    });
    
    return changes;
  };

  const handleSubmit = async () => {
    try {
      const suggestedChanges = getSuggestedChanges();
      
      if (Object.keys(suggestedChanges).length === 0) {
        return;
      }

      await submitFundEditSuggestion(
        fund.id,
        suggestedChanges,
        getCurrentValues()
      );
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting edit suggestion:', error);
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
          <div className="space-y-6">
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
                  <Label htmlFor="returnTarget">Return Target</Label>
                  <Input
                    id="returnTarget"
                    placeholder="e.g., 8-10% annually"
                    value={formData.returnTarget}
                    onChange={(e) => handleInputChange('returnTarget', e.target.value)}
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
                  <Label htmlFor="term">Fund Term (years)</Label>
                  <Input
                    id="term"
                    type="number"
                    value={formData.term}
                    onChange={(e) => handleInputChange('term', e.target.value)}
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
              </div>
            </div>

            <Separator />

            {/* Manager Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Manager Information</h3>
              
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