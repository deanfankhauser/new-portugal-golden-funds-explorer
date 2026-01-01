import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageSEO from "@/components/common/PageSEO";
import { 
  FileText, 
  GitCompare, 
  Building2, 
  BookOpen,
  ArrowRight,
  Globe
} from "lucide-react";

const About = () => {
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
                About Movingto Funds
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                A clearer way to compare Portugal Golden Visa funds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/">
                    Explore Funds
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/fund-matcher">
                    How It Works
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Built This */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Why we built this
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Portugal Golden Visa fund research is fragmented. Marketing materials dominate. 
                Comparing key terms across funds takes hours.
              </p>
              <p>
                We built Movingto Funds to fix that. One place to see the numbers that matter — 
                fees, minimums, lock-ups, strategies — in a structured format.
              </p>
              <p>
                The goal: help you shortlist faster, ask better questions, and avoid surprises.
              </p>
            </div>
          </div>
        </section>

        {/* What the Platform Does */}
        <section className="bg-muted/20 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                What the platform does
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Fund profiles</h3>
                        <p className="text-sm text-muted-foreground">
                          Key terms surfaced: fees, minimums, lock-up periods, strategies, and risk levels.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <GitCompare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Side-by-side comparisons</h3>
                        <p className="text-sm text-muted-foreground">
                          See differences at a glance across any funds you're considering.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Manager pages</h3>
                        <p className="text-sm text-muted-foreground">
                          Fund portfolios and firm backgrounds in one place.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">Plain-English guides</h3>
                        <p className="text-sm text-muted-foreground">
                          Understand what to look for without wading through jargon.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How We Approach Accuracy */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              How we approach accuracy
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We source information from official fund documents where available, public filings, 
                and direct clarifications from fund managers.
              </p>
              <p>
                We update pages as information changes. If you spot something outdated, 
                let us know at info@movingto.com.
              </p>
            </div>
          </div>
        </section>

        {/* Who We're For */}
        <section className="bg-muted/20 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Who we're for
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Applicants</strong> exploring their options for the first time.
                </p>
                <p>
                  <strong className="text-foreground">Families</strong> comparing trade-offs between different fund types.
                </p>
                <p>
                  <strong className="text-foreground">Advisors</strong> who need a fast, structured overview.
                </p>
                <p className="pt-2">
                  The outcome: faster shortlisting, better questions for fund managers, 
                  and fewer surprises down the road.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Movingto Connection */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="border-border/50 bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                      The Movingto connection
                    </h2>
                    <div className="space-y-3 text-muted-foreground">
                      <p>
                        Movingto Funds is part of Movingto — a platform helping people navigate 
                        global mobility, from visas to relocation.
                      </p>
                      <p>
                        <strong className="text-foreground">Ownership:</strong> Movingto Funds is owned and operated by{" "}
                        <a 
                          href="https://group.movingto.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Movingto Group
                        </a>.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-muted/20 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Ready to explore?
              </h2>
              <p className="text-muted-foreground mb-8">
                Browse fund profiles, compare options, and find what fits your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link to="/">
                    Browse Funds
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/compare">
                    Compare Funds
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Disclosure Line */}
        <section className="container mx-auto px-4 py-8 border-t">
          <p className="text-center text-sm text-muted-foreground">
            See our{" "}
            <Link to="/disclaimer" className="text-primary hover:underline">
              Disclaimer page
            </Link>{" "}
            for commercial relationships and important information.
          </p>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
