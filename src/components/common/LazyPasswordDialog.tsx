import React, { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load PasswordDialog since it's only used when premium features are accessed
const PasswordDialog = lazy(() => import('../PasswordDialog'));

// Simple loading skeleton for dialog
const DialogSkeleton = () => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  </div>
);

interface LazyPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const LazyPasswordDialog: React.FC<LazyPasswordDialogProps> = (props) => {
  // Only render when dialog is open to trigger lazy loading
  if (!props.open) return null;
  
  return (
    <Suspense fallback={<DialogSkeleton />}>
      <PasswordDialog {...props} />
    </Suspense>
  );
};

export default LazyPasswordDialog;