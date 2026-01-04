import { supabase } from '@/integrations/supabase/client';

let sessionId: string | null = null;

const getSessionId = (): string => {
  if (sessionId) return sessionId;
  
  const stored = sessionStorage.getItem('session_id');
  if (stored) {
    sessionId = stored;
    return stored;
  }
  
  const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('session_id', newId);
  sessionId = newId;
  return newId;
};

const getPageType = (path: string): string => {
  if (path === '/') return 'homepage';
  if (path.startsWith('/funds/')) return 'fund_details';
  if (path.startsWith('/categories/')) return 'category';
  if (path.startsWith('/tags/')) return 'tag';
  if (path.startsWith('/manager/')) return 'manager';
  if (path.startsWith('/compare/')) return 'comparison';
  if (path.startsWith('/admin')) return 'admin';
  return 'other';
};

const sendErrorToBackend = async (errorData: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.functions.invoke('track-performance-metrics', {
      body: {
        type: 'error',
        data: {
          ...errorData,
          sessionId: getSessionId(),
          userId: user?.id,
          userAgent: navigator.userAgent,
        },
      },
    });
  } catch (error) {
    console.error('Failed to send error to backend:', error);
  }
};

export const track404Error = (path: string, referrer?: string) => {
  sendErrorToBackend({
    errorType: '404',
    pagePath: path,
    errorMessage: 'Page not found',
    referrer: referrer || document.referrer,
  });
};

export const trackJSError = (error: Error, componentStack?: string) => {
  sendErrorToBackend({
    errorType: 'js_error',
    pagePath: window.location.pathname,
    errorMessage: `${error.message}\n${error.stack || ''}\n${componentStack || ''}`,
    referrer: document.referrer,
  });
};

export const trackNetworkError = (url: string, status: number, statusText: string) => {
  sendErrorToBackend({
    errorType: 'network_error',
    pagePath: window.location.pathname,
    errorMessage: `Network error: ${status} ${statusText} - ${url}`,
    referrer: document.referrer,
  });
};

export const track500Error = (path: string, errorMessage: string) => {
  sendErrorToBackend({
    errorType: '500',
    pagePath: path,
    errorMessage,
    referrer: document.referrer,
  });
};

export const trackGone410 = (slug: string, type: string) => {
  sendErrorToBackend({
    errorType: '410',
    pagePath: `/team/${slug}`,
    errorMessage: `410 Gone: ${type} "${slug}" permanently removed`,
    referrer: document.referrer,
  });
};

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    trackJSError(event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackJSError(new Error(`Unhandled Promise Rejection: ${event.reason}`));
  });
}
