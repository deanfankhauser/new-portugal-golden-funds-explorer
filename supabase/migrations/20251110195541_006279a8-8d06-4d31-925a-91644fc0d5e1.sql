-- Create trigger to notify fund manager assignment after insert when status is 'active'
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_fund_manager_assigned'
  ) THEN
    CREATE TRIGGER on_fund_manager_assigned
      AFTER INSERT ON public.fund_managers
      FOR EACH ROW
      WHEN (NEW.status = 'active')
      EXECUTE FUNCTION public.notify_fund_manager_assignment();
  END IF;
END
$$;