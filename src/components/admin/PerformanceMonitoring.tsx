import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Activity, AlertTriangle, TrendingUp, Clock, FileDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

interface PerformanceStats {
  avgLCP: number;
  avgFCP: number;
  total404s: number;
  totalErrors: number;
}

interface SlowPage {
  page_path: string;
  page_type: string;
  avg_lcp: number;
  avg_fcp: number;
  avg_load_time: number;
  sample_count: number;
}

interface ErrorRecord {
  id: string;
  error_type: string;
  page_path: string;
  error_message: string;
  referrer: string;
  count: number;
  last_seen: string;
}

interface ChartData {
  date: string;
  lcp: number;
  fcp: number;
  ttfb: number;
}

interface PageTypeData {
  page_type: string;
  avg_load_time: number;
}

export const PerformanceMonitoring = () => {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [slowPages, setSlowPages] = useState<SlowPage[]>([]);
  const [errors404, setErrors404] = useState<ErrorRecord[]>([]);
  const [allErrors, setAllErrors] = useState<ErrorRecord[]>([]);
  const [pageTypeData, setPageTypeData] = useState<PageTypeData[]>([]);
  const [dateRange, setDateRange] = useState<7 | 30 | 90>(7);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadChartData(),
        loadSlowPages(),
        load404Errors(),
        loadAllErrors(),
        loadPageTypeData(),
      ]);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const { data: perfData } = await supabase
      .from('page_performance_metrics')
      .select('lcp, fcp')
      .gte('timestamp', startDate.toISOString());

    const { count: error404Count } = await supabase
      .from('page_errors')
      .select('*', { count: 'exact', head: true })
      .eq('error_type', '404')
      .gte('timestamp', startDate.toISOString());

    const { count: totalErrorCount } = await supabase
      .from('page_errors')
      .select('*', { count: 'exact', head: true })
      .gte('timestamp', startDate.toISOString());

    if (perfData) {
      const avgLCP = perfData.reduce((sum, d) => sum + (d.lcp || 0), 0) / perfData.length;
      const avgFCP = perfData.reduce((sum, d) => sum + (d.fcp || 0), 0) / perfData.length;
      
      setStats({
        avgLCP: Math.round(avgLCP),
        avgFCP: Math.round(avgFCP),
        total404s: error404Count || 0,
        totalErrors: totalErrorCount || 0,
      });
    }
  };

  const loadChartData = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const { data } = await supabase
      .from('page_performance_metrics')
      .select('lcp, fcp, ttfb, timestamp')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: true });

    if (data) {
      const dailyData = data.reduce((acc: any, curr: any) => {
        const date = new Date(curr.timestamp).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { lcp: [], fcp: [], ttfb: [] };
        }
        if (curr.lcp) acc[date].lcp.push(curr.lcp);
        if (curr.fcp) acc[date].fcp.push(curr.fcp);
        if (curr.ttfb) acc[date].ttfb.push(curr.ttfb);
        return acc;
      }, {});

      const chartData = Object.entries(dailyData).map(([date, values]: any) => ({
        date,
        lcp: Math.round(values.lcp.reduce((a: number, b: number) => a + b, 0) / values.lcp.length),
        fcp: Math.round(values.fcp.reduce((a: number, b: number) => a + b, 0) / values.fcp.length),
        ttfb: Math.round(values.ttfb.reduce((a: number, b: number) => a + b, 0) / values.ttfb.length),
      }));

      setChartData(chartData);
    }
  };

  const loadSlowPages = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const { data } = await supabase
      .from('page_performance_metrics')
      .select('page_path, page_type, lcp, fcp, total_load_time')
      .gte('timestamp', startDate.toISOString());

    if (data) {
      const pageStats = data.reduce((acc: any, curr: any) => {
        const key = curr.page_path;
        if (!acc[key]) {
          acc[key] = {
            page_path: curr.page_path,
            page_type: curr.page_type,
            lcp: [],
            fcp: [],
            load_time: [],
          };
        }
        if (curr.lcp) acc[key].lcp.push(curr.lcp);
        if (curr.fcp) acc[key].fcp.push(curr.fcp);
        if (curr.total_load_time) acc[key].load_time.push(curr.total_load_time);
        return acc;
      }, {});

      const slowPages = Object.values(pageStats)
        .map((page: any) => ({
          page_path: page.page_path,
          page_type: page.page_type,
          avg_lcp: Math.round(page.lcp.reduce((a: number, b: number) => a + b, 0) / page.lcp.length),
          avg_fcp: Math.round(page.fcp.reduce((a: number, b: number) => a + b, 0) / page.fcp.length),
          avg_load_time: Math.round(page.load_time.reduce((a: number, b: number) => a + b, 0) / page.load_time.length),
          sample_count: page.lcp.length,
        }))
        .sort((a, b) => b.avg_load_time - a.avg_load_time)
        .slice(0, 20);

      setSlowPages(slowPages);
    }
  };

  const load404Errors = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const { data } = await supabase
      .from('page_errors')
      .select('*')
      .eq('error_type', '404')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false });

    if (data) {
      const grouped = data.reduce((acc: Record<string, ErrorRecord>, curr: any) => {
        if (!acc[curr.page_path]) {
          acc[curr.page_path] = {
            id: curr.id,
            error_type: curr.error_type,
            page_path: curr.page_path,
            error_message: curr.error_message,
            referrer: curr.referrer,
            count: 0,
            last_seen: curr.timestamp,
          };
        }
        acc[curr.page_path].count++;
        if (new Date(curr.timestamp) > new Date(acc[curr.page_path].last_seen)) {
          acc[curr.page_path].last_seen = curr.timestamp;
        }
        return acc;
      }, {});

      const errorRecords = Object.values(grouped).sort((a: any, b: any) => b.count - a.count);
      setErrors404(errorRecords as ErrorRecord[]);
    }
  };

  const loadAllErrors = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const { data } = await supabase
      .from('page_errors')
      .select('*')
      .gte('timestamp', startDate.toISOString())
      .order('timestamp', { ascending: false })
      .limit(100);

    if (data) {
      const errorRecords: ErrorRecord[] = data.map((err: any) => ({
        id: err.id,
        error_type: err.error_type,
        page_path: err.page_path,
        error_message: err.error_message || '',
        referrer: err.referrer || '',
        count: 1,
        last_seen: err.timestamp,
      }));
      setAllErrors(errorRecords);
    }
  };

  const loadPageTypeData = async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - dateRange);

    const { data } = await supabase
      .from('page_performance_metrics')
      .select('page_type, total_load_time')
      .gte('timestamp', startDate.toISOString());

    if (data) {
      const typeStats = data.reduce((acc: any, curr: any) => {
        if (!acc[curr.page_type]) {
          acc[curr.page_type] = [];
        }
        if (curr.total_load_time) {
          acc[curr.page_type].push(curr.total_load_time);
        }
        return acc;
      }, {});

      const pageTypeData = Object.entries(typeStats).map(([type, times]: any) => ({
        page_type: type,
        avg_load_time: Math.round(times.reduce((a: number, b: number) => a + b, 0) / times.length),
      })).sort((a, b) => b.avg_load_time - a.avg_load_time);

      setPageTypeData(pageTypeData);
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  if (loading) {
    return <div className="p-8">Loading performance data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex gap-2">
        <Button 
          variant={dateRange === 7 ? "default" : "outline"}
          onClick={() => setDateRange(7)}
        >
          Last 7 Days
        </Button>
        <Button 
          variant={dateRange === 30 ? "default" : "outline"}
          onClick={() => setDateRange(30)}
        >
          Last 30 Days
        </Button>
        <Button 
          variant={dateRange === 90 ? "default" : "outline"}
          onClick={() => setDateRange(90)}
        >
          Last 90 Days
        </Button>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg LCP</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgLCP || 0}ms</div>
            <p className="text-xs text-muted-foreground">
              {stats?.avgLCP && stats.avgLCP < 2500 ? '✓ Good' : '⚠ Needs Improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg FCP</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgFCP || 0}ms</div>
            <p className="text-xs text-muted-foreground">
              {stats?.avgFCP && stats.avgFCP < 1800 ? '✓ Good' : '⚠ Needs Improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">404 Errors</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total404s || 0}</div>
            <p className="text-xs text-muted-foreground">Broken links detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalErrors || 0}</div>
            <p className="text-xs text-muted-foreground">All error types</p>
          </CardContent>
        </Card>
      </div>

      {/* Core Web Vitals Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="lcp" stroke="#ef4444" name="LCP (ms)" />
              <Line type="monotone" dataKey="fcp" stroke="#3b82f6" name="FCP (ms)" />
              <Line type="monotone" dataKey="ttfb" stroke="#10b981" name="TTFB (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance by Page Type */}
      <Card>
        <CardHeader>
          <CardTitle>Performance by Page Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page_type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avg_load_time" fill="hsl(var(--primary))" name="Avg Load Time (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Slowest Pages */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Slowest Pages</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportToCSV(slowPages, 'slowest-pages.csv')}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Page Path</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-right p-2">Avg LCP</th>
                  <th className="text-right p-2">Avg FCP</th>
                  <th className="text-right p-2">Load Time</th>
                  <th className="text-right p-2">Samples</th>
                </tr>
              </thead>
              <tbody>
                {slowPages.map((page, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-mono text-xs">{page.page_path}</td>
                    <td className="p-2">{page.page_type}</td>
                    <td className="p-2 text-right">{page.avg_lcp}ms</td>
                    <td className="p-2 text-right">{page.avg_fcp}ms</td>
                    <td className="p-2 text-right font-semibold">{page.avg_load_time}ms</td>
                    <td className="p-2 text-right">{page.sample_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 404 Errors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>404 Errors</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportToCSV(errors404, '404-errors.csv')}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Page Path</th>
                  <th className="text-left p-2">Referrer</th>
                  <th className="text-right p-2">Count</th>
                  <th className="text-right p-2">Last Seen</th>
                </tr>
              </thead>
              <tbody>
                {errors404.map((error, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-mono text-xs">{error.page_path}</td>
                    <td className="p-2 font-mono text-xs truncate max-w-xs">{error.referrer || 'Direct'}</td>
                    <td className="p-2 text-right font-semibold">{error.count}</td>
                    <td className="p-2 text-right">{new Date(error.last_seen).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* All Errors */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Errors</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => exportToCSV(allErrors, 'all-errors.csv')}
          >
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Page</th>
                  <th className="text-left p-2">Message</th>
                  <th className="text-right p-2">When</th>
                </tr>
              </thead>
              <tbody>
                {allErrors.slice(0, 50).map((error) => (
                  <tr key={error.id} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        error.error_type === '404' ? 'bg-yellow-100 text-yellow-800' :
                        error.error_type === '500' ? 'bg-red-100 text-red-800' :
                        error.error_type === 'js_error' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {error.error_type}
                      </span>
                    </td>
                    <td className="p-2 font-mono text-xs">{error.page_path}</td>
                    <td className="p-2 text-xs truncate max-w-md">{error.error_message}</td>
                    <td className="p-2 text-right text-xs">{new Date(error.last_seen).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
