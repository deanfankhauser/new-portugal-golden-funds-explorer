import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function AdminCreateCompanyProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledCompanyName = searchParams.get("company_name") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: prefilledCompanyName,
    manager_name: prefilledCompanyName,
    first_name: "",
    last_name: "",
    city: "",
    country: "Portugal",
    founded_year: "",
    logo_url: "",
    description: "",
    website: "",
    assets_under_management: "",
    registration_number: "",
    license_number: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company_name.trim()) {
      toast({
        title: "Error",
        description: "Company name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const placeholderUserId = crypto.randomUUID();
      const placeholderEmail = `admin-created-${Date.now()}@placeholder.internal`;

      const { error } = await supabase.from("profiles").insert({
        user_id: placeholderUserId,
        email: placeholderEmail,
        company_name: formData.company_name.trim(),
        manager_name: formData.manager_name.trim() || formData.company_name.trim(),
        first_name: formData.first_name.trim() || null,
        last_name: formData.last_name.trim() || null,
        city: formData.city.trim() || null,
        country: formData.country.trim() || null,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : null,
        logo_url: formData.logo_url.trim() || null,
        description: formData.description.trim() || null,
        website: formData.website.trim() || null,
        assets_under_management: formData.assets_under_management 
          ? parseInt(formData.assets_under_management) 
          : null,
        registration_number: formData.registration_number.trim() || null,
        license_number: formData.license_number.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Company profile for "${formData.company_name}" created successfully`,
      });

      navigate("/admin/edit-profiles");
    } catch (error: any) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create company profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/edit-profiles")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create Company Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  placeholder="e.g., Lince Capital"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager_name">Manager/Display Name</Label>
                <Input
                  id="manager_name"
                  value={formData.manager_name}
                  onChange={(e) => handleChange("manager_name", e.target.value)}
                  placeholder="e.g., Lince Capital, SCR, S.A."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="first_name">Contact First Name</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Contact Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="e.g., Lisbon"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  type="number"
                  value={formData.founded_year}
                  onChange={(e) => handleChange("founded_year", e.target.value)}
                  placeholder="e.g., 2015"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => handleChange("logo_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assets_under_management">AUM (€)</Label>
                <Input
                  id="assets_under_management"
                  type="number"
                  value={formData.assets_under_management}
                  onChange={(e) => handleChange("assets_under_management", e.target.value)}
                  placeholder="e.g., 50000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="registration_number">Registration Number</Label>
                <Input
                  id="registration_number"
                  value={formData.registration_number}
                  onChange={(e) => handleChange("registration_number", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => handleChange("license_number", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Company description..."
                rows={4}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Profile"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/edit-profiles")}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
