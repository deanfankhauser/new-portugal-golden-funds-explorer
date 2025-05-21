
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Fund, FundCategory, FundTag } from "../data/funds";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define schema for form validation
export const fundFormSchema = z.object({
  id: z.string().min(3, "ID must be at least 3 characters"),
  name: z.string().min(3, "Fund name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  detailedDescription: z.string().min(50, "Detailed description must be at least 50 characters"),
  category: z.string(),
  tags: z.array(z.string()),
  minimumInvestment: z.number().min(1, "Minimum investment must be positive"),
  fundSize: z.number().min(1, "Fund size must be positive"),
  managementFee: z.number().min(0, "Fee must be positive or zero"),
  performanceFee: z.number().min(0, "Fee must be positive or zero"),
  subscriptionFee: z.number().optional(),
  redemptionFee: z.number().optional(),
  term: z.number().min(1, "Term must be at least 1 year"),
  managerName: z.string().min(3, "Manager name must be at least 3 characters"),
  managerLogo: z.string().optional(),
  returnTarget: z.string().min(1, "Return target is required"),
  fundStatus: z.enum(["Open", "Closed", "Closing Soon"]),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  established: z.number().min(1900, "Year must be after 1900"),
  regulatedBy: z.string().min(3, "Regulation information is required"),
  location: z.string().min(3, "Location is required"),
});

export type FundFormValues = z.infer<typeof fundFormSchema>;

// Available fund categories
export const fundCategories: FundCategory[] = [
  "Venture Capital",
  "Private Equity",
  "Real Estate",
  "Mixed",
  "Infrastructure",
  "Debt"
];

// Available fund tags
export const availableTags: FundTag[] = [
  "Real Estate",
  "Private Equity",
  "Venture Capital",
  "Tourism",
  "Infrastructure",
  "Technology",
  "Healthcare",
  "Energy",
  "Sustainability",
  "Low Risk",
  "Medium Risk",
  "High Risk"
];

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

  const handleTagToggle = (tag: FundTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
    
    // Update the form value for tags
    form.setValue("tags", selectedTags.includes(tag) 
      ? form.getValues("tags").filter(t => t !== tag) 
      : [...form.getValues("tags"), tag]
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fund Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fund Category</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                    >
                      {fundCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Fund Status */}
            <FormField
              control={form.control}
              name="fundStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fund Status</FormLabel>
                  <FormControl>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      {...field}
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                      <option value="Closing Soon">Closing Soon</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fund Tags */}
          <div className="space-y-2">
            <Label>Fund Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  className={`px-3 py-1 text-sm rounded-full border ${selectedTags.includes(tag) ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground'}`}
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <FormDescription>
              Select all tags that apply to this fund
            </FormDescription>
          </div>

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

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin')}
            >
              Cancel
            </Button>
            <Button type="submit">{submitButtonText}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FundForm;
