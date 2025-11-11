import { supabase } from '@/integrations/supabase/client';

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
  
  try {
    const sessionId = getSessionId();
    
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
  }
};

// Track interaction (comparison add, booking click, etc.)
export const trackInteraction = async (
  fundId: string, 
  type: 'comparison_add' | 'booking_click' | 'website_click' | 'save_fund'
) => {
  if (typeof window === 'undefined') return;
  
  try {
    const sessionId = getSessionId();
    
    await supabase.functions.invoke('track-fund-event', {
      body: {
        type,
        fund_id: fundId,
        session_id: sessionId,
      }
    });
  } catch (error) {
    console.error('Error tracking interaction:', error);
  }
};
