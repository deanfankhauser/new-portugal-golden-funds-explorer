import React from 'react';
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
  ExternalLink
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
      
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-8 animate-fade-in">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-semibold text-foreground">Verification Program</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Hero Section */}
        <section className="mb-20 text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-3 bg-success/10 text-success px-6 py-3 rounded-full mb-8 border border-success/20 shadow-sm">
            <Shield className="w-6 h-6" />
            <span className="font-bold text-lg">Verified by Movingto</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-8 leading-[1.1]">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Verification you can
            </span>
            <br />
            <span className="text-foreground">actually use</span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-foreground font-medium max-w-4xl mx-auto mb-4 leading-relaxed">
            We run limited, factual checks on a fund's regulatory status and core documents—so you can evaluate faster.
          </p>

          <Alert variant="warning" className="max-w-3xl mx-auto mb-10 border-2">
            <Info className="h-5 w-5" />
            <AlertTitle className="font-bold text-base">Important Notice</AlertTitle>
            <AlertDescription className="text-base">
              This is not investment, legal, or tax advice. No performance review. No visa guarantees.
            </AlertDescription>
          </Alert>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/verified-funds">
              <Button size="lg" className="gap-2 text-base px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <CheckCircle2 className="w-5 h-5" />
                Compare Verified Funds
              </Button>
            </Link>
            <a 
              href="https://www.movingto.com/contact" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="gap-2 text-base px-8 py-6 border-2 hover:bg-muted transition-all duration-300">
                Ask a Question
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </section>

        {/* At-a-Glance Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              At-a-Glance: What <span className="text-success">"Verified"</span> Means
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A fund with the Verified by Movingto badge has passed these point-in-time checks
            </p>
          </div>
          
          <Card className="bg-gradient-to-br from-success/5 via-success/10 to-success/5 border-success/30 border-2 shadow-xl">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <span className="text-foreground">Verification Checklist</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {verificationChecks.map((check, index) => (
                  <div 
                    key={index} 
                    className="flex gap-4 p-4 bg-card rounded-lg border border-success/10 hover:border-success/30 transition-all duration-300 hover:shadow-md"
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-foreground mb-2">{check.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{check.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Status Tags Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Status Tags You'll See
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Each fund displays its current verification status
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
                <Badge variant="success" className="mb-4 text-base px-6 py-2">
                  Verified
                </Badge>
                <p className="text-foreground font-medium">
                  Passed all checks at last review
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-warning" />
                </div>
                <Badge variant="warning" className="mb-4 text-base px-6 py-2">
                  Update Pending
                </Badge>
                <p className="text-foreground font-medium">
                  Fund reported changes; new docs under review
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2">
              <CardContent className="pt-8 text-center">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <Badge variant="destructive" className="mb-4 text-base px-6 py-2">
                  Paused/Revoked
                </Badge>
                <p className="text-foreground font-medium">
                  Issues, non-response, or inconsistencies
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-muted/50 to-muted/30 border-2">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground mb-2">What you'll see on fund profiles:</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Last verified date • Complete list of documents we received • Direct link to CMVM/public record (where available)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* What We Do NOT Do Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              What We Do <span className="text-destructive">NOT</span> Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Understanding the boundaries of our verification process
            </p>
          </div>
          
          <Alert variant="warning" className="max-w-5xl mx-auto border-2 shadow-lg">
            <AlertTriangle className="h-6 w-6" />
            <AlertTitle className="text-xl font-bold mb-6">Important Limitations</AlertTitle>
            <AlertDescription>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3 p-3 bg-card rounded-lg border border-warning/20">
                  <span className="text-warning text-xl">•</span>
                  <span className="text-foreground font-medium">No performance/NAV review or asset audits</span>
                </div>
                <div className="flex gap-3 p-3 bg-card rounded-lg border border-warning/20">
                  <span className="text-warning text-xl">•</span>
                  <span className="text-foreground font-medium">No valuation or solvency assessment</span>
                </div>
                <div className="flex gap-3 p-3 bg-card rounded-lg border border-warning/20">
                  <span className="text-warning text-xl">•</span>
                  <span className="text-foreground font-medium">No AML/KYC on the fund or investors</span>
                </div>
                <div className="flex gap-3 p-3 bg-card rounded-lg border border-warning/20">
                  <span className="text-warning text-xl">•</span>
                  <span className="text-foreground font-medium">No suitability assessment for your situation</span>
                </div>
                <div className="flex gap-3 p-3 bg-card rounded-lg border border-warning/20">
                  <span className="text-warning text-xl">•</span>
                  <span className="text-foreground font-medium">No legal/tax advice and no visa approval guarantee</span>
                </div>
                <div className="flex gap-3 p-3 bg-card rounded-lg border border-warning/20">
                  <span className="text-warning text-xl">•</span>
                  <span className="text-foreground font-medium">We do not certify Golden Visa eligibility</span>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </section>

        {/* How Our Verification Works Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How Our Verification Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A transparent 5-step process from submission to badge
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {verificationProcess.map((step) => (
              <Card 
                key={step.number} 
                className="relative hover:shadow-lg transition-all duration-300 hover:-translate-y-2 border-2"
              >
                <CardContent className="pt-10 pb-6">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-lg mb-3 mt-2 text-center text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-center">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Documents We Expect Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Documents We Expect to See
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Essential documentation required for verification
            </p>
          </div>
          
          <Card className="max-w-5xl mx-auto border-2 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="grid md:grid-cols-2 gap-4">
                {expectedDocuments.map((doc, index) => (
                  <div 
                    key={index} 
                    className="flex gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-primary/10 hover:border-primary/30 transition-all duration-300"
                  >
                    <FileCheck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium leading-relaxed">{doc}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    We remove/redact sensitive bank details and do not display investor PII.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How Investors Should Use This Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              How Investors Should Use This
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A 5-step guide to making the most of verified fund information
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6 max-w-7xl mx-auto mb-10">
            {investorSteps.map((step) => (
              <Card 
                key={step.number} 
                className="relative bg-gradient-to-br from-primary/5 to-primary/10 border-primary/30 border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                <CardContent className="pt-10 pb-6">
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                  <p className="text-sm text-foreground font-medium mt-2 leading-relaxed text-center">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="max-w-5xl mx-auto bg-gradient-to-r from-accent/10 to-accent/5 border-accent/30 border-2">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-lg mb-2">Good to know</h3>
                  <p className="text-foreground leading-relaxed">
                    We're an introducer (not an adviser). If you end up subscribing after an introduction, 
                    we may receive a fee from the fund. That compensation does not affect verification outcomes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Red Flags Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Red Flags <span className="text-destructive">to Watch For</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Warning signs that should raise concerns
            </p>
          </div>
          
          <Alert variant="destructive" className="max-w-5xl mx-auto border-2 shadow-lg">
            <AlertTriangle className="h-6 w-6" />
            <AlertTitle className="text-xl font-bold mb-6">Warning Signs</AlertTitle>
            <AlertDescription>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {redFlags.map((flag, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-card rounded-lg border border-destructive/20">
                    <span className="text-destructive text-xl">•</span>
                    <span className="text-foreground font-medium leading-relaxed">{flag}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                <p className="font-bold text-foreground text-center">
                  If you spot something off on a verified profile, report it below—we'll re-review.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        </section>

        {/* Report an Issue Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Report an Issue
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Help us maintain the integrity of verified fund information
            </p>
          </div>
          
          <Card className="max-w-3xl mx-auto border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">See a mismatch or outdated document?</CardTitle>
              <CardDescription className="text-base mt-2">
                Submit a report and we'll investigate. If needed, we'll update the status (e.g., Update Pending or Paused).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a 
                href="https://www.movingto.com/contact" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="w-full gap-2 py-6 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  <AlertTriangle className="w-5 h-5" />
                  Submit a Report
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </section>

        {/* Conflicts & Compensation Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Conflicts & Compensation
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Plain English about our introducer model
            </p>
          </div>
          
          <Card className="max-w-5xl mx-auto border-2 shadow-lg">
            <CardContent className="pt-8 pb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Introducer Only</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Movingto operates as an introducer only.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-border">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Referral Fees</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We may receive an introducer/referral fee from the fund if you subscribe after an introduction.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gradient-to-r from-success/5 to-transparent rounded-lg border border-border">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Independent Verification</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Verification is independent of compensation—funds are verified or not based on checks above.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-gradient-to-r from-success/5 to-transparent rounded-lg border border-border">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-2">No Custody</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We never take custody of your money and we don't collect investor PII beyond what you choose to share.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Disclaimers Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '1.1s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Disclaimers <span className="text-muted-foreground">(Read This)</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Important legal information about our verification program
            </p>
          </div>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto space-y-3">
            <AccordionItem value="item-1" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger>
                <span className="font-bold text-lg text-foreground">No advice or solicitation</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                The badge and this page provide informational, limited-scope checks only and are not investment, legal, tax, or immigration advice, 
                nor an offer/solicitation to buy or sell securities.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger>
                <span className="font-bold text-lg text-foreground">Limited review</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                We verify the presence and internal consistency of specific documents and public records at the time of review. 
                We do not audit performance, assets, NAV, or operations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger>
                <span className="font-bold text-lg text-foreground">No Golden Visa guarantees</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                Where a fund claims GV eligibility, we confirm the claim exists and is consistent across materials. 
                We do not certify eligibility under law or guarantee visa outcomes.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger>
                <span className="font-bold text-lg text-foreground">Reliance on third parties</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                We rely on fund-supplied docs and public sources. If those are inaccurate or outdated, our verification may be affected.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger>
                <span className="font-bold text-lg text-foreground">Point-in-time status</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                Verification can change. We may pause/revoke if materials change or inconsistencies appear.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-2 rounded-lg px-6 bg-card">
              <AccordionTrigger>
                <span className="font-bold text-lg text-foreground">Jurisdiction</span>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                Program operated by Movingto Global Pte. Ltd. (Singapore). Disputes subject to Singapore law/courts.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-center gap-4 mt-10">
            <Link to="/disclaimer">
              <Button variant="outline" size="lg" className="font-semibold">Terms</Button>
            </Link>
            <Link to="/privacy">
              <Button variant="outline" size="lg" className="font-semibold">Privacy</Button>
            </Link>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="mb-20 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Common questions about our verification program
            </p>
          </div>
          
          <Accordion type="single" collapsible className="max-w-4xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="border-2 rounded-lg px-6 bg-card">
                <AccordionTrigger>
                  <span className="font-bold text-base text-foreground text-left">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="mb-20 text-center animate-fade-in" style={{ animationDelay: '1.3s' }}>
          <Card className="bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 max-w-5xl mx-auto border-2 shadow-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
            <CardContent className="relative pt-16 pb-16 px-8">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-success" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Ready to explore verified funds?</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Browse our verified fund portfolio and make more informed investment decisions with confidence.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/verified-funds">
                  <Button size="lg" className="gap-2 text-base px-10 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CheckCircle2 className="w-5 h-5" />
                    View Verified Funds
                  </Button>
                </Link>
                <Link to="/index">
                  <Button size="lg" variant="outline" className="gap-2 text-base px-10 py-6 border-2 hover:bg-muted transition-all duration-300">
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
