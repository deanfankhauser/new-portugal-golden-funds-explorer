import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Zap, Clock } from 'lucide-react';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: { good: number; needsImprovement: number };
  icon: React.ReactNode;
}

export const PerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    // Collect performance metrics
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
      const lcp = performance.getEntriesByType('largest-contentful-paint').slice(-1)[0];
      
      const newMetrics: PerformanceMetric[] = [
        {
          name: 'First Contentful Paint',
          value: fcp ? Math.round(fcp.startTime) : 0,
          unit: 'ms',
          threshold: { good: 1800, needsImprovement: 3000 },
          icon: <Zap className="h-4 w-4" />
        },
        {
          name: 'Largest Contentful Paint',
          value: lcp ? Math.round(lcp.startTime) : 0,
          unit: 'ms',
          threshold: { good: 2500, needsImprovement: 4000 },
          icon: <TrendingUp className="h-4 w-4" />
        },
        {
          name: 'DOM Content Loaded',
          value: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
          unit: 'ms',
          threshold: { good: 1500, needsImprovement: 3000 },
          icon: <Activity className="h-4 w-4" />
        },
        {
          name: 'Page Load Time',
          value: Math.round(navigation.loadEventEnd - navigation.fetchStart),
          unit: 'ms',
          threshold: { good: 3000, needsImprovement: 5000 },
          icon: <Clock className="h-4 w-4" />
        }
      ];

      setMetrics(newMetrics);

      // Calculate overall score
      const scores = newMetrics.map(metric => {
        if (metric.value <= metric.threshold.good) return 100;
        if (metric.value <= metric.threshold.needsImprovement) return 50;
        return 0;
      });
      
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      setScore(avgScore);
    };

    // Wait for page load to complete
    if (document.readyState === 'complete') {
      setTimeout(collectMetrics, 1000);
    } else {
      window.addEventListener('load', () => setTimeout(collectMetrics, 1000));
    }
  }, []);

  const getStatusColor = (value: number, threshold: { good: number; needsImprovement: number }) => {
    if (value <= threshold.good) return 'text-green-600';
    if (value <= threshold.needsImprovement) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (metrics.length === 0) return null;

  return (
    <Card className="border-border/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Performance Metrics</CardTitle>
          <Badge className={`${getScoreColor(score)} text-white`}>
            Score: {score}/100
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Real-time performance metrics for this page load
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border border-border/40"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-md">
                  {metric.icon}
                </div>
                <div>
                  <p className="font-medium text-sm">{metric.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Target: &lt;{metric.threshold.good}{metric.unit}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getStatusColor(metric.value, metric.threshold)}`}>
                  {metric.value}{metric.unit}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Stage 3 Optimizations Applied:</strong>
          </p>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>✓ Query caching with stale-while-revalidate (5min stale, 10min GC)</li>
            <li>✓ Optimized real-time subscriptions (selective fund updates)</li>
            <li>✓ Combined database queries (JOIN funds + rankings)</li>
            <li>✓ Pagination with infinite scroll capability</li>
            <li>✓ Loading skeletons for improved perceived performance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
