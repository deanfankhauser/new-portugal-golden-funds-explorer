
import { categoryToSlug, tagToSlug, managerToSlug } from '../lib/utils';

// Data freshness constants
export const DATA_AS_OF_DATE = "Sep 2025";
export const DATA_AS_OF_LABEL = `(as of ${DATA_AS_OF_DATE})`;

// SSR-safe env accessors
const fromProcess = (key: string): string | undefined => {
  return typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
};

const fromVite = (key: string): string | undefined => {
  try {
    // Guard import.meta for Node/SSG
    // @ts-ignore - import.meta is not typed in Node context
    return typeof import.meta !== 'undefined' && (import.meta as any)?.env
      ? (import.meta as any).env[key]
      : undefined;
  } catch {
    return undefined;
  }
};

const getBaseUrl = (): string => {
  return (
    fromProcess('VITE_APP_BASE_URL') ||
    fromProcess('APP_BASE_URL') ||
    fromProcess('NEXT_PUBLIC_APP_BASE_URL') ||
    fromVite('VITE_APP_BASE_URL') ||
    'https://funds.movingto.com'
  );
};

export const URL_CONFIG = {
  // Resolve at runtime for both SSG (Node) and client (Vite)
  BASE_URL: getBaseUrl(),
  SITE_URL: getBaseUrl(),

  buildUrl: (path: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  },
  buildFundUrl: (fundId: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/${fundId}`;
  },
  buildManagerUrl: (managerName: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/manager/${managerToSlug(managerName)}`;
  },
  buildCategoryUrl: (categoryName: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/categories/${categoryToSlug(categoryName)}`;
  },
  buildTagUrl: (tagName: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/tags/${tagToSlug(tagName)}`;
  },
  buildComparisonUrl: (slug: string) => {
    const baseUrl = getBaseUrl();
    return `${baseUrl}/compare/${slug}`;
  }
};
