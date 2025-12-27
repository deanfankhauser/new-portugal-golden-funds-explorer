import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, CheckCircle2, Share2, XCircle, AlertTriangle } from 'lucide-react';
import { QuizFunnelChart } from './QuizFunnelChart';
import { QuizAbandonmentBreakdown } from './QuizAbandonmentBreakdown';

interface QuizStats {
  total_started: number;
  total_completed: number;
  total_shared: number;
  total_abandoned: number;
  completion_rate: number;
  share_rate: number;
  avg_results: number;
  zero_results: number;
}

interface PopularAnswer {
  question: string;
  answer: string;
  count: number;
}

interface UnderservedSegment {
  answers: Record<string, string>;
  count: number;
  lastOccurred: string;
}

interface FunnelStep {
  step: number;
  label: string;
  count: number;
  dropOffCount: number;
  dropOffRate: number;
  retentionRate: number;
}

interface AbandonmentPattern {
  step: number;
  stepLabel: string;
  answers: Record<string, string>;
  count: number;
  percentage: number;
}

export const QuizAnalyticsTab: React.FC = () => {
  const [stats, setStats] = useState<QuizStats | null>(null);
  const [popularAnswers, setPopularAnswers] = useState<PopularAnswer[]>([]);
  const [underservedSegments, setUnderservedSegments] = useState<UnderservedSegment[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelStep[]>([]);
  const [abandonmentPatterns, setAbandonmentPatterns] = useState<AbandonmentPattern[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Fetch event counts
      const { data: events, error: eventsError } = await supabase
        .from('quiz_analytics')
        .select('event_type, results_count, answers, created_at, abandoned_at_step');

      if (eventsError) throw eventsError;

      // Calculate stats
      const started = events?.filter(e => e.event_type === 'started').length || 0;
      const completed = events?.filter(e => e.event_type === 'completed').length || 0;
      const shared = events?.filter(e => e.event_type === 'shared').length || 0;
      const abandoned = events?.filter(e => e.event_type === 'abandoned').length || 0;

      const completedEvents = events?.filter(e => e.event_type === 'completed') || [];
      const avgResults = completedEvents.length > 0
        ? completedEvents.reduce((sum, e) => sum + (e.results_count || 0), 0) / completedEvents.length
        : 0;

      // Track zero results
      const zeroResultEvents = completedEvents.filter(e => e.results_count === 0);

      setStats({
        total_started: started,
        total_completed: completed,
        total_shared: shared,
        total_abandoned: abandoned,
        completion_rate: started > 0 ? (completed / started) * 100 : 0,
        share_rate: completed > 0 ? (shared / completed) * 100 : 0,
        avg_results: Math.round(avgResults * 10) / 10,
        zero_results: zeroResultEvents.length,
      });

      // Analyze popular answers
      const answerCounts: Record<string, Record<string, number>> = {};
      completedEvents.forEach(event => {
        if (event.answers) {
          Object.entries(event.answers).forEach(([key, value]) => {
            if (!answerCounts[key]) answerCounts[key] = {};
            if (!answerCounts[key][value as string]) answerCounts[key][value as string] = 0;
            answerCounts[key][value as string]++;
          });
        }
      });

      // Get most popular answer for each question
      const popular: PopularAnswer[] = Object.entries(answerCounts).map(([question, answers]) => {
        const [topAnswer, count] = Object.entries(answers).sort((a, b) => b[1] - a[1])[0];
        return {
          question: formatQuestionLabel(question),
          answer: formatAnswerLabel(question, topAnswer),
          count,
        };
      });

      setPopularAnswers(popular);

      // Analyze underserved segments (zero results)
      const segmentMap = new Map<string, { answers: Record<string, string>; count: number; lastOccurred: string }>();
      
      zeroResultEvents.forEach(event => {
        if (event.answers) {
          const key = JSON.stringify(event.answers);
          if (segmentMap.has(key)) {
            const existing = segmentMap.get(key)!;
            existing.count++;
          } else {
            segmentMap.set(key, {
              answers: event.answers as Record<string, string>,
              count: 1,
              lastOccurred: event.created_at || new Date().toISOString(),
            });
          }
        }
      });

      // Sort by frequency and get top underserved segments
      const underserved = Array.from(segmentMap.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setUnderservedSegments(underserved);

      // Calculate funnel data
      const questionLabels = ['Budget', 'Strategy', 'Income', 'Risk Tolerance', 'Timeline'];
      const totalStarted = started;
      
      // Count users who reached each step (0 = started, 1-5 = questions)
      const stepCounts = new Array(6).fill(0);
      stepCounts[0] = totalStarted; // Everyone who started

      // Count completed (reached step 5 and finished)
      stepCounts[5] = completed;

      // Count abandoned at each step
      const abandonedAtStep = new Array(6).fill(0);
      events?.filter(e => e.event_type === 'abandoned').forEach(event => {
        const step = event.abandoned_at_step || 0;
        if (step >= 0 && step < 6) {
          abandonedAtStep[step]++;
        }
      });

      // Calculate cumulative counts working backwards
      for (let i = 4; i >= 0; i--) {
        // Users at this step = users at next step + users who abandoned at this step
        stepCounts[i] = stepCounts[i + 1] + abandonedAtStep[i];
      }

      // Build funnel data
      const funnel: FunnelStep[] = [];
      for (let i = 0; i <= 5; i++) {
        const count = stepCounts[i];
        const nextCount = i < 5 ? stepCounts[i + 1] : count;
        const dropOffCount = count - nextCount;
        const dropOffRate = count > 0 ? (dropOffCount / count) * 100 : 0;
        const retentionRate = totalStarted > 0 ? (count / totalStarted) * 100 : 0;

        funnel.push({
          step: i,
          label: i === 0 ? 'Quiz Started' : questionLabels[i - 1],
          count,
          dropOffCount,
          dropOffRate,
          retentionRate,
        });
      }

      setFunnelData(funnel);

      // Calculate abandonment patterns - group by step and answer combination
      const abandonmentMap = new Map<string, { step: number; answers: Record<string, string>; count: number }>();
      
      events?.filter(e => e.event_type === 'abandoned' && e.abandoned_at_step != null).forEach(event => {
        const step = event.abandoned_at_step!;
        const answers = event.answers as Record<string, string> || {};
        const key = `${step}_${JSON.stringify(answers)}`;
        
        if (abandonmentMap.has(key)) {
          abandonmentMap.get(key)!.count++;
        } else {
          abandonmentMap.set(key, { step, answers, count: 1 });
        }
      });

      // Convert to array and calculate percentages
      const abandonmentList: AbandonmentPattern[] = Array.from(abandonmentMap.values()).map(pattern => {
        const stepLabel = pattern.step === 0 
          ? 'Quiz Started' 
          : questionLabels[pattern.step - 1];
        
        const percentage = abandoned > 0 ? (pattern.count / abandoned) * 100 : 0;
        
        return {
          step: pattern.step,
          stepLabel,
          answers: pattern.answers,
          count: pattern.count,
          percentage,
        };
      });

      // Sort by count descending
      abandonmentList.sort((a, b) => b.count - a.count);
      
      setAbandonmentPatterns(abandonmentList);
    } catch (error) {
      console.error('Failed to fetch quiz analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatQuestionLabel = (key: string): string => {
    const labels: Record<string, string> = {
      budget: 'Budget',
      strategy: 'Strategy',
      income: 'Income',
      riskTolerance: 'Risk Tolerance',
      timeline: 'Timeline',
    };
    return labels[key] || key;
  };

  const formatAnswerLabel = (questionKey: string, value: string): string => {
    const labels: Record<string, Record<string, string>> = {
      budget: {
        'under250k': 'Under €250k',
        'under500k': 'Under €500k',
        '500k+': '€500k+',
      },
      strategy: {
        safety: 'Safety & Stability',
        growth: 'Growth & Returns',
        fast_exit: 'Fast Exit',
      },
      income: {
        yes: 'Yes',
        no: 'No',
      },
      riskTolerance: {
        conservative: 'Conservative',
        moderate: 'Moderate',
        aggressive: 'Aggressive',
      },
      timeline: {
        '1-3years': '1–3 years',
        '3-5years': '3–5 years',
        '5plus': '5+ years',
      },
    };
    return labels[questionKey]?.[value] || value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center p-12 text-muted-foreground">
        No quiz analytics data available yet
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Funnel Analysis */}
      {funnelData.length > 0 && (
        <QuizFunnelChart funnelData={funnelData} totalStarted={stats?.total_started || 0} />
      )}

      {/* Abandonment Breakdown */}
      {abandonmentPatterns.length > 0 && (
        <QuizAbandonmentBreakdown 
          patterns={abandonmentPatterns} 
          totalAbandoned={stats?.total_abandoned || 0} 
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Quiz Started</p>
              <p className="text-2xl font-bold">{stats.total_started}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-lg">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">{stats.total_completed}</p>
              <p className="text-xs text-muted-foreground">
                {stats.completion_rate.toFixed(1)}% completion rate
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Share2 className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Shared</p>
              <p className="text-2xl font-bold">{stats.total_shared}</p>
              <p className="text-xs text-muted-foreground">
                {stats.share_rate.toFixed(1)}% of completions
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <XCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Abandoned</p>
              <p className="text-2xl font-bold">{stats.total_abandoned}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Additional Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Average Matching Funds</span>
            <span className="font-semibold">{stats.avg_results} funds</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Completion Rate</span>
            <span className="font-semibold">{stats.completion_rate.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Share Rate</span>
            <span className="font-semibold">{stats.share_rate.toFixed(1)}%</span>
          </div>
        </div>
      </Card>

      {/* Underserved Segments Alert */}
      {underservedSegments.length > 0 && (
        <Card className="p-6 border-destructive/50 bg-destructive/5">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-destructive">Underserved Segments</h3>
              <p className="text-sm text-muted-foreground mt-1">
                These answer combinations frequently return zero results. Consider adding funds to serve these investor needs.
              </p>
            </div>
            <Badge variant="destructive">{stats?.zero_results || 0} zero results</Badge>
          </div>
          <div className="space-y-4">
            {underservedSegments.map((segment, index) => (
              <Card key={index} className="p-4 bg-background">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-destructive border-destructive">
                    {segment.count} occurrences
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Last: {new Date(segment.lastOccurred).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(segment.answers).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-xs text-muted-foreground">{formatQuestionLabel(key)}</p>
                      <p className="text-sm font-medium">{formatAnswerLabel(key, value)}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* Popular Answers */}
      {popularAnswers.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Most Popular Answers</h3>
          <div className="space-y-3">
            {popularAnswers.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.question}</p>
                  <p className="text-sm text-muted-foreground">{item.answer}</p>
                </div>
                <span className="text-sm font-semibold">{item.count} responses</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
