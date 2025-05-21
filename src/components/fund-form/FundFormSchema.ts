
import { z } from "zod";

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
export type FundCategory = "Venture Capital" | "Private Equity" | "Real Estate" | "Mixed" | "Infrastructure" | "Debt";

export const fundCategories: FundCategory[] = [
  "Venture Capital",
  "Private Equity",
  "Real Estate",
  "Mixed",
  "Infrastructure",
  "Debt"
];

// Available fund tags
export type FundTag = 
  | "Real Estate"
  | "Private Equity"
  | "Venture Capital"
  | "Tourism"
  | "Infrastructure"
  | "Technology"
  | "Healthcare"
  | "Energy"
  | "Sustainability"
  | "Low Risk"
  | "Medium Risk"
  | "High Risk";

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
