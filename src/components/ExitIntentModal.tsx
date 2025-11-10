import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .max(255, { message: 'Email address is too long' }),
});

type EmailFormData = z.infer<typeof emailSchema>;

const COOLDOWN_DAYS = 7;
const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const MIN_TIME_ON_PAGE = 10000; // 10 seconds
const MOBILE_BREAKPOINT = 768;

const EXCLUDED_ROUTES = [
  '/admin',
  '/account-settings',
  '/investor-auth',
  '/manager-auth',
  '/reset-password',
];

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // Check if we should show the modal
  const shouldShowModal = useCallback(() => {
    // Don't show on mobile
    if (window.innerWidth < MOBILE_BREAKPOINT) {
      return false;
    }

    // Don't show on excluded routes
    if (EXCLUDED_ROUTES.some(route => location.pathname.startsWith(route))) {
      return false;
    }

    // Check if user is authenticated (don't show for logged-in users)
    const session = supabase.auth.getSession();
    if (session) {
      return false;
    }

    // Check session storage (once per session)
    if (sessionStorage.getItem('exitIntentShownThisSession') === 'true') {
      return false;
    }

    // Check localStorage cooldown (7 days)
    const lastClosed = localStorage.getItem('exitIntentLastClosed');
    if (lastClosed) {
      const timeSinceClose = Date.now() - parseInt(lastClosed, 10);
      if (timeSinceClose < COOLDOWN_MS) {
        return false;
      }
    }

    return true;
  }, [location.pathname]);

  // Exit intent detection
  useEffect(() => {
    if (!shouldShowModal()) {
      return;
    }

    let timeoutId: NodeJS.Timeout;
    let hasBeenOnPageLongEnough = false;

    // Wait minimum time on page before enabling
    const pageTimerId = setTimeout(() => {
      hasBeenOnPageLongEnough = true;
    }, MIN_TIME_ON_PAGE);

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves from the top (exit intent)
      if (e.clientY <= 50 && hasBeenOnPageLongEnough) {
        // Debounce to avoid multiple triggers
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem('exitIntentShownThisSession', 'true');
        }, 300);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
      clearTimeout(pageTimerId);
    };
  }, [shouldShowModal]);

  const handleClose = () => {
    setIsOpen(false);
    // Set cooldown when closing
    localStorage.setItem('exitIntentLastClosed', Date.now().toString());
  };

  const onSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase.functions.invoke('send-confirmation-email-capture', {
        body: {
          email: data.email,
          source: 'exit_intent',
          user_agent: navigator.userAgent,
          referrer_url: document.referrer || window.location.href,
          tags: ['exit_intent', location.pathname],
        },
      });

      if (error) {
        console.error('Error submitting email:', error);
        setErrorMessage('Something went wrong. Please try again.');
        return;
      }

      setIsSubmitted(true);
      reset();
      
      // Set cooldown when successfully submitting
      localStorage.setItem('exitIntentLastClosed', Date.now().toString());

      // Auto-close after 3 seconds
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-gray-200">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4 text-gray-500" />
          <span className="sr-only">Close</span>
        </button>

        {isSubmitted ? (
          // Success state
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Check your email!</h3>
            <p className="text-sm text-gray-600">
              We've sent you a confirmation link. Please check your inbox to complete your subscription.
            </p>
          </div>
        ) : (
          // Form state
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Wait! Don't miss our latest Golden Visa fund picks 📧
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <p className="text-base text-gray-600 leading-relaxed">
                Get curated investment opportunities delivered to your inbox
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    className="h-12 border-gray-300 focus:border-primary focus:ring-primary"
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                  {errorMessage && (
                    <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Get Fund Updates'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  We'll send a confirmation email. Unsubscribe anytime. We respect your privacy.
                </p>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
