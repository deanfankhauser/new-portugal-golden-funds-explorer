import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import FAQSection from '@/components/common/FAQSection';
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  Eye,
  BarChart3,
  RefreshCcw,
  Scale,
  Lightbulb,
  Heart,
  Database,
  Activity,
  CheckCircle2,
  Building2,
  Globe
} from 'lucide-react';

const About = () => {
  const stats = [
    { label: "Funds Analyzed", value: "25+", icon: Database },
    { label: "Data Points per Fund", value: "50+", icon: BarChart3 },
    { label: "Regular Updates", value: "Monthly", icon: RefreshCcw },
    { label: "Independent Analysis", value: "100%", icon: Scale }
  ];

  const whyChooseUs = [
    {
      icon: Award,
      title: "Expert Curation",
      description: "Every fund is analyzed by financial professionals with deep knowledge of Portuguese investment regulations and Golden Visa requirements."
    },
    {
      icon: Database,
      title: "Comprehensive Data",
      description: "Access all critical metrics in one place - from performance history to fee structures, minimum investments to redemption terms."
    },
    {
      icon: RefreshCcw,
      title: "Regular Updates",
      description: "Our database is continuously maintained with the latest fund information, ensuring you always have current data for your decisions."
    },
    {
      icon: Scale,
      title: "Independent Analysis",
      description: "We maintain complete independence with no conflicts of interest. Our analysis is unbiased and focused solely on investor value."
    },
    {
      icon: Building2,
      title: "Part of Movingto",
      description: "Backed by Portugal's leading relocation platform with 2,678+ happy customers and extensive expertise in Portuguese residency."
    },
    {
      icon: CheckCircle2,
      title: "Free Access",
      description: "All comparison tools, fund data, and analysis features are completely free. No hidden fees or premium paywalls."
    }
  ];

  const values = [
    {
      icon: Eye,
      title: "Transparency",
      description: "No hidden agendas. We clearly disclose our methodology, data sources, and any limitations in our analysis."
    },
    {
      icon: ShieldCheck,
      title: "Accuracy",
      description: "Rigorous verification processes ensure our data is reliable. We update information regularly and fact-check all fund details."
    },
    {
      icon: Scale,
      title: "Independence",
      description: "We don't accept payments from fund managers for listings or rankings. Our analysis is completely unbiased."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Continuously improving our platform with new features, better data visualization, and enhanced comparison tools."
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Built for investors, by investment professionals. Every feature is designed to help you make better decisions."
    }
  ];

  const faqs = [
    {
      question: "Is this service free?",
      answer: "Yes, completely free. All fund data, comparison tools, and analysis features are available at no cost. We believe investors deserve access to quality information without paywalls."
    },
    {
      question: "How do you make money?",
      answer: "We're supported by our parent company, Movingto.com, which provides comprehensive relocation services to Portugal. We don't charge investors or accept payments from fund managers for listings or rankings."
    },
    {
      question: "How often is data updated?",
      answer: "We update fund data monthly, with critical changes (like fee structures or regulatory status) updated as soon as we're notified. Each fund page shows the last update date."
    },
    {
      question: "Are you affiliated with any fund managers?",
      answer: "No. We maintain complete independence from all fund managers. We don't receive commissions, referral fees, or promotional payments that could bias our analysis."
    },
    {
      question: "Can fund managers edit their profiles?",
      answer: "Fund managers can suggest updates to their fund information through our verification process. All changes are reviewed and fact-checked by our team before publication to ensure accuracy and prevent bias."
    },
    {
      question: "What is your connection to Movingto.com?",
      answer: "Movingto Funds is part of the Movingto family, Portugal's leading relocation platform. We leverage their expertise in Portuguese residency, tax planning, and legal matters to provide comprehensive fund analysis."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageSEO pageType="about" />
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
          
          <div className="container-responsive-padding relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
                <Building2 className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Part of the Movingto Family</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                About <span className="text-accent italic font-cheltenham">Movingto Funds</span>
              </h1>
              
              <p className="text-xl text-medium-contrast leading-relaxed mb-8">
                Your trusted resource for Portugal Golden Visa investment fund analysis. 
                Independent, comprehensive, and always up-to-date.
              </p>
              
              {/* Link to Main Hub */}
              <div className="mb-4">
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

              <div className="flex flex-wrap justify-center gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border">
                      <Icon className="w-4 h-4 text-accent" />
                      <div className="text-left">
                        <div className="font-bold text-lg">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Company Overview Section */}
        <section className="py-16 sm:py-20">
          <div className="container-responsive-padding">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <Card>
                  <CardHeader>
                    <Target className="w-10 h-10 text-accent mb-4" />
                    <CardTitle>What We Do</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-medium-contrast leading-relaxed">
                      We provide comprehensive analysis and comparison tools for Portugal Golden Visa investment funds. 
                      Our platform aggregates fund data, tracks performance metrics, and delivers independent analysis 
                      to help investors make informed decisions about their Golden Visa investments. All funds listed meet the{' '}
                      <a 
                        href="https://movingto.com/pt/portugal-golden-visa" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 underline"
                      >
                        official Portugal Golden Visa requirements
                      </a>.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <Activity className="w-10 h-10 text-accent mb-4" />
                    <CardTitle>Our Mission</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-medium-contrast leading-relaxed">
                      To democratize access to professional-grade investment fund analysis. We believe every investor 
                      deserves transparent, accurate, and unbiased information when choosing Golden Visa investment funds. 
                      Our goal is to bring clarity to a complex market.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Globe className="w-10 h-10 text-accent flex-shrink-0" />
                    <div>
                      <CardTitle className="mb-2">The Movingto Connection</CardTitle>
                      <CardDescription>
                        Movingto Funds is part of Movingto.com, Portugal's leading relocation platform with over 2,678 happy customers 
                        and a 5-star reputation. We leverage our parent company's deep expertise in Portuguese residency law, tax planning, 
                        and legal matters to provide comprehensive fund analysis backed by real-world relocation experience.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="outline" asChild>
                      <a href="https://www.movingto.com" target="_blank" rel="noopener noreferrer">
                        Visit Movingto.com
                      </a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="https://www.movingto.com/about" target="_blank" rel="noopener noreferrer">
                        About Movingto
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Why Choose Us Section */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container-responsive-padding">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Why Choose <span className="text-accent italic font-cheltenham">Our Platform</span>
                </h2>
                <p className="text-lg text-medium-contrast max-w-3xl mx-auto">
                  We've built the most comprehensive Golden Visa fund analysis platform with features designed 
                  specifically for serious investors.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {whyChooseUs.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <Icon className="w-8 h-8 text-accent mb-3" />
                        <CardTitle className="text-xl">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-medium-contrast leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Methodology Section */}
        <section className="py-16 sm:py-20">
          <div className="container-responsive-padding">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Our <span className="text-accent italic font-cheltenham">Methodology</span>
                </h2>
                <p className="text-lg text-medium-contrast">
                  Transparency is at the core of everything we do. Here's how we research, verify, and analyze investment funds.
                </p>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="research" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg font-semibold">Data Collection & Research</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-medium-contrast leading-relaxed">
                    We gather fund data from multiple authoritative sources including CMVM (Portuguese Securities Market Commission) 
                    filings, fund prospectuses, annual reports, and direct communication with fund managers. Each data point is 
                    cross-referenced across at least two sources to ensure accuracy.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="verification" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg font-semibold">Verification Process</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-medium-contrast leading-relaxed">
                    All fund information undergoes a rigorous verification process. We confirm regulatory status with CMVM, 
                    validate performance data against official reports, and verify Golden Visa eligibility requirements. 
                    Fund managers can suggest updates, but all changes are independently verified before publication.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="scoring" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg font-semibold">Fund Scoring & Ranking</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-medium-contrast leading-relaxed">
                    Our ranking algorithm considers multiple factors including historical performance, fee structures, 
                    fund size and liquidity, management team experience, regulatory compliance, and investor accessibility. 
                    No single metric dominates the score - we use a balanced approach that reflects real-world investor priorities.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="updates" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg font-semibold">Update Frequency & Standards</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-medium-contrast leading-relaxed">
                    We update fund data monthly, with critical changes (regulatory status, fee modifications, 
                    Golden Visa eligibility) updated immediately upon verification. Each fund page displays the last update date. 
                    Our team monitors regulatory announcements, fund disclosures, and market changes daily.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="limitations" className="border rounded-lg px-6">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-lg font-semibold">Transparency & Limitations</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-medium-contrast leading-relaxed">
                    While we strive for completeness, we acknowledge limitations. Some funds may not disclose all information publicly. 
                    Performance data is historical and doesn't guarantee future results. Our analysis provides information for research 
                    purposes and shouldn't replace professional financial advice tailored to your situation.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <Separator />

        {/* Values Section */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container-responsive-padding">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Our <span className="text-accent italic font-cheltenham">Values</span>
                </h2>
                <p className="text-lg text-medium-contrast max-w-3xl mx-auto">
                  These principles guide every decision we make and every feature we build.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="mx-auto w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                          <Icon className="w-8 h-8 text-accent" />
                        </div>
                        <CardTitle>{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-medium-contrast leading-relaxed">{value.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* FAQ Section */}
        <section className="py-16 sm:py-20">
          <div className="container-responsive-padding">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Frequently Asked <span className="text-accent italic font-cheltenham">Questions</span>
              </h2>
              <p className="text-lg text-medium-contrast mb-8">
                Common questions about our platform, methodology, and services.
              </p>
            </div>
            
            <FAQSection 
              faqs={faqs}
              title=""
              schemaId="about-faq"
            />
          </div>
        </section>

        <Separator />

        {/* CTA Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-transparent">
          <div className="container-responsive-padding">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to <span className="text-accent italic font-cheltenham">Get Started?</span>
              </h2>
              <p className="text-lg text-medium-contrast mb-8 max-w-2xl mx-auto">
                Explore our comprehensive fund database, compare investment options, or learn more about 
                the Portugal Golden Visa program.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link to="/">Browse All Funds</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/comparisons">Compare Funds</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="https://www.movingto.com/golden-visa" target="_blank" rel="noopener noreferrer">
                    Learn About Golden Visa
                  </a>
                </Button>
              </div>

              <div className="mt-12 pt-8 border-t">
                <p className="text-medium-contrast mb-4">
                  Need professional guidance for your Portugal relocation?
                </p>
                <Button variant="secondary" asChild>
                  <a href="https://www.movingto.com/contact" target="_blank" rel="noopener noreferrer">
                    Contact Movingto for Expert Help
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
