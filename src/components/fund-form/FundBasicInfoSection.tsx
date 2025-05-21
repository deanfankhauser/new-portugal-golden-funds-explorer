
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FundFormValues } from "./FundFormSchema";

type FundBasicInfoSectionProps = {
  form: UseFormReturn<FundFormValues>;
  isEditMode?: boolean;
};

const FundBasicInfoSection = ({ form, isEditMode = false }: FundBasicInfoSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Fund Identifier */}
      <FormField
        control={form.control}
        name="id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fund ID</FormLabel>
            <FormControl>
              <Input 
                placeholder="portugal-golden-fund-4" 
                {...field} 
                readOnly={isEditMode} 
                className={isEditMode ? "bg-gray-100" : ""} 
              />
            </FormControl>
            <FormDescription>
              {isEditMode 
                ? "Fund identifier cannot be changed after creation" 
                : "Unique identifier for the fund (URL friendly)"}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Fund Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fund Name</FormLabel>
            <FormControl>
              <Input placeholder="Lisboa Technology Fund" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FundBasicInfoSection;
