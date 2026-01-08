import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen } from 'lucide-react';

export const USTaxTopics: React.FC = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        US tax topics to discuss with your advisor
      </h2>
      
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-amber-700 dark:text-amber-400">
            Tax complexity varies by situation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            US tax treatment of foreign investments can be complex and varies significantly based on your individual circumstances, the fund structure, and how the fund is classified for US tax purposes.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-foreground">PFIC Considerations</h4>
              <p className="text-sm text-muted-foreground">
                PFIC (Passive Foreign Investment Company) is a commonly discussed topic. Some funds offer QEF elections that may affect tax treatment. The specifics depend on your situation.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground">Professional Guidance</h4>
              <p className="text-sm text-muted-foreground">
                Before investing, speak with a US-qualified tax professional who understands foreign fund investments and FATCA reporting requirements.
              </p>
            </div>
          </div>
          
          {/* CTA to detailed tax guide */}
          <div className="border-t border-amber-500/20 pt-4 mt-4">
            <Link to="/funds/us-tax-guide">
              <Button variant="outline" className="gap-2 border-amber-500/30 hover:bg-amber-500/10">
                <BookOpen className="h-4 w-4" />
                Read our detailed PFIC & FATCA Guide
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground border-t border-border/50 pt-4 mt-4">
            This section is informational only and does not constitute tax advice. Tax laws change frequently and their application depends on individual circumstances.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export default USTaxTopics;
