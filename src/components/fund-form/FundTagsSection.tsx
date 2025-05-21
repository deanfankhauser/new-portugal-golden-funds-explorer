
import React from 'react';
import { Label } from "@/components/ui/label";
import { FormDescription } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { FundFormValues, FundTag, availableTags } from "./FundFormSchema";

type FundTagsSectionProps = {
  form: UseFormReturn<FundFormValues>;
  selectedTags: FundTag[];
  onTagToggle: (tag: FundTag) => void;
};

const FundTagsSection = ({ form, selectedTags, onTagToggle }: FundTagsSectionProps) => {
  return (
    <div className="space-y-2">
      <Label>Fund Tags</Label>
      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => (
          <button
            type="button"
            key={tag}
            className={`px-3 py-1 text-sm rounded-full border ${selectedTags.includes(tag) ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      <FormDescription>
        Select all tags that apply to this fund
      </FormDescription>
    </div>
  );
};

export default FundTagsSection;
