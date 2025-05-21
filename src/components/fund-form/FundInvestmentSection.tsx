
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FundFormValues } from "./FundFormSchema";

type FundInvestmentSectionProps = {
  form: UseFormReturn<FundFormValues>;
};

const FundInvestmentSection = ({ form }: FundInvestmentSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Minimum Investment */}
      <FormField
        control={form.control}
        name="minimumInvestment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Minimum Investment (EUR)</FormLabel>
            <FormControl>
              <Input type="number" {...field} 
                onChange={(e) => field.onChange(parseFloat(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Fund Size */}
      <FormField
        control={form.control}
        name="fundSize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fund Size (millions EUR)</FormLabel>
            <FormControl>
              <Input type="number" {...field} 
                onChange={(e) => field.onChange(parseFloat(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Fund Term */}
      <FormField
        control={form.control}
        name="term"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Term (years)</FormLabel>
            <FormControl>
              <Input type="number" {...field} 
                onChange={(e) => field.onChange(parseInt(e.target.value))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default FundInvestmentSection;
