
import { Target, Clock, Euro, User } from 'lucide-react';

export const quizQuestions = [
  {
    key: 'riskAppetite',
    title: 'What is your risk appetite?',
    subtitle: 'Understanding your comfort level with investment volatility helps us recommend suitable funds',
    helpText: 'Risk appetite reflects how much volatility you can handle in your investment returns. Higher risk typically offers potential for higher returns but with greater uncertainty.',
    icon: Target,
    options: [
      {
        value: 'low',
        label: 'Conservative',
        description: 'I prefer stable, predictable returns with minimal risk of losing my principal investment',
        badge: 'Low Risk',
        badgeColor: 'bg-success/10 text-success'
      },
      {
        value: 'medium',
        label: 'Moderate', 
        description: 'I\'m comfortable with some volatility if it means potentially higher returns over time',
        badge: 'Balanced',
        badgeColor: 'bg-warning/10 text-warning'
      },
      {
        value: 'high',
        label: 'Aggressive',
        description: 'I\'m willing to accept significant volatility for the potential of substantial returns',
        badge: 'High Risk',
        badgeColor: 'bg-destructive/10 text-destructive'
      }
    ]
  },
  {
    key: 'investmentHorizon',
    title: 'What is your investment time horizon?',
    subtitle: 'Your timeline affects which investment strategies and fund structures are most appropriate',
    helpText: 'Longer investment horizons typically allow for more aggressive strategies as there\'s more time to recover from short-term volatility.',
    icon: Clock,
    options: [
      {
        value: 'short',
        label: 'Short-term (1-5 years)',
        description: 'I need access to my investment relatively soon or prefer more liquid options',
        badge: '1-5 Years',
        badgeColor: 'bg-accent/10 text-accent'
      },
      {
        value: 'medium',
        label: 'Medium-term (5-10 years)',
        description: 'I can wait several years for my investment to mature and am planning for medium-term goals',
        badge: '5-10 Years',
        badgeColor: 'bg-primary/10 text-primary'
      },
      {
        value: 'long',
        label: 'Long-term (10+ years)',
        description: 'I\'m investing for the long haul and can wait for maximum growth potential',
        badge: '10+ Years',
        badgeColor: 'bg-secondary/10 text-secondary-foreground'
      }
    ]
  },
  {
    key: 'ticketSize',
    title: 'What is your investment budget?',
    subtitle: 'Different funds have varying minimum investment requirements',
    helpText: 'Your investment amount determines which funds you can access. Larger investments often provide access to institutional-grade opportunities.',
    icon: Euro,
    isSelect: true,
    selectOptions: [
      { 
        value: 'fund-minimums', 
        label: 'Fund subscription minimums',
        description: 'GV still requires €500,000 total'
      },
      { 
        value: '300k-500k', 
        label: '€300,000 - €500,000',
        description: 'Standard Golden Visa range'
      },
      { 
        value: 'over-500k', 
        label: 'Over €500,000',
        description: 'Premium investment opportunities'
      }
    ]
  },
  {
    key: 'citizenship',
    title: 'What is your citizenship?',
    subtitle: 'Some funds have specific requirements or tax implications based on nationality',
    helpText: 'Citizenship affects tax treatment, regulatory compliance, and eligibility for certain investment structures.',
    icon: User,
    isSelect: true,
    selectOptions: [
      { value: 'us', label: 'United States', description: 'PFIC and tax reporting considerations' },
      { value: 'uk', label: 'United Kingdom', description: 'Post-Brexit investment structures' },
      { value: 'australia', label: 'Australia', description: 'CFC and tax transparency rules' },
      { value: 'canada', label: 'Canada', description: 'FBAR and tax treaty benefits' },
      { value: 'china', label: 'China', description: 'Capital controls and approval requirements' },
      { value: 'other', label: 'Other', description: 'Please specify during consultation' }
    ]
  }
];
