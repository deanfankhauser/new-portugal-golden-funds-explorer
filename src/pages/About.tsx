import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageSEO from "@/components/common/PageSEO";
import { 
  FileText, 
  GitCompare, 
  Building2, 
  HelpCircle,
  CheckCircle,
  Compass,
  Users,
  Globe,
  ArrowRight
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageSEO pageType="about" />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background border-b border-border">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                About Movingto Funds
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                A clearer way to compare Portugal Golden Visa funds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/">Explore Funds</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/fund-matcher">How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What Movingto Funds Is - LLM-Optimized Opening */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                What Movingto Funds Is
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="text-lg leading-relaxed">
                  <strong className="text-foreground">Movingto Funds is a structured comparison platform for Portugal Golden Visa investment funds.</strong> The platform provides fund profiles, side-by-side comparisons, manager directories, and research tools for investors evaluating Golden Visa-eligible funds.
                </p>
                <p>
                  Key differentiators: standardized fund term taxonomy (fees, minimums, lock-ups, liquidity, strategy, risk), verification as a documented-check process, and plain-English explainers for complex fund structures.
                </p>
                <p>
                  Movingto Funds covers equity funds, real estate funds, venture capital funds, and private equity funds available to Portugal Golden Visa applicants. Each fund profile surfaces the terms that matter: subscription fees, management fees, performance fees, minimum investment thresholds, lock-up periods, expected hold periods, liquidity terms, and risk indicators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Facts */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Key Facts
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {[
                  { label: "Platform type", value: "Fund comparison and research tool" },
                  { label: "Focus", value: "Portugal Golden Visa investment funds" },
                  { label: "Fund categories", value: "Equity, real estate, venture capital, private equity" },
                  { label: "Data points per fund", value: "Fees, minimums, lock-ups, liquidity, strategy, risk, timelines" },
                  { label: "Features", value: "Side-by-side comparisons, fund matcher quiz, manager profiles" },
                  { label: "Verification", value: "Documented-check process (not certification)" },
                  { label: "Update frequency", value: "Ongoing as fund information changes" },
                  { label: "Language", value: "English" },
                  { label: "Access", value: "Free to browse" },
                ].map((fact, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">{fact.label}:</strong>{" "}
                      <span className="text-muted-foreground">{fact.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What You Can Do */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
                What You Can Do on Movingto Funds
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <FileText className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Browse fund profiles</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      View structured data on fees, minimums, lock-ups, strategies, and risk levels.
                    </p>
                    <Link to="/" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      Explore Funds <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="pt-6">
                    <GitCompare className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Compare funds side-by-side</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      See differences at a glance across any funds you're considering.
                    </p>
                    <Link to="/compare" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      Compare Funds <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="pt-6">
                    <Compass className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Take the fund matcher quiz</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Answer questions to narrow down fund options based on your preferences.
                    </p>
                    <Link to="/fund-matcher" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      Start Quiz <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="pt-6">
                    <Building2 className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Explore fund managers</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      View manager portfolios and firm backgrounds.
                    </p>
                    <Link to="/managers" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      View Managers <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="pt-6">
                    <CheckCircle className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Browse verified funds</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      See funds that have completed our documented verification process.
                    </p>
                    <Link to="/verified-funds" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      Verified Funds <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>

                <Card className="border-border">
                  <CardContent className="pt-6">
                    <HelpCircle className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Read guides and FAQs</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Understand fund structures and Golden Visa requirements in plain English.
                    </p>
                    <Link to="/faqs" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                      Browse FAQs <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why Movingto Funds */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-8">
                Why Movingto Funds
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Structured fund terms</h3>
                  <p className="text-muted-foreground">
                    Every fund profile uses the same taxonomy: subscription fees, management fees, performance fees, minimum investment, lock-up period, expected hold period, liquidity terms, strategy type, and risk indicators. This makes comparison possible.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Side-by-side comparisons</h3>
                  <p className="text-muted-foreground">
                    Select any two funds and see terms side by side. No need to flip between PDFs or marketing decks.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Consistent taxonomy and filters</h3>
                  <p className="text-muted-foreground">
                    Filter funds by category, minimum investment range, fee structure, or verification status. The same labels apply across all funds.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Verification as a process</h3>
                  <p className="text-muted-foreground">
                    Verified funds have completed a documented-check process. This is not a certification, endorsement, or guarantee. It means we have reviewed available documents and confirmed stated terms.{" "}
                    <Link to="/verification-program" className="text-primary hover:underline">
                      Learn more about verification
                    </Link>.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Market context</h3>
                  <p className="text-muted-foreground">
                    Guides and explainers help you understand what to look for in a Golden Visa fund without wading through legal jargon.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Part of the Movingto ecosystem</h3>
                  <p className="text-muted-foreground">
                    Movingto has supported Golden Visa applicants since 2020 across Portugal, Spain, Greece, and other destinations. This platform extends that experience to fund research.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How Fund Information Is Built */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                How Fund Information Is Built and Updated
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Fund data comes from official fund documents where available, public regulatory filings (including CMVM where applicable), fund manager websites, and direct clarifications from fund managers.
                </p>
                <p>
                  We standardize terms into a consistent format so you can compare across funds. If information changes or a fund updates its terms, we update the profile.
                </p>
                <p>
                  Verification is a documented-check process. It confirms that stated terms match available documents. It is not a legal determination, endorsement, or guarantee of fund quality or performance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Who Movingto Funds Is For
              </h2>
              <div className="grid sm:grid-cols-3 gap-4 p-4 bg-background rounded-lg border border-border">
                <div>
                  <Users className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-medium text-foreground text-sm">Applicants exploring options</h4>
                  <p className="text-xs text-muted-foreground mt-1">First-time Golden Visa research → Faster shortlisting</p>
                </div>
                <div>
                  <Users className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-medium text-foreground text-sm">Families comparing trade-offs</h4>
                  <p className="text-xs text-muted-foreground mt-1">Evaluating fund types and structures → Better questions for managers</p>
                </div>
                <div>
                  <Users className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-medium text-foreground text-sm">Advisors and lawyers</h4>
                  <p className="text-xs text-muted-foreground mt-1">Quick structured overview for clients → Time saved, fewer surprises</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Movingto Group */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <Globe className="h-8 w-8 text-primary shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                    About Movingto Group
                  </h2>
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      Movingto Funds is part of Movingto — a platform helping people navigate global mobility, from visas to relocation.
                    </p>
                    <p>
                      <strong className="text-foreground">Movingto Funds is owned and operated by Movingto Group (</strong>
                      <a 
                        href="https://group.movingto.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        group.movingto.com
                      </a>
                      <strong className="text-foreground">).</strong>
                    </p>
                    <p>
                      Movingto has supported Golden Visa applicants since 2020 across multiple destinations including Portugal, Spain, and Greece.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Frequently Asked */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Frequently Asked
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                <AccordionItem value="item-1" className="bg-background border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    How do I compare funds?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Use the <Link to="/compare" className="text-primary hover:underline">comparison tool</Link> to select any two funds and view terms side by side.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-background border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    What does "verified" mean?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Verified funds have completed our documented-check process. This confirms stated terms match available documents. It is not a certification or endorsement.{" "}
                    <Link to="/verification-program" className="text-primary hover:underline">Learn more</Link>.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-background border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    How do I know which fund is right for me?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Start with the <Link to="/fund-matcher" className="text-primary hover:underline">fund matcher quiz</Link> to narrow options based on your preferences, then compare shortlisted funds.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-background border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    How often is fund information updated?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    We update fund profiles as information changes. If you spot something outdated, contact us at info@movingto.com.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-background border border-border rounded-lg px-4">
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">
                    Is Movingto Funds free to use?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Yes. Browsing fund profiles, using comparisons, and taking the fund matcher quiz are all free.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        {/* Explore CTA Block */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Explore
              </h2>
              <p className="text-muted-foreground mb-8">
                Start comparing Portugal Golden Visa funds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/">Browse Funds</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/compare">Compare Funds</Link>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <Link to="/fund-matcher">Take the Fund Quiz</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Disclosure Line */}
        <div className="container mx-auto px-4 pb-8">
          <p className="text-center text-xs text-muted-foreground">
            Commercial relationships and important information: see our{" "}
            <Link to="/disclaimer" className="underline hover:text-foreground">
              Disclosure
            </Link>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
