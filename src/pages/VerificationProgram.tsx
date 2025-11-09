import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck, 
  Building2, 
  Clock,
  Info,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const VerificationProgram = () => {
  const [reportFormOpen, setReportFormOpen] = useState(false);

  const verificationChecks = [
    {
      title: "Regulatory status located",
      description: "CMVM registration/notification (or the fund's stated basis) identified and matched to the legal name(s)."
    },
    {
      title: "Names & entities match",
      description: "Fund legal name, manager/vehicle names, and (if present) class/ISIN labels are consistent across documents."
    },
    {
      title: "Core docs present (latest versions)",
      description: "Prospectus/PPM/KID, subscription docs (incl. fee table), company/registry extracts for manager/vehicle(s)."
    },
    {
      title: "Safekeeping relationship evidenced",
      description: "Custodian/depositary confirmation (if applicable) provided and consistent with the other materials."
    },
    {
      title: "Audit evidence (if available)",
      description: "Latest auditor letter seen (where provided)."
    },
    {
      title: "Golden Visa claim is consistent",
      description: "If the fund claims GV eligibility, that claim is present and internally consistent across submitted docs and stated strategy. (We do not certify eligibility under law.)"
    },
    {
      title: "Dates line up",
      description: "Document dates and stated \"last updated\" information are coherent and current at review time."
    },
    {
      title: "Quarterly re-attestation",
      description: "The fund must re-confirm no material changes—or submit updates—each quarter."
    }
  ];

  const verificationProcess = [
    {
      number: 1,
      title: "Collection",
      description: "Funds submit core docs via secure upload. We also locate the CMVM page/record (or stated basis) that matches the legal name(s)."
    },
    {
      number: 2,
      title: "Consistency checks",
      description: "We cross-check: legal names, manager/vehicle entities, depositary/custodian evidence, fee table excerpts, minimums/lock-ups/redemptions, document dates, and that any GV eligibility claim is consistently stated across materials."
    },
    {
      number: 3,
      title: "Clarifications (if needed)",
      description: "We request fixes for missing/contradictory information."
    },
    {
      number: 4,
      title: "Badge decision",
      description: "If coherent and complete, we mark the fund Verified and show sources on its profile."
    },
    {
      number: 5,
      title: "Quarterly re-attestation",
      description: "Funds must reconfirm \"no material changes\" or provide new docs. Non-responses or inconsistencies can trigger Paused/Revoked."
    }
  ];

  const expectedDocuments = [
    "Prospectus/PPM/KID (latest)",
    "Subscription docs (with all investor-facing fees)",
    "Company/registry extracts for manager and fund vehicle(s)",
    "Custodian/depositary confirmation (if applicable)",
    "Auditor letter (if available)",
    "Clear statement (if the fund makes one) about Golden Visa eligibility and the policy basis for that claim",
    "CMVM registration/notification link or official reference (where applicable)"
  ];

  const investorSteps = [
    {
      number: 1,
      description: "Read the \"What We Checked\" panel on the fund profile (names, CMVM status page, custodian, fees, GV claim presence/consistency, last verified date)."
    },
    {
      number: 2,
      description: "Open the docs (Prospectus/PPM/KID, subscription, fee table). Sanity-check minimums, fees, lock-ups, and strategy."
    },
    {
      number: 3,
      description: "Verify the regulator link and entity names yourself."
    },
    {
      number: 4,
      description: "If GV is your goal, consult your lawyer to confirm the fund's claim fits your situation and current law."
    },
    {
      number: 5,
      description: "Ask questions via Enquire or Book a Call if anything is unclear."
    }
  ];

  const redFlags = [
    "Mismatched legal names or outdated CMVM entries",
    "Fee tables that conflict between documents or marketing pages",
    "Missing/unclear custodian/depositary arrangements (when they should exist)",
    "GV eligibility claims that aren't stated consistently across materials",
    "Undated or stale documents presented as \"current\""
  ];

  const faqs = [
    {
      question: "Does \"Verified\" mean the fund is safe or high-performing?",
      answer: "No. We do not assess performance, risk, or asset quality—only documents and factual consistency."
    },
    {
      question: "Do you guarantee a Portugal Golden Visa if I invest in a Verified fund?",
      answer: "No. We confirm the fund's own claim about GV eligibility and that it's consistently stated. You must obtain independent legal advice."
    },
    {
      question: "How fresh is the information?",
      answer: "Profiles show the last verified date. Funds must re-attest quarterly or when something material changes."
    },
    {
      question: "What happens if a fund stops responding?",
      answer: "We mark Paused/Revoked until the issues are resolved."
    },
    {
      question: "Do you get paid by funds?",
      answer: "Sometimes, yes—if we introduce an investor who subscribes. That does not affect verification."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO 
        pageType="verification-program"
      />
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Verification Program</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <section className="mb-16 text-center">
          <div className="inline-flex items-center gap-3 bg-success/10 text-success px-6 py-3 rounded-full mb-6">
            <Shield className="w-6 h-6" />
            <span className="font-bold text-lg">Verified by Movingto</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Verification you can actually use
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-4">
            We run limited, factual checks on a fund's regulatory status and core documents—so you can evaluate faster.
          </p>

          <p className="text-sm text-muted-foreground max-w-3xl mx-auto mb-8">
            This is not investment, legal, or tax advice. No performance review. No visa guarantees.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/verified-funds">
              <Button size="lg" className="gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Compare Verified Funds
              </Button>
            </Link>
            <a 
              href="https://www.movingto.com/contact" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2">
                Ask a Question
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </section>

        {/* At-a-Glance Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            At-a-Glance: What "Verified" Means
          </h2>
          
          <Card className="bg-success/5 border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-success" />
                A fund with the Verified by Movingto badge has passed these point-in-time checks:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {verificationChecks.map((check, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-1">{check.title}</h3>
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Status Tags Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Status Tags You'll See
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <Badge variant="success" className="mb-4 text-base px-4 py-2">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Verified
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Passed all checks at last review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Badge variant="warning" className="mb-4 text-base px-4 py-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Update Pending
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Fund reported changes; new docs under review
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Badge variant="destructive" className="mb-4 text-base px-4 py-2">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Paused/Revoked
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Issues, non-response, or inconsistencies
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Displayed on profiles:</h3>
              <p className="text-sm text-muted-foreground">
                Last verified date • What we received • Direct link to CMVM/public record (if available)
              </p>
            </CardContent>
          </Card>
        </section>

        {/* What We Do NOT Do Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            What We Do NOT Do
          </h2>
          
          <Alert variant="warning" className="max-w-4xl mx-auto">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold mb-4">Important Limitations</AlertTitle>
            <AlertDescription>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-warning">•</span>
                  <span>No performance/NAV review or asset audits</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-warning">•</span>
                  <span>No valuation or solvency assessment</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-warning">•</span>
                  <span>No AML/KYC on the fund or investors</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-warning">•</span>
                  <span>No suitability assessment for your situation</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-warning">•</span>
                  <span>No legal/tax advice and no visa approval guarantee</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-warning">•</span>
                  <span>We do not certify Golden Visa eligibility; we only confirm the fund's own claim appears and is consistent across its materials</span>
                </li>
              </ul>
            </AlertDescription>
          </Alert>
        </section>

        {/* How Our Verification Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            How Our Verification Works
          </h2>
          
          <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {verificationProcess.map((step) => (
              <Card key={step.number} className="relative">
                <CardContent className="pt-6">
                  <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg mb-3 mt-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Documents We Expect Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Documents We Expect to See on a Verified Profile
          </h2>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-3">
                {expectedDocuments.map((doc, index) => (
                  <div key={index} className="flex gap-3">
                    <FileCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{doc}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6 pt-6 border-t border-border">
                (We remove/redact sensitive bank details and do not display investor PII.)
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How Investors Should Use This Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            How Investors Should Use This
          </h2>
          
          <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {investorSteps.map((step) => (
              <Card key={step.number} className="relative bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    {step.number}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-8 max-w-4xl mx-auto bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Good to know:</strong> We're an introducer (not an adviser). If you end up subscribing after an introduction, 
                    we may receive a fee from the fund. That compensation does not affect verification outcomes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Red Flags Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Red Flags We Watch For (and You Should Too)
          </h2>
          
          <Alert variant="destructive" className="max-w-4xl mx-auto">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-lg font-bold mb-4">Warning Signs</AlertTitle>
            <AlertDescription>
              <ul className="space-y-2">
                {redFlags.map((flag, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="text-destructive">•</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-semibold">
                If you spot something off on a verified profile, report it below—we'll re-review.
              </p>
            </AlertDescription>
          </Alert>
        </section>

        {/* Report an Issue Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Report an Issue
          </h2>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>See a mismatch or outdated document?</CardTitle>
              <CardDescription>
                Submit a report and we'll investigate. If needed, we'll update the status (e.g., Update Pending or Paused).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a 
                href="https://www.movingto.com/contact" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="w-full gap-2">
                  Submit a Report
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </section>

        {/* Conflicts & Compensation Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Conflicts & Compensation (Plain English)
          </h2>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Building2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">
                      <strong>Movingto operates as an introducer only.</strong>
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">
                      We may receive an introducer/referral fee from the fund if you subscribe after an introduction.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">
                      <strong>Verification is independent of compensation</strong>—funds are verified or not based on checks above.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-muted-foreground">
                      We never take custody of your money and we don't collect investor PII beyond what you choose to share for an introduction.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Disclaimers Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Disclaimers (Read This)
          </h2>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <span className="font-semibold">No advice or solicitation</span>
              </AccordionTrigger>
              <AccordionContent>
                The badge and this page provide informational, limited-scope checks only and are not investment, legal, tax, or immigration advice, 
                nor an offer/solicitation to buy or sell securities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>
                <span className="font-semibold">Limited review</span>
              </AccordionTrigger>
              <AccordionContent>
                We verify the presence and internal consistency of specific documents and public records at the time of review. 
                We do not audit performance, assets, NAV, or operations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                <span className="font-semibold">No Golden Visa guarantees</span>
              </AccordionTrigger>
              <AccordionContent>
                Where a fund claims GV eligibility, we confirm the claim exists and is consistent across materials. 
                We do not certify eligibility under law or guarantee visa outcomes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                <span className="font-semibold">Reliance on third parties</span>
              </AccordionTrigger>
              <AccordionContent>
                We rely on fund-supplied docs and public sources. If those are inaccurate or outdated, our verification may be affected.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                <span className="font-semibold">Point-in-time status</span>
              </AccordionTrigger>
              <AccordionContent>
                Verification can change. We may pause/revoke if materials change or inconsistencies appear.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>
                <span className="font-semibold">Jurisdiction</span>
              </AccordionTrigger>
              <AccordionContent>
                Program operated by Movingto Global Pte. Ltd. (Singapore). Disputes subject to Singapore law/courts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-center gap-4 mt-8">
            <Link to="/disclaimer">
              <Button variant="outline" size="sm">Terms</Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline" size="sm">Privacy</Button>
            </Link>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`}>
                <AccordionTrigger>
                  <span className="font-semibold text-left">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="mb-16 text-center">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background max-w-4xl mx-auto">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl font-bold mb-4">Ready to explore verified funds?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Browse our verified fund portfolio and make more informed investment decisions.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/verified-funds">
                  <Button size="lg" className="gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    View Verified Funds
                  </Button>
                </Link>
                <Link to="/index">
                  <Button size="lg" variant="outline">
                    Browse All Funds
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default VerificationProgram;
