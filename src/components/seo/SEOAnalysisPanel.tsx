import React, { useState, useEffect } from 'react';
import { ComprehensiveSEOAnalysisService, SEOAnalysisReport, SEOIssue } from '@/services/comprehensiveSEOAnalysisService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  Download, 
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SEOAnalysisPanel: React.FC = () => {
  const [report, setReport] = useState<SEOAnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const result = await ComprehensiveSEOAnalysisService.performFullAnalysis();
      setReport(result);
    } catch (error) {
      console.error('SEO analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-run analysis on mount
    runAnalysis();
  }, []);

  const downloadReport = () => {
    if (!report) return;
    
    const textReport = ComprehensiveSEOAnalysisService.generateTextReport(report);
    const blob = new Blob([textReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 70) return 'from-yellow-500 to-yellow-600';
    if (score >= 50) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getIssueVariant = (type: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (type) {
      case 'critical':
      case 'error':
        return 'destructive';
      case 'warning':
        return 'outline';
      case 'info':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <Minus className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <TrendingDown className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const filteredIssues = report?.issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || issue.type === filterType;
    const matchesCategory = filterCategory === 'all' || issue.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  }) || [];

  if (loading && !report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-lg font-medium">Analyzing SEO...</p>
          <p className="text-sm text-muted-foreground">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>SEO Analysis</CardTitle>
            <CardDescription>Run a comprehensive SEO audit</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runAnalysis} className="w-full">
              <Search className="mr-2 h-4 w-4" />
              Start Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">SEO Analysis Report</h1>
            <p className="text-muted-foreground">
              {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={runAnalysis} disabled={loading} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Re-analyze
            </Button>
            <Button onClick={downloadReport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Score Card */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-2">Overall SEO Score</h2>
                <div className={`text-6xl font-bold ${getScoreColor(report.score)}`}>
                  {report.score}
                  <span className="text-2xl">/100</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Critical</p>
                    <p className="text-2xl font-bold text-red-600">{report.stats.critical}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Errors</p>
                    <p className="text-2xl font-bold text-orange-600">{report.stats.errors}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Warnings</p>
                    <p className="text-2xl font-bold text-yellow-600">{report.stats.warnings}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Info</p>
                    <p className="text-2xl font-bold text-blue-600">{report.stats.info}</p>
                  </div>
                </div>
                <Progress value={report.score} className={`h-3 bg-gradient-to-r ${getScoreGradient(report.score)}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Top Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {i + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Performance Metrics */}
        {report.performance && Object.keys(report.performance).length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
              <CardDescription>Performance metrics that impact SEO</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {report.performance.lcp && (
                  <div>
                    <p className="text-sm text-muted-foreground">LCP</p>
                    <p className={`text-xl font-bold ${report.performance.lcp < 2500 ? 'text-green-600' : report.performance.lcp < 4000 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {(report.performance.lcp / 1000).toFixed(2)}s
                    </p>
                  </div>
                )}
                {report.performance.fid && (
                  <div>
                    <p className="text-sm text-muted-foreground">FID</p>
                    <p className={`text-xl font-bold ${report.performance.fid < 100 ? 'text-green-600' : report.performance.fid < 300 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {report.performance.fid}ms
                    </p>
                  </div>
                )}
                {report.performance.cls && (
                  <div>
                    <p className="text-sm text-muted-foreground">CLS</p>
                    <p className={`text-xl font-bold ${report.performance.cls < 0.1 ? 'text-green-600' : report.performance.cls < 0.25 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {report.performance.cls.toFixed(3)}
                    </p>
                  </div>
                )}
                {report.performance.fcp && (
                  <div>
                    <p className="text-sm text-muted-foreground">FCP</p>
                    <p className="text-xl font-bold">{(report.performance.fcp / 1000).toFixed(2)}s</p>
                  </div>
                )}
                {report.performance.ttfb && (
                  <div>
                    <p className="text-sm text-muted-foreground">TTFB</p>
                    <p className="text-xl font-bold">{report.performance.ttfb}ms</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Issues Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Issues Found ({filteredIssues.length})
          </CardTitle>
          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="meta">Meta Tags</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="links">Links</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="structure">Structure</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({report.issues.length})</TabsTrigger>
              <TabsTrigger value="critical">Critical ({report.stats.critical})</TabsTrigger>
              <TabsTrigger value="error">Errors ({report.stats.errors})</TabsTrigger>
              <TabsTrigger value="warning">Warnings ({report.stats.warnings})</TabsTrigger>
              <TabsTrigger value="info">Info ({report.stats.info})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <IssuesList issues={filteredIssues} getIssueIcon={getIssueIcon} getIssueVariant={getIssueVariant} getImpactIcon={getImpactIcon} />
            </TabsContent>
            <TabsContent value="critical">
              <IssuesList issues={filteredIssues.filter(i => i.type === 'critical')} getIssueIcon={getIssueIcon} getIssueVariant={getIssueVariant} getImpactIcon={getImpactIcon} />
            </TabsContent>
            <TabsContent value="error">
              <IssuesList issues={filteredIssues.filter(i => i.type === 'error')} getIssueIcon={getIssueIcon} getIssueVariant={getIssueVariant} getImpactIcon={getImpactIcon} />
            </TabsContent>
            <TabsContent value="warning">
              <IssuesList issues={filteredIssues.filter(i => i.type === 'warning')} getIssueIcon={getIssueIcon} getIssueVariant={getIssueVariant} getImpactIcon={getImpactIcon} />
            </TabsContent>
            <TabsContent value="info">
              <IssuesList issues={filteredIssues.filter(i => i.type === 'info')} getIssueIcon={getIssueIcon} getIssueVariant={getIssueVariant} getImpactIcon={getImpactIcon} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface IssuesListProps {
  issues: SEOIssue[];
  getIssueIcon: (type: string) => React.ReactNode;
  getIssueVariant: (type: string) => "default" | "destructive" | "outline" | "secondary";
  getImpactIcon: (impact: string) => React.ReactNode;
}

const IssuesList: React.FC<IssuesListProps> = ({ issues, getIssueIcon, getIssueVariant, getImpactIcon }) => {
  if (issues.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
        <p>No issues found in this category!</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <Accordion type="multiple" className="space-y-2">
        {issues.map((issue) => (
          <AccordionItem key={issue.id} value={issue.id} className="border rounded-lg px-4">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-3">
                  {getIssueIcon(issue.type)}
                  <div className="text-left">
                    <div className="font-semibold">{issue.title}</div>
                    <div className="text-sm text-muted-foreground">{issue.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getIssueVariant(issue.type)}>{issue.type}</Badge>
                  <Badge variant="outline" className="gap-1">
                    {getImpactIcon(issue.impact)}
                    {issue.impact}
                  </Badge>
                  <Badge variant="secondary">{issue.category}</Badge>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div>
                  <p className="font-semibold text-sm mb-1">How to fix:</p>
                  <p className="text-sm">{issue.howToFix}</p>
                </div>
                {issue.affectedElements && issue.affectedElements.length > 0 && (
                  <div>
                    <p className="font-semibold text-sm mb-1">Affected elements:</p>
                    <ul className="text-sm space-y-1">
                      {issue.affectedElements.slice(0, 5).map((el, i) => (
                        <li key={i} className="text-muted-foreground truncate">• {el}</li>
                      ))}
                      {issue.affectedElements.length > 5 && (
                        <li className="text-muted-foreground">... and {issue.affectedElements.length - 5} more</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </ScrollArea>
  );
};

export default SEOAnalysisPanel;
