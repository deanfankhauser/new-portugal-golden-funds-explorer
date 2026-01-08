import { supabase } from '@/integrations/supabase/client';
import { QuizAnswers } from '@/hooks/useFundMatcherQuery';

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('quiz_session_id');
  if (!sessionId) {
    sessionId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('quiz_session_id', sessionId);
  }
  return sessionId;
};

export const trackQuizEvent = async (
  eventType: 'started' | 'completed' | 'shared' | 'abandoned' | 'cta_clicked',
  data?: {
    answers?: QuizAnswers;
    resultsCount?: number;
    abandonedAtStep?: number;
    fundId?: string;
    fundName?: string;
  }
) => {
  try {
    const sessionId = getSessionId();
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from('quiz_analytics').insert({
      event_type: eventType,
      session_id: sessionId,
      user_id: user?.id || null,
      answers: data?.answers ? JSON.parse(JSON.stringify(data.answers)) : null,
      results_count: data?.resultsCount !== undefined ? data.resultsCount : null,
      abandoned_at_step: data?.abandonedAtStep || null,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent || null,
    });

    if (error) throw error;
    console.log(`📊 Tracked quiz event: ${eventType}`);
  } catch (error) {
    console.error('Failed to track quiz event:', error);
    // Don't throw - tracking failures shouldn't break UX
  }
};
