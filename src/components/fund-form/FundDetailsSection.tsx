
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FundFormValues } from "./FundFormSchema";

type FundDetailsSectionProps = {
  form: UseFormReturn<FundFormValues>;
};

const FundDetailsSection = ({ form }: FundDetailsSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Fund Established */}
        <FormField
          control={form.control}
          name="established"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year Established</FormLabel>
              <FormControl>
                <Input type="number" {...field} 
                  onChange={(e) => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Regulated By */}
        <FormField
          control={form.control}
          name="regulatedBy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regulated By</FormLabel>
              <FormControl>
                <Input placeholder="CMVM (Portuguese Securities Market Commission)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Lisbon, Portugal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Website URL */}
      <FormField
        control={form.control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default FundDetailsSection;
