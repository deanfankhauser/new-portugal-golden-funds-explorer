import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const MAILTO_HREF = 'mailto:info@movingto.com?subject=Fund%20Submission%20-%20Movingto';

export default function SubmitFundMailto() {
  React.useEffect(() => {
    // Small delay so the page paints (helps when a browser blocks immediate redirects)
    const t = window.setTimeout(() => {
      window.location.href = MAILTO_HREF;
    }, 50);

    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <Helmet>
        <title>Submit Your Fund | Movingto</title>
        <meta
          name="description"
          content="Contact Movingto to submit your fund for review."
        />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="https://movingto.com/contact" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-10 max-w-2xl">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Submit your fund</h1>
            <p className="text-muted-foreground">
              We’ve replaced the form with email submissions. Your email client should
              open automatically.
            </p>
          </header>

          <section className="mt-6 rounded-lg border bg-card p-6">
            <p className="text-sm text-muted-foreground">
              If nothing happens, click the button below:
            </p>
            <div className="mt-4">
              <Button asChild>
                <a href={MAILTO_HREF}>Email info@movingto.com</a>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
