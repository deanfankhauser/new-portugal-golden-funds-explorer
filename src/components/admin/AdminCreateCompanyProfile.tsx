import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Award, HelpCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ManagerHighlight {
  title: string;
  description: string;
  icon?: string;
}

interface ManagerFAQ {
  question: string;
  answer: string;
}

export function AdminCreateCompanyProfile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledCompanyName = searchParams.get("company_name") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company_name: prefilledCompanyName,
    manager_name: prefilledCompanyName,
    city: "",
    country: "Portugal",
    founded_year: "",
    logo_url: "",
    description: "",
    website: "",
    assets_under_management: "",
    registration_number: "",
    license_number: "",
    manager_about: "",
  });

  const [highlights, setHighlights] = useState<ManagerHighlight[]>([]);
  const [faqs, setFaqs] = useState<ManagerFAQ[]>([]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Highlights handlers
  const addHighlight = () => {
    setHighlights([...highlights, { title: "", description: "", icon: "award" }]);
  };

  const updateHighlight = (index: number, field: keyof ManagerHighlight, value: string) => {
    const updated = [...highlights];
    updated[index] = { ...updated[index], [field]: value };
    setHighlights(updated);
  };

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_, i) => i !== index));
  };

  // FAQs handlers
  const addFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const updateFAQ = (index: number, field: keyof ManagerFAQ, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const removeFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
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
      // Filter out empty highlights and FAQs
      const validHighlights = highlights.filter(h => h.title.trim() && h.description.trim());
      const validFaqs = faqs.filter(f => f.question.trim() && f.answer.trim());

      const { data, error } = await supabase.functions.invoke('create-admin-company-profile', {
        body: {
          company_name: formData.company_name.trim(),
          manager_name: formData.manager_name.trim() || formData.company_name.trim(),
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
          manager_about: formData.manager_about.trim() || null,
          manager_highlights: validHighlights,
          manager_faqs: validFaqs,
        },
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to create company profile');
      }

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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent>
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

            <div className="space-y-2 mt-4">
              <Label htmlFor="description">Short Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Brief company description..."
                rows={3}
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="manager_about">About the Manager (Detailed)</Label>
              <Textarea
                id="manager_about"
                value={formData.manager_about}
                onChange={(e) => handleChange("manager_about", e.target.value)}
                placeholder="Detailed company/manager description for the public profile page..."
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Highlights Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Highlights & Awards
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                <Plus className="h-4 w-4 mr-1" />
                Add Highlight
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {highlights.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No highlights added yet. Click "Add Highlight" to add awards, certifications, or key achievements.
              </p>
            ) : (
              <div className="space-y-4">
                {highlights.map((highlight, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">Highlight #{index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHighlight(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={highlight.title}
                          onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                          placeholder="e.g., CMVM Regulated"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon (optional)</Label>
                        <Input
                          value={highlight.icon || ''}
                          onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                          placeholder="e.g., award, shield, star"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={highlight.description}
                        onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                        placeholder="Brief description of this highlight..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* FAQs Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Manager FAQs
              </CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addFAQ}>
                <Plus className="h-4 w-4 mr-1" />
                Add FAQ
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {faqs.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No FAQs added yet. Click "Add FAQ" to add frequently asked questions about this manager.
              </p>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-muted-foreground">FAQ #{index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFAQ(index)}
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                        placeholder="e.g., What is the minimum investment?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer</Label>
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                        placeholder="The answer to this question..."
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Profile"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/edit-profiles")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
