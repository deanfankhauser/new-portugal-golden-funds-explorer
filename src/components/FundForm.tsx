
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
  // Properly cast the tags array to FundTag[] type
  const initialTags = Array.isArray(defaultValues.tags) 
    ? defaultValues.tags.filter((tag): tag is FundTag => typeof tag === 'string') 
    : [];
  const [selectedTags, setSelectedTags] = useState<FundTag[]>(initialTags);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FundFormValues>({
    resolver: zodResolver(fundFormSchema),
    defaultValues,
  });

  // Update selectedTags when defaultValues change (important for edit mode)
  useEffect(() => {
    if (defaultValues.tags) {
      // Cast the tags array to FundTag[] type
      const updatedTags = Array.isArray(defaultValues.tags)
        ? defaultValues.tags.filter((tag): tag is FundTag => typeof tag === 'string')
        : [];
      setSelectedTags(updatedTags);
    }
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

  const handleSubmit = async (data: FundFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
            isSubmitting={isSubmitting}
          />
        </form>
      </Form>
    </div>
  );
};

export default FundForm;
