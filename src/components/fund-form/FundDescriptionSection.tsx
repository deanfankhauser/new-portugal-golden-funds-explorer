
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FundFormValues } from "./FundFormSchema";

type FundDescriptionSectionProps = {
  form: UseFormReturn<FundFormValues>;
};

const FundDescriptionSection = ({ form }: FundDescriptionSectionProps) => {
  return (
    <>
      {/* Fund Short Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short Description</FormLabel>
            <FormControl>
              <Input placeholder="A brief description of the fund" {...field} />
            </FormControl>
            <FormDescription>
              A short summary that appears in fund listings
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Fund Detailed Description */}
      <FormField
        control={form.control}
        name="detailedDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Detailed Description</FormLabel>
            <FormControl>
              <textarea 
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                rows={5}
                placeholder="Comprehensive description of the fund" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FundDescriptionSection;
