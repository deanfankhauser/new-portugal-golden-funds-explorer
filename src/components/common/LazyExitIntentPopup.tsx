import React, { lazy, Suspense } from 'react';

// Lazy load ExitIntentPopup since it only loads on exit intent
const ExitIntentPopup = lazy(() => import('./ExitIntentPopup'));

const LazyExitIntentPopup: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <ExitIntentPopup />
    </Suspense>
  );
};

export default LazyExitIntentPopup;