
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FundFormValues } from "./FundFormSchema";

type FundFeeSectionProps = {
  form: UseFormReturn<FundFormValues>;
};

const FundFeeSection = ({ form }: FundFeeSectionProps) => {
  return (
    <>
      <h3 className="text-xl font-semibold mt-8">Fee Structure</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Management Fee */}
        <FormField
          control={form.control}
          name="managementFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Management Fee (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Performance Fee */}
        <FormField
          control={form.control}
          name="performanceFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performance Fee (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} 
                  onChange={(e) => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subscription Fee */}
        <FormField
          control={form.control}
          name="subscriptionFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subscription Fee (%) - Optional</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} 
                  onChange={(e) => e.target.value ? field.onChange(parseFloat(e.target.value)) : field.onChange(undefined)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Redemption Fee */}
        <FormField
          control={form.control}
          name="redemptionFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Redemption Fee (%) - Optional</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" {...field} 
                  onChange={(e) => e.target.value ? field.onChange(parseFloat(e.target.value)) : field.onChange(undefined)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default FundFeeSection;
