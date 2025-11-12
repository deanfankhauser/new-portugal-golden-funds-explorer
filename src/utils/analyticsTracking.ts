// Supabase is loaded dynamically in browser when needed

// Track in-flight requests to prevent duplicates
const inFlightRequests = new Map<string, Promise<void>>();

// Get or create session ID for unique visitor tracking
export const getSessionId = (): string => {
  const STORAGE_KEY = 'fund_analytics_session';
  
  // Try to get existing session ID
  let sessionId = sessionStorage.getItem(STORAGE_KEY);
  
  if (!sessionId) {
    // Generate new session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }
  
  return sessionId;
};

// Track page view
export const trackPageView = async (fundId: string) => {
  if (typeof window === 'undefined') return;
  
  const requestKey = `page_view_${fundId}`;
  
  // Return existing in-flight request if one exists
  if (inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey);
  }
  
  const requestPromise = (async () => {
    try {
      const sessionId = getSessionId();
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.functions.invoke('track-fund-event', {
        body: {
          type: 'page_view',
          fund_id: fundId,
          session_id: sessionId,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent || null,
        }
      });
    } catch (error) {
      console.error('Error tracking page view:', error);
    } finally {
      // Remove from in-flight requests after completion
      inFlightRequests.delete(requestKey);
    }
  })();
  
  inFlightRequests.set(requestKey, requestPromise);
  return requestPromise;
};

// Track interaction (comparison add, booking click, etc.)
export const trackInteraction = async (
  fundId: string, 
  type: 'comparison_add' | 'booking_click' | 'website_click' | 'save_fund'
) => {
  if (typeof window === 'undefined') return;
  
  const requestKey = `${type}_${fundId}`;
  
  // Return existing in-flight request if one exists
  if (inFlightRequests.has(requestKey)) {
    return inFlightRequests.get(requestKey);
  }
  
  const requestPromise = (async () => {
    try {
      const sessionId = getSessionId();
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase.functions.invoke('track-fund-event', {
        body: {
          type,
          fund_id: fundId,
          session_id: sessionId,
        }
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    } finally {
      // Remove from in-flight requests after completion
      inFlightRequests.delete(requestKey);
    }
  })();
  
  inFlightRequests.set(requestKey, requestPromise);
  return requestPromise;
};
