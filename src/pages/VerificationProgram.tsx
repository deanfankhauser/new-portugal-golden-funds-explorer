import { CheckCircle2, AlertCircle, FileCheck, Shield, Clock, Users, Database, Eye, XCircle, AlertTriangle, ArrowRight, Mail, ChevronRight, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import FAQSection from "@/components/common/FAQSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageSEO from "@/components/common/PageSEO";

const VerificationProgram = () => {
  const verificationChecks = [
    {
      title: "Regulatory status located",
      description: "CMVM registration/notification (or the fund's stated basis) identified and matched to the legal name(s).",
      icon: Shield
    },
    {
      title: "Names & entities match",
      description: "Fund legal name, manager/vehicle names, and (if present) class/ISIN labels are consistent across documents.",
      icon: FileCheck
    },
    {
      title: "Core docs present (latest versions)",
      description: "Prospectus/PPM/KID, subscription docs (incl. fee table), company/registry extracts for manager/vehicle(s).",
      icon: Database
    },
    {
      title: "Safekeeping relationship evidenced",
      description: "Custodian/depositary confirmation (if applicable) provided and consistent with the other materials.",
      icon: Shield
    },
    {
      title: "Audit evidence (if available)",
      description: "Latest auditor letter seen (where provided).",
      icon: Eye
    },
    {
      title: "Golden Visa claim is consistent",
      description: "If the fund claims GV eligibility, that claim is present and internally consistent across submitted docs and stated strategy. (We do not certify eligibility under law.)",
      icon: CheckCircle2
    },
    {
      title: "Dates line up",
      description: "Document dates and stated \"last updated\" information are coherent and current at review time.",
      icon: Clock
    },
    {
      title: "Quarterly re-attestation",
      description: "The fund must re-confirm no material changes—or submit updates—each quarter.",
      icon: Users
    }
  ];

  const verificationProcess = [
    {
      step: "1",
      title: "Collection",
      description: "Funds submit core docs via secure upload. We also locate the CMVM page/record (or stated basis) that matches the legal name(s)."
    },
    {
      step: "2",
      title: "Consistency checks",
      description: "We cross-check: legal names, manager/vehicle entities, depositary/custodian evidence, fee table excerpts, minimums/lock-ups/redemptions, document dates, and that any GV eligibility claim is consistently stated across materials."
    },
    {
      step: "3",
      title: "Clarifications (if needed)",
      description: "We request fixes for missing/contradictory information."
    },
    {
      step: "4",
      title: "Badge decision",
      description: "If coherent and complete, we mark the fund Verified and show sources on its profile."
    },
    {
      step: "5",
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
      step: "1",
      title: "Review verification details",
      description: "Read the \"What We Checked\" panel on the fund profile (names, CMVM status page, custodian, fees, GV claim presence/consistency, last verified date)."
    },
    {
      step: "2",
      title: "Check the documents",
      description: "Open the docs (Prospectus/PPM/KID, subscription, fee table). Sanity-check minimums, fees, lock-ups, and strategy."
    },
    {
      step: "3",
      title: "Verify independently",
      description: "Verify the regulator link and entity names yourself."
    },
    {
      step: "4",
      title: "Seek professional advice",
      description: "If GV is your goal, consult your lawyer to confirm the fund's claim fits your situation and current law."
    },
    {
      step: "5",
      title: "Ask questions",
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
    <div className="min-h-screen bg-white">
      <PageSEO pageType="verification-program" />
      <Header />
      
      {/* Breadcrumbs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto max-w-[1200px] px-6 py-3">
          <Breadcrumb>
            <BreadcrumbList className="text-sm text-gray-500">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="hover:text-gray-900 transition-colors">
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-gray-900">Verification Program</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-[1200px] text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-gray-200 bg-gray-50 text-xs font-medium text-gray-600 uppercase tracking-wide mb-6">
            Verification Program
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
            Portugal Golden Visa Fund Verification Program
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            We verify basic fund information against official sources — helping you spot incomplete profiles and giving you a head start on due diligence.
          </p>
          
          {/* Link Section */}
          <div className="mb-8">
            <a 
              href="https://www.movingto.com/portugal-golden-visa-funds" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Browse All Portugal Golden Visa Funds
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            Learn about{' '}
            <a 
              href="https://movingto.com/pt/portugal-golden-visa" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-accent/80 underline"
            >
              official Portugal Golden Visa requirements
            </a>
          </p>
        </div>
        
        <div className="container mx-auto max-w-[1200px] text-center">
          <div className="max-w-2xl mx-auto mb-10 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <p className="text-sm text-gray-600 leading-relaxed">
              This is not investment advice, due diligence, or a fund recommendation. Always conduct your own research.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg font-medium">
              <Link to="/verified-funds">
                View Verified Funds
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium">
              <Link to="/faqs">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* At-a-Glance Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="mb-12">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              What We Verify
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">What we check — at-a-glance</h2>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              Quick reference: the fundamental checks we run on every fund profile.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {verificationChecks.map((check, index) => (
              <div key={index} className="pb-8 border-b border-gray-200 last:border-0">
                <div className="flex items-start gap-4">
                  <Check className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{check.title}</h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {check.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Status Tags */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="mb-12">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Status Indicators
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Understanding status tags</h2>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              Each fund displays one of these status indicators.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors">
              <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                    Verified
                  </span>
                </div>
                <p className="text-base text-gray-600 leading-relaxed">
                  Passed all checks. Information matches official records. Data was reviewed within the last 90 days.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors">
              <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200">
                    Update Pending
                  </span>
                </div>
                <p className="text-base text-gray-600 leading-relaxed">
                  Previously verified but now over 90 days old. We're working to refresh the information.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors">
              <div className="w-2 h-2 rounded-full bg-red-600 mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-700 border border-red-200">
                    Paused / Revoked
                  </span>
                </div>
                <p className="text-base text-gray-600 leading-relaxed">
                  Documents couldn't be validated, or we found a discrepancy. Proceed with extra caution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* What We Don't Do */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="p-8 border-2 border-orange-600 rounded-lg bg-orange-50">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
              <h2 className="text-2xl font-semibold text-gray-900">What we do NOT do</h2>
            </div>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">
              Important limitations you should understand before using our verification badges.
            </p>
            <ul className="space-y-4 text-base text-gray-900">
              <li className="flex gap-3 items-start">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong className="font-semibold">Financial performance analysis:</strong> We do not evaluate returns, risk, or investment suitability.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong className="font-semibold">Legal or compliance audits:</strong> We are not lawyers, accountants, or regulatory experts.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong className="font-semibold">Ongoing monitoring:</strong> Once verified, we revisit the profile periodically — but not in real-time.</span>
              </li>
              <li className="flex gap-3 items-start">
                <span className="text-orange-600 font-bold">•</span>
                <span><strong className="font-semibold">Endorsement or recommendation:</strong> A verification badge is not an endorsement to invest.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* How Our Verification Works */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="mb-12">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Our Process
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">How our verification works</h2>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              A transparent, 5-step process to verify fund information.
            </p>
          </div>
          
          <div className="relative">
            {verificationProcess.map((step, index) => (
              <div key={index} className="relative pl-12 pb-12 last:pb-0">
                {/* Vertical line */}
                {index < verificationProcess.length - 1 && (
                  <div className="absolute left-5 top-12 bottom-0 w-px bg-gray-300"></div>
                )}
                
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center absolute left-0 top-0 hover:border-gray-400 transition-colors">
                    <span className="text-lg font-semibold text-gray-900">{step.step}</span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-base text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Documents We Expect */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="mb-12">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Required Materials
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Documents we expect</h2>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              Typical materials we review during verification.
            </p>
          </div>
          
          <ul className="grid md:grid-cols-2 gap-6">
            {expectedDocuments.map((doc, index) => (
              <li key={index} className="flex gap-3 items-start pb-6 border-b border-gray-200">
                <FileText className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <span className="text-base text-gray-900">{doc}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* How Investors Should Use This */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="mb-12">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              For Investors
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">How investors should use this</h2>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              Practical guidance on integrating verified data into your investment process.
            </p>
          </div>
          
          <div className="space-y-8">
            {investorSteps.map((item, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center hover:border-gray-400 transition-colors">
                  <span className="text-base font-semibold text-gray-900">{item.step}</span>
                </div>
                <div className="flex-1 pt-0.5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Red Flags */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="mb-12">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Due Diligence
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Red flags to watch for</h2>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              Warning signs that should prompt extra scrutiny during your own due diligence.
            </p>
          </div>
          
          <ol className="space-y-4">
            {redFlags.map((flag, index) => (
              <li key={index} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-sm font-medium text-red-700">
                  {index + 1}
                </span>
                <span className="text-base text-gray-900 pt-0.5 leading-relaxed">{flag}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Report an Issue */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="p-8 border border-gray-200 rounded-lg bg-white">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">Report an issue</h2>
            <p className="text-base text-gray-600 mb-6 leading-relaxed max-w-2xl">
              If you believe a verified fund profile contains inaccurate or outdated information, please let us know.
            </p>
            <div className="flex flex-col gap-4">
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border border-gray-300 hover:border-gray-400 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium">
                <a href="mailto:info@movingto.com">
                  <Mail className="mr-2 h-4 w-4 flex-shrink-0" />
                  info@movingto.com
                </a>
              </Button>
              <p className="text-sm text-gray-500">
                Include fund name, specific issue, and any supporting documentation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Conflicts & Compensation */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="mb-6">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Transparency
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Conflicts &amp; compensation</h2>
          </div>
          <div className="space-y-6 text-base text-gray-900 leading-relaxed max-w-3xl">
            <p>
              <strong className="font-semibold">Paid verification:</strong> Some funds pay us to expedite or expand their verification. We disclose any such arrangement on the fund's profile page.
            </p>
            <p>
              <strong className="font-semibold">Independence:</strong> Payment does not influence our methodology or the verification outcome. A fund that pays and fails our checks will not receive a badge.
            </p>
            <p>
              <strong className="font-semibold">Advertising:</strong> We may display sponsored content elsewhere on our site. Verification and advertising are handled by separate teams and processes.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Disclaimers */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="mb-12">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Legal
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Detailed disclaimers</h2>
            <p className="text-base text-gray-600 max-w-2xl leading-relaxed">
              Legal notices and risk warnings you should review carefully.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="border-t border-gray-200">
              <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-6">
                Not Investment Advice
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 leading-relaxed pb-6">
                Nothing on this site — including our verification badges — constitutes investment advice, a recommendation, or a solicitation to buy or sell any security or investment product. You must conduct your own due diligence and consult with qualified financial, legal, and tax advisors before making any investment decision.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-t border-gray-200">
              <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-6">
                No Guarantee of Accuracy
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 leading-relaxed pb-6">
                While we strive for accuracy, we cannot guarantee that all information is complete, current, or error-free. Fund details may change, and documents may be outdated or misinterpreted. We are not liable for any errors, omissions, or reliance on the information provided.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-t border-gray-200">
              <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-6">
                No Endorsement
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 leading-relaxed pb-6">
                A verification badge does not imply endorsement, approval, or recommendation of any fund, fund manager, or investment strategy. It simply indicates that certain basic information has been cross-checked against available documentation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-t border-gray-200">
              <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-6">
                Investment Risks
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 leading-relaxed pb-6">
                All investments carry risk, including the potential loss of principal. Past performance is not indicative of future results. Alternative investments (such as private funds) may be illiquid, complex, and subject to limited regulation. They may not be suitable for all investors.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-t border-gray-200">
              <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-6">
                Third-Party Information
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 leading-relaxed pb-6">
                We rely on documents and data provided by fund managers, regulatory filings, and other third-party sources. We do not independently audit financial statements or validate performance claims. Our verification process is limited in scope.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border-t border-gray-200">
              <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-6">
                Changes and Revocation
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 leading-relaxed pb-6">
                We reserve the right to update, suspend, or revoke any verification badge at any time, for any reason, without prior notice. Verification status may change as new information becomes available.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border-t border-b border-gray-200">
              <AccordionTrigger className="text-base font-semibold text-gray-900 hover:no-underline py-6">
                Limitation of Liability
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 leading-relaxed pb-6">
                To the fullest extent permitted by law, we disclaim all liability for any damages, losses, or claims arising from your use of this verification service or reliance on any information provided. This includes, but is not limited to, direct, indirect, incidental, or consequential damages.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* FAQs */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-[1200px]">
          <div className="text-center mb-8">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              FAQ
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">Frequently asked questions</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Quick answers to common questions about our verification program.
            </p>
          </div>
          
          <FAQSection 
            faqs={faqs}
            title=""
            schemaId="verification-faq"
          />
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto max-w-[1200px] px-6">
        <hr className="border-gray-200" />
      </div>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="container mx-auto max-w-[1200px] text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 tracking-tight">Ready to explore verified funds?</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Browse our collection of verified fund profiles and see which ones pass our basic checks.
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 px-8 py-4 rounded-lg font-medium text-base">
            <Link to="/verified-funds">
              Browse Verified Funds
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VerificationProgram;