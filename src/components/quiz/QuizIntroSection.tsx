import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Shield, Users, TrendingUp, Globe } from 'lucide-react';

const QuizIntroSection: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <h2 className="text-2xl font-bold mb-6 text-foreground">How the Fund Matcher Works</h2>
      
      <p className="text-muted-foreground leading-relaxed mb-6">
        Finding the right investment fund for Portugal's Golden Visa program can be overwhelming. 
        With over 30 CMVM-regulated funds offering varying strategies, fees, and lock-up periods, 
        making an informed decision requires careful analysis of your personal circumstances.
      </p>

      <p className="text-muted-foreground leading-relaxed mb-8">
        Our Fund Matcher quiz simplifies this process by asking 5 targeted questions about your 
        investment preferences. In under 2 minutes, you'll receive personalized recommendations 
        based on funds that match your budget, risk tolerance, nationality, timeline, and income needs.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8 not-prose">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground mb-1">2 Minutes to Complete</h3>
            <p className="text-sm text-muted-foreground">5 simple questions to understand your investment profile</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground mb-1">CMVM-Regulated Funds Only</h3>
            <p className="text-sm text-muted-foreground">All recommended funds are verified and regulated in Portugal</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground mb-1">Nationality-Aware</h3>
            <p className="text-sm text-muted-foreground">US PFIC compliance and other nationality-specific considerations</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-medium text-foreground mb-1">Risk-Matched Results</h3>
            <p className="text-sm text-muted-foreground">Recommendations aligned with your risk tolerance</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-foreground">Who Should Use the Fund Matcher?</h2>

      <div className="space-y-4 mb-8 not-prose">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">US Citizens & Residents:</strong> Our quiz identifies PFIC-compliant 
            funds to help you avoid significant IRS penalties. US investors face unique tax considerations that 
            most Golden Visa advisors overlook.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Conservative Investors:</strong> If capital preservation is your 
            priority, we'll recommend funds with lower volatility, established track records, and focus on 
            stable asset classes like debt and infrastructure.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Growth-Focused Investors:</strong> For those comfortable with 
            higher risk, we'll surface venture capital, private equity, and emerging sector funds with 
            higher target returns.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">Income Seekers:</strong> Need regular distributions? We filter 
            for funds offering annual or quarterly dividend payments to support your cash flow needs.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
          <p className="text-muted-foreground">
            <strong className="text-foreground">First-Time Golden Visa Applicants:</strong> New to Portugal's 
            investment fund landscape? The quiz cuts through complexity and gives you a shortlist to research further.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-foreground">What We Evaluate</h2>

      <p className="text-muted-foreground leading-relaxed mb-6">
        Our matching algorithm considers multiple factors to find funds aligned with your goals:
      </p>

      <ul className="space-y-2 mb-8 not-prose">
        <li className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
          <span><strong className="text-foreground">Investment Amount:</strong> Minimum subscription requirements (€100K–€500K+)</span>
        </li>
        <li className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
          <span><strong className="text-foreground">Risk Tolerance:</strong> Conservative, moderate, or aggressive strategies</span>
        </li>
        <li className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
          <span><strong className="text-foreground">Lock-Up Period:</strong> How long your capital is committed (5–10+ years)</span>
        </li>
        <li className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
          <span><strong className="text-foreground">Nationality:</strong> US PFIC compliance and tax treaty considerations</span>
        </li>
        <li className="flex items-center gap-2 text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
          <span><strong className="text-foreground">Income Needs:</strong> Distribution frequency and dividend policies</span>
        </li>
      </ul>

      <p className="text-muted-foreground leading-relaxed">
        After completing the quiz, you can compare your matched funds in detail, view their full profiles, 
        and contact fund managers directly. Prefer to browse manually? Visit our{' '}
        <Link to="/" className="text-primary hover:underline">complete fund directory</Link> or explore by{' '}
        <Link to="/categories" className="text-primary hover:underline">investment category</Link>.
      </p>
    </div>
  );
};

export default QuizIntroSection;
