import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, FileText, Scale, Search, Shield, XCircle, DollarSign, BookOpen, HelpCircle, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageSEO from "@/components/common/PageSEO";
import FAQSection from "@/components/common/FAQSection";
import { COMPANY_INFO } from "@/config/company";

const About = () => {
  const faqs = [
    {
      question: "Are you independent?",
      answer: "No. We may receive commissions or fees from partners, including fund managers and service providers. These commercial relationships can create conflicts of interest. We disclose these relationships where relevant."
    },
    {
      question: "Do you provide advice?",
      answer: "No. We provide information and comparison tools only. This site does not provide financial, legal, tax, or immigration advice. You should always consult qualified professionals before making any investment or residency decision."
    },
    {
      question: "Does payment influence verification or rankings?",
      answer: "No. We do not sell rankings or verification badges. Commercial relationships do not affect our methodology, verification outcomes, or display order. Verification is a documented-check process based on stated criteria."
    },
    {
      question: "Are all funds eligible for the Golden Visa?",
      answer: "Eligibility depends on current Portuguese law, fund structure, and your personal circumstances. Fund eligibility can change. Always confirm with a qualified immigration lawyer before investing."
    },
    {
      question: "How do you source information?",
      answer: "From public documents, fund offering materials, CMVM filings (where applicable), and direct communications with fund managers. We summarise this information but do not verify its accuracy independently."
    },
    {
      question: "How can I report an issue?",
      answer: "Email us at info@movingto.com with any concerns, corrections, or feedback. We review all submissions and update information where appropriate."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageSEO pageType="about" />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                About funds.movingto.com
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Information and tools for comparing Portugal Golden Visa funds — not advice.
              </p>
              <Button asChild size="lg">
                <Link to="/">Explore Funds</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Compliance First Callout */}
        <section className="container mx-auto px-4 py-8">
          <Card className="border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20 max-w-3xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h2 className="font-semibold text-foreground">Compliance First</h2>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><strong className="text-foreground">We are not independent.</strong> We may earn commissions from partners.</li>
                    <li><strong className="text-foreground">Not advice.</strong> This site provides information only.</li>
                    <li><strong className="text-foreground">Consult professionals.</strong> Always seek qualified advice before investing.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Who We Are */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Who We Are</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  funds.movingto.com is a directory, research hub, and comparison tool for Portugal Golden Visa investment funds. We aggregate publicly available information to help users understand and compare their options.
                </p>
                <p className="text-sm text-muted-foreground border-t pt-4">
                  funds.movingto.com is owned and operated by {COMPANY_INFO.legalName} ({COMPANY_INFO.address.country}) and is part of Movingto Group.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Do */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">What We Do</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Fund profiles with factual data (fees, minimums, lock-ups, strategies)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Document-based research summaries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Search className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Side-by-side comparison tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Verification as a documented-check process (not certification or endorsement)</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* What We Do NOT Do */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">What We Do NOT Do</h2>
            <Card className="border-destructive/30 bg-destructive/5">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">We do <strong className="text-foreground">not</strong> provide financial, legal, tax, or immigration advice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">We do <strong className="text-foreground">not</strong> recommend specific funds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">We do <strong className="text-foreground">not</strong> tell you what to invest in</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">We do <strong className="text-foreground">not</strong> guarantee Golden Visa eligibility or investment outcomes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How We Make Money */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">How We Make Money</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <DollarSign className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">We may earn commissions</strong> or fees if a user is introduced to, or engages with, a partner (including fund managers or service providers).
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground ml-8">
                  <li>• We may receive sponsorship revenue</li>
                  <li>• These commercial relationships can create conflicts of interest</li>
                  <li>• We disclose relationships where relevant</li>
                  <li>• <strong className="text-foreground">Commercial relationships do not guarantee verification</strong> and do not change any stated methodology</li>
                  <li>• <strong className="text-foreground">We do not sell rankings</strong> — commercial status never affects scoring or display order</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Editorial Integrity */}
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-4">Editorial Integrity</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Scale className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted-foreground mb-3">
                      We source information from public documents, offering documents (where available), regulator filings (CMVM where applicable), and direct fund communications.
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      Verification is a documented-check process, not a legal determination.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Important Notice Callout */}
        <section className="container mx-auto px-4 py-8">
          <Card className="border-primary/30 bg-primary/5 max-w-3xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-semibold text-foreground mb-2">Important Notice</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    This site does not provide financial, legal, tax, or immigration advice. Information is for general reference only. You should seek independent professional advice before making any investment or residency decision.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/disclaimer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Read Disclaimer
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/verification-program" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Read Verification Methodology
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-8 pb-16">
          <div className="max-w-3xl mx-auto">
            <FAQSection 
              faqs={faqs} 
              title="Frequently Asked Questions"
              noWrapper
            />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
