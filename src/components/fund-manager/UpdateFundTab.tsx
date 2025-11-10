import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save, Loader2, Plus, Trash2, Building2, TrendingUp, FileText, Settings, AlertCircle } from 'lucide-react';
import { Fund } from '@/data/types/funds';
import { useFundEditing } from '@/hooks/useFundEditing';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import HistoricalPerformanceEditor from '@/components/fund-editing/HistoricalPerformanceEditor';

interface UpdateFundTabProps {
  fund: Fund;
  canDirectEdit: boolean;
}

const UpdateFundTab: React.FC<UpdateFundTabProps> = ({ fund, canDirectEdit }) => {
  const { directUpdateFund, submitFundEditSuggestion, loading } = useFundEditing();

  const buildFormData = (f: Fund) => ({
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
    geographicAllocation: f.geographicAllocation || [],
    team: f.team || [],
    documents: f.documents || [],
    historicalPerformance: f.historicalPerformance || {},
    faqs: f.faqs || [],
    tags: f.tags || [],
    cmvmId: f.cmvmId,
    auditor: f.auditor,
    custodian: f.custodian,
    navFrequency: f.navFrequency,
    pficStatus: f.pficStatus,
    eligibilityBasis: f.eligibilityBasis,
    redemptionTerms: f.redemptionTerms,
  });

  const [formData, setFormData] = useState(buildFormData(fund));

  useEffect(() => {
    setFormData(buildFormData(fund));
  }, [fund]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    
    Object.keys(formData).forEach(key => {
      const currentValue = current[key as keyof typeof current];
      let newValue: any = formData[key as keyof typeof formData];
      
      if (['minimumInvestment', 'managementFee', 'performanceFee', 'subscriptionFee', 'redemptionFee', 'hurdleRate', 'term', 'fundSize', 'established'].includes(key)) {
        if (typeof newValue === 'string') {
          newValue = parseFloat(newValue) || 0;
        }
      }
      
      const hasChanged = JSON.stringify(currentValue) !== JSON.stringify(newValue);
      
      if (hasChanged) {
        changes[key] = newValue;
      }
    });
    
    return changes;
  };

  const handleSubmit = async () => {
    try {
      const suggestedChanges = getSuggestedChanges();
      
      if (Object.keys(suggestedChanges).length === 0) {
        toast.error('No changes detected. Please make changes before submitting.');
        return;
      }

      if (canDirectEdit) {
        await directUpdateFund(fund.id, suggestedChanges);
        toast.success('Fund updated successfully! Changes are now live.');
      } else {
        await submitFundEditSuggestion(fund.id, suggestedChanges, getCurrentValues());
        toast.success('Edit suggestion submitted! We will review it and notify you.');
      }
    } catch (error) {
      console.error('Error submitting changes:', error);
      toast.error('Failed to submit changes. Please try again.');
    }
  };

  const hasChanges = Object.keys(getSuggestedChanges()).length > 0;

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {canDirectEdit 
            ? 'You have direct edit access. Changes will be published immediately.'
            : 'Your changes will be submitted as suggestions and reviewed before being applied.'
          }
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basics" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Fund Basics
          </TabsTrigger>
          <TabsTrigger value="structure" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Structure & Terms
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update fund's core details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Structure</CardTitle>
              <CardDescription>Manage fund fees and charges</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="managementFee">Management Fee (%)</Label>
                  <Input
                    id="managementFee"
                    type="number"
                    step="0.01"
                    value={formData.managementFee}
                    onChange={(e) => handleInputChange('managementFee', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="performanceFee">Performance Fee (%)</Label>
                  <Input
                    id="performanceFee"
                    type="number"
                    step="0.01"
                    value={formData.performanceFee}
                    onChange={(e) => handleInputChange('performanceFee', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Performance</CardTitle>
              <CardDescription>Update fund performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <HistoricalPerformanceEditor
                value={formData.historicalPerformance}
                onChange={(value) => handleInputChange('historicalPerformance', value)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Resources</CardTitle>
              <CardDescription>Manage fund documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Document management coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button
          onClick={handleSubmit}
          disabled={!hasChanges || loading}
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {canDirectEdit ? 'Save Changes' : 'Submit Suggestion'}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default UpdateFundTab;
