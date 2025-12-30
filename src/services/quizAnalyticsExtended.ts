import { supabase } from '@/integrations/supabase/client';
import { QuizAnswers as LegacyQuizAnswers } from '@/hooks/useFundMatcherQuery';
import { QuizAnswers } from '@/hooks/useQuizState';

export type QuizEventType = 
  | 'quiz_page_view'      // Landing page viewed
  | 'quiz_start'          // First question answered
  | 'quiz_step'           // Each answer (with step number, question ID)
  | 'quiz_complete'       // All questions answered
  | 'quiz_result_view'    // Results page viewed
  | 'quiz_fund_click'     // Fund card clicked
  | 'quiz_lead_submit'    // Contact form submitted
  | 'quiz_share'          // Share button clicked
  | 'quiz_retake'         // Reset/retake clicked
  | 'quiz_abandon';       // Page exit before complete

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('quiz_session_id');
  if (!sessionId) {
    sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('quiz_session_id', sessionId);
  }
  return sessionId;
};

export const trackQuizEventExtended = async (
  eventType: QuizEventType,
  data?: {
    answers?: QuizAnswers | LegacyQuizAnswers;
    resultsCount?: number;
    step?: number;
    stepId?: string;
    fundId?: string;
    fundName?: string;
    source?: 'homepage' | 'header' | 'category' | 'direct' | 'share';
    resultSlug?: string;
  }
) => {
  try {
    const sessionId = getSessionId();
    const { data: userData } = await supabase.auth.getUser();

    // Map extended event types to the existing quiz_analytics table event types
    const eventTypeMap: Record<QuizEventType, string> = {
      'quiz_page_view': 'started',
      'quiz_start': 'started',
      'quiz_step': 'started',
      'quiz_complete': 'completed',
      'quiz_result_view': 'completed',
      'quiz_fund_click': 'cta_clicked',
      'quiz_lead_submit': 'cta_clicked',
      'quiz_share': 'shared',
      'quiz_retake': 'started',
      'quiz_abandon': 'abandoned',
    };

    const { error } = await supabase.from('quiz_analytics').insert({
      event_type: eventTypeMap[eventType] || eventType,
      session_id: sessionId,
      user_id: userData.user?.id || null,
      answers: data?.answers ? JSON.parse(JSON.stringify(data.answers)) : null,
      results_count: data?.resultsCount !== undefined ? data.resultsCount : null,
      abandoned_at_step: data?.step || null,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    });

    if (error) throw error;
    console.log(`📊 Tracked quiz event: ${eventType}`, data);
  } catch (error) {
    console.error('Failed to track quiz event:', error);
    // Don't throw - tracking failures shouldn't break UX
  }
};
