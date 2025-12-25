import { SEOAuditService, SEOAuditResult } from './seoAuditService';
import { EnhancedSitemapService } from './enhancedSitemapService';

export interface SEOMonitoringConfig {
  enabled: boolean;
  intervalMinutes: number;
  alertThreshold: number;
  trackingEnabled: boolean;
}

export interface SEOMetrics {
  timestamp: string;
  score: number;
  criticalIssues: number;
  warnings: number;
  performanceScore: number;
  indexingStatus: 'healthy' | 'warning' | 'critical';
}

export class SEOMonitoringService {
  private static config: SEOMonitoringConfig = {
    enabled: typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false,
    intervalMinutes: 30,
    alertThreshold: 70,
    trackingEnabled: true
  };

  private static metrics: SEOMetrics[] = [];
  private static monitoringInterval: NodeJS.Timeout | null = null;

  static initialize(config?: Partial<SEOMonitoringConfig>): void {
    if (config) {
      this.config = { ...this.config, ...config };
    }

    if (this.config.enabled) {
      this.startMonitoring();
    }
  }

  static startMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }

    // Run initial audit
    this.performAuditAndTrack();

    // Set up periodic monitoring
    this.monitoringInterval = setInterval(() => {
      this.performAuditAndTrack();
    }, this.config.intervalMinutes * 60 * 1000);

    console.log(`🔍 SEO Monitoring started (${this.config.intervalMinutes}min intervals)`);
  }

  static stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log('🔍 SEO Monitoring stopped');
    }
  }

  private static async performAuditAndTrack(): Promise<void> {
    try {
      const audit = await SEOAuditService.performComprehensiveAudit();
      const metrics = this.extractMetrics(audit);
      
      this.metrics.push(metrics);
      
      // Keep only last 24 hours of metrics
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
      this.metrics = this.metrics.filter(m => new Date(m.timestamp) > cutoff);

      // Check for alerts
      this.checkAlerts(metrics);

      // Log in development
      const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false;
      if (isDev) {
        this.logMetrics(metrics);
      }

    } catch (error) {
      console.error('SEO Monitoring error:', error);
    }
  }

  private static extractMetrics(audit: SEOAuditResult): SEOMetrics {
    let indexingStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
    
    if (audit.issues.critical.length > 0) {
      indexingStatus = 'critical';
    } else if (audit.issues.warnings.length > 3) {
      indexingStatus = 'warning';
    }

    return {
      timestamp: new Date().toISOString(),
      score: audit.score,
      criticalIssues: audit.issues.critical.length,
      warnings: audit.issues.warnings.length,
      performanceScore: audit.technicalSEO.performanceScore,
      indexingStatus
    };
  }

  private static checkAlerts(metrics: SEOMetrics): void {
    const alerts: string[] = [];

    if (metrics.score < this.config.alertThreshold) {
      alerts.push(`SEO score below threshold: ${metrics.score}/${this.config.alertThreshold}`);
    }

    if (metrics.criticalIssues > 0) {
      alerts.push(`${metrics.criticalIssues} critical SEO issues detected`);
    }

    if (metrics.performanceScore < 70) {
      alerts.push(`Performance score critical: ${metrics.performanceScore}/100`);
    }

    if (metrics.indexingStatus === 'critical') {
      alerts.push('Critical indexing issues detected');
    }

    if (alerts.length > 0 && this.config.trackingEnabled) {
      console.warn('🚨 SEO ALERTS:', alerts);
      
      // In production, this would send alerts to monitoring service
      this.sendAlerts(alerts);
    }
  }

  private static sendAlerts(alerts: string[]): void {
    // In a real implementation, this would send to external monitoring
    // For now, just dispatch custom events
    alerts.forEach(alert => {
      window.dispatchEvent(new CustomEvent('seo:alert', {
        detail: { message: alert, timestamp: new Date().toISOString() }
      }));
    });
  }

  private static logMetrics(metrics: SEOMetrics): void {
    const trend = this.getTrend();
    
    console.group('🔍 SEO Monitoring Update');
    console.log(`Score: ${metrics.score}/100 ${trend}`);
    console.log(`Critical Issues: ${metrics.criticalIssues}`);
    console.log(`Warnings: ${metrics.warnings}`);
    console.log(`Performance: ${metrics.performanceScore}/100`);
    console.log(`Indexing: ${metrics.indexingStatus}`);
    console.groupEnd();
  }

  private static getTrend(): string {
    if (this.metrics.length < 2) return '';
    
    const current = this.metrics[this.metrics.length - 1];
    const previous = this.metrics[this.metrics.length - 2];
    
    const diff = current.score - previous.score;
    
    if (diff > 0) return '📈';
    if (diff < 0) return '📉';
    return '➡️';
  }

  static getMetrics(): SEOMetrics[] {
    return [...this.metrics];
  }

  static getCurrentStatus(): {
    score: number;
    trend: string;
    lastCheck: string;
    alerts: number;
  } {
    const latest = this.metrics[this.metrics.length - 1];
    
    if (!latest) {
      return {
        score: 0,
        trend: '❓',
        lastCheck: 'Never',
        alerts: 0
      };
    }

    return {
      score: latest.score,
      trend: this.getTrend(),
      lastCheck: new Date(latest.timestamp).toLocaleTimeString(),
      alerts: latest.criticalIssues + latest.warnings
    };
  }

  static generateDashboard(): string {
    const status = this.getCurrentStatus();
    const recentMetrics = this.metrics.slice(-5);
    
    let dashboard = `📊 SEO MONITORING DASHBOARD\n`;
    dashboard += `Current Score: ${status.score}/100 ${status.trend}\n`;
    dashboard += `Last Check: ${status.lastCheck}\n`;
    dashboard += `Active Alerts: ${status.alerts}\n\n`;

    if (recentMetrics.length > 0) {
      dashboard += `📈 RECENT TRENDS:\n`;
      recentMetrics.forEach((metric, index) => {
        const time = new Date(metric.timestamp).toLocaleTimeString();
        dashboard += `   ${time}: ${metric.score}/100 (${metric.criticalIssues} critical, ${metric.warnings} warnings)\n`;
      });
    }

    return dashboard;
  }

  // Manual audit trigger
  static async runManualAudit(): Promise<SEOAuditResult> {
    const audit = await SEOAuditService.performComprehensiveAudit();
    
    // Also update monitoring metrics
    if (this.config.trackingEnabled) {
      const metrics = this.extractMetrics(audit);
      this.metrics.push(metrics);
    }

    return audit;
  }

  // Sitemap health check (browser-safe - only validates accessibility)
  static async checkSitemapHealth(): Promise<{
    accessible: boolean;
    lastModified?: string;
    size: number;
    error?: string;
  }> {
    try {
      const validation = await EnhancedSitemapService.validateSitemapAccess();
      
      return {
        accessible: validation.accessible,
        size: 0, // Size not available in browser context
        error: validation.error,
        lastModified: new Date().toISOString()
      };
    } catch (error) {
      return {
        accessible: false,
        size: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
