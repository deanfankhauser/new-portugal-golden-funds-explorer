import { supabase } from '@/integrations/supabase/client';

/**
 * Track team member page views for analytics and debugging.
 * Logs whether the team member was found in the database.
 */
export async function trackTeamPageView(slug: string, exists: boolean): Promise<void> {
  try {
    // Log to console for debugging
    console.log(`[Team Route] slug: "${slug}", exists: ${exists}`);
    
    // Get or create session ID
    let sessionId = 'unknown';
    if (typeof sessionStorage !== 'undefined') {
      sessionId = sessionStorage.getItem('session_id') || `session-${Date.now()}`;
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', sessionId);
      }
    }
    
    // Log to database for analysis
    const { error } = await supabase.from('page_performance_metrics').insert({
      page_type: 'team-member',
      page_path: `/team/${slug}`,
      session_id: sessionId,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      // Note: We're using page_performance_metrics table for tracking
      // The exists status is implied by whether the page loads or shows 404
    });
    
    if (error) {
      console.error('[Team Route] Failed to log page view:', error.message);
    }
  } catch (error) {
    console.error('[Team Route] Failed to track team page view:', error);
  }
}
