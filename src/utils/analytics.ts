
// Google Analytics 4 utility functions
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export const analytics = {
  // Track page views
  trackPageView: (path: string, title?: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title || document.title,
        page_location: `${window.location.origin}${path}`,
        page_path: path
      });
    }
  },

  // Track custom events
  trackEvent: (eventName: string, parameters?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  },

  // Track fund detail page views
  trackFundView: (fundId: string, fundName: string, category?: string) => {
    analytics.trackEvent('view_fund', {
      fund_id: fundId,
      fund_name: fundName,
      fund_category: category,
      content_type: 'fund_details'
    });
  },

  // Track search queries
  trackSearch: (query: string, resultsCount: number) => {
    analytics.trackEvent('search', {
      search_term: query,
      results_count: resultsCount,
      content_type: 'funds'
    });
  },

  // Track filter usage
  trackFilterUsage: (tags: string[], searchQuery?: string) => {
    analytics.trackEvent('filter_funds', {
      filter_tags: tags.join(','),
      search_query: searchQuery || '',
      filter_count: tags.length
    });
  },

  // Track quiz completion
  trackQuizCompletion: (recommendations: string[], userProfile?: Record<string, any>) => {
    analytics.trackEvent('quiz_complete', {
      recommendations_count: recommendations.length,
      recommended_funds: recommendations.join(','),
      user_risk_profile: userProfile?.riskTolerance || '',
      user_investment_amount: userProfile?.investmentAmount || ''
    });
  },

  // Track fund comparisons
  trackComparison: (fundIds: string[], fundNames: string[]) => {
    analytics.trackEvent('compare_funds', {
      fund_ids: fundIds.join(','),
      fund_names: fundNames.join(','),
      funds_count: fundIds.length
    });
  },

  // Track CTA clicks
  trackCTAClick: (location: string, ctaType: string, destination?: string) => {
    analytics.trackEvent('cta_click', {
      cta_location: location,
      cta_type: ctaType,
      cta_destination: destination || '',
      content_type: 'conversion'
    });
  },

  // Track external link clicks
  trackExternalLink: (url: string, linkText: string, context: string) => {
    analytics.trackEvent('click', {
      link_url: url,
      link_text: linkText,
      link_context: context,
      outbound: true
    });
  },

  // Track form submissions
  trackFormSubmission: (formType: string, success: boolean) => {
    analytics.trackEvent('form_submit', {
      form_type: formType,
      success: success
    });
  }
};

export default analytics;
