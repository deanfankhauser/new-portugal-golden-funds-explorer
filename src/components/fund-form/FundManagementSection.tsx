
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FundFormValues } from "./FundFormSchema";

type FundManagementSectionProps = {
  form: UseFormReturn<FundFormValues>;
};

const FundManagementSection = ({ form }: FundManagementSectionProps) => {
  return (
    <>
      <h3 className="text-xl font-semibold mt-8">Fund Management</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manager Name */}
        <FormField
          control={form.control}
          name="managerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager Name</FormLabel>
              <FormControl>
                <Input placeholder="Fund Management Company" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Manager Logo */}
        <FormField
          control={form.control}
          name="managerLogo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager Logo URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/logo.png" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Return Target */}
        <FormField
          control={form.control}
          name="returnTarget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Return Target</FormLabel>
              <FormControl>
                <Input placeholder="8-10% annually" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default FundManagementSection;
