
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FundFormValues, fundFormSchema, FundTag } from "./fund-form/FundFormSchema";

import FundBasicInfoSection from './fund-form/FundBasicInfoSection';
import FundDescriptionSection from './fund-form/FundDescriptionSection';
import FundCategorySection from './fund-form/FundCategorySection';
import FundTagsSection from './fund-form/FundTagsSection';
import FundInvestmentSection from './fund-form/FundInvestmentSection';
import FundFeeSection from './fund-form/FundFeeSection';
import FundManagementSection from './fund-form/FundManagementSection';
import FundDetailsSection from './fund-form/FundDetailsSection';
import FundFormActions from './fund-form/FundFormActions';

export type { FundFormValues };
export { fundFormSchema };

export interface FundFormProps {
  defaultValues: FundFormValues;
  onSubmit: (data: FundFormValues) => void;
  submitButtonText: string;
  isEditMode?: boolean;
}

const FundForm: React.FC<FundFormProps> = ({ 
  defaultValues, 
  onSubmit, 
  submitButtonText, 
  isEditMode = false 
}) => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState<FundTag[]>(defaultValues.tags as FundTag[]);

  const form = useForm<FundFormValues>({
    resolver: zodResolver(fundFormSchema),
    defaultValues,
  });

  // Update selectedTags when defaultValues change (important for edit mode)
  useEffect(() => {
    setSelectedTags(defaultValues.tags as FundTag[]);
  }, [defaultValues.tags]);

  const handleTagToggle = (tag: FundTag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    
    // Update the form value for tags
    form.setValue("tags", newSelectedTags, {
      shouldValidate: true
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FundBasicInfoSection form={form} isEditMode={isEditMode} />
          <FundDescriptionSection form={form} />
          <FundCategorySection form={form} />
          <FundTagsSection 
            form={form} 
            selectedTags={selectedTags} 
            onTagToggle={handleTagToggle} 
          />
          <FundInvestmentSection form={form} />
          <FundFeeSection form={form} />
          <FundManagementSection form={form} />
          <FundDetailsSection form={form} />
          <FundFormActions 
            onCancel={() => navigate('/admin')} 
            submitButtonText={submitButtonText} 
          />
        </form>
      </Form>
    </div>
  );
};

export default FundForm;
