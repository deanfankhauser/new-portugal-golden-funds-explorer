import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export interface QuizAnswers {
  risk?: 'conservative' | 'moderate' | 'aggressive';
  min?: '100k' | '250k' | '500k' | '500k+';
  timeline?: '5yr' | '6yr' | '8yr' | '10yr+';
  nat?: 'us' | 'uk' | 'eu' | 'other';
  income?: 'yes' | 'no';
  priorities?: string; // comma-separated: 'low-fees,verified'
}

// Map from URL params to useFundMatcherQuery format
export interface LegacyQuizAnswers {
  budget?: 'under250k' | 'under500k' | '500k+';
  strategy?: 'safety' | 'growth' | 'fast_exit';
  income?: 'yes' | 'no';
  riskTolerance?: 'conservative' | 'moderate' | 'aggressive';
  timeline?: '1-3years' | '3-5years' | '5plus';
}

const QUESTION_ORDER = ['risk', 'min', 'nat', 'timeline', 'income'] as const;

export function useQuizState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const answers: QuizAnswers = useMemo(() => ({
    risk: searchParams.get('risk') as QuizAnswers['risk'] || undefined,
    min: searchParams.get('min') as QuizAnswers['min'] || undefined,
    timeline: searchParams.get('timeline') as QuizAnswers['timeline'] || undefined,
    nat: searchParams.get('nat') as QuizAnswers['nat'] || undefined,
    income: searchParams.get('income') as QuizAnswers['income'] || undefined,
    priorities: searchParams.get('priorities') || undefined,
  }), [searchParams]);
  
  const setAnswer = useCallback((key: keyof QuizAnswers, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);
  
  const currentStep = useMemo(() => {
    for (let i = 0; i < QUESTION_ORDER.length; i++) {
      if (!answers[QUESTION_ORDER[i] as keyof QuizAnswers]) {
        return i;
      }
    }
    return QUESTION_ORDER.length;
  }, [answers]);
  
  const isComplete = currentStep >= QUESTION_ORDER.length;
  
  const reset = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const goToResults = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(answers).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/fund-matcher/results?${params.toString()}`);
  }, [answers, navigate]);

  // Convert to legacy format for useFundMatcherQuery compatibility
  const toLegacyAnswers = useCallback((): LegacyQuizAnswers => {
    const legacy: LegacyQuizAnswers = {};
    
    // Map risk tolerance
    if (answers.risk) {
      legacy.riskTolerance = answers.risk;
    }
    
    // Map budget
    if (answers.min) {
      const budgetMap: Record<string, LegacyQuizAnswers['budget']> = {
        '100k': 'under250k',
        '250k': 'under500k',
        '500k': '500k+',
        '500k+': '500k+',
      };
      legacy.budget = budgetMap[answers.min];
    }
    
    // Map timeline
    if (answers.timeline) {
      const timelineMap: Record<string, LegacyQuizAnswers['timeline']> = {
        '5yr': '3-5years',
        '6yr': '5plus',
        '8yr': '5plus',
        '10yr+': '5plus',
      };
      legacy.timeline = timelineMap[answers.timeline];
    }
    
    // Income is same format
    if (answers.income) {
      legacy.income = answers.income;
    }
    
    // Derive strategy from risk + priorities
    if (answers.risk === 'conservative') {
      legacy.strategy = 'safety';
    } else if (answers.risk === 'aggressive') {
      legacy.strategy = 'growth';
    } else if (answers.timeline === '5yr' || answers.timeline === '6yr') {
      legacy.strategy = 'fast_exit';
    }
    
    return legacy;
  }, [answers]);
  
  return { 
    answers, 
    setAnswer, 
    currentStep, 
    isComplete, 
    reset, 
    goToResults,
    toLegacyAnswers,
    totalSteps: QUESTION_ORDER.length 
  };
}

// Generate shareable result slug from answers
export function generateResultSlug(answers: QuizAnswers): string {
  const parts = [
    answers.risk,
    answers.min,
    answers.nat,
    answers.timeline,
    answers.income === 'yes' ? 'income' : 'accumulation'
  ].filter(Boolean);
  return parts.join('-');
}

// Parse query params from results URL
export function parseResultsParams(searchParams: URLSearchParams): QuizAnswers {
  return {
    risk: searchParams.get('risk') as QuizAnswers['risk'] || undefined,
    min: searchParams.get('min') as QuizAnswers['min'] || undefined,
    timeline: searchParams.get('timeline') as QuizAnswers['timeline'] || undefined,
    nat: searchParams.get('nat') as QuizAnswers['nat'] || undefined,
    income: searchParams.get('income') as QuizAnswers['income'] || undefined,
    priorities: searchParams.get('priorities') || undefined,
  };
}
