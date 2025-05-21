
import React from 'react';
import { Button } from "@/components/ui/button";

type FundFormActionsProps = {
  onCancel: () => void;
  submitButtonText: string;
  isSubmitting?: boolean;
};

const FundFormActions = ({ onCancel, submitButtonText, isSubmitting = false }: FundFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : submitButtonText}
      </Button>
    </div>
  );
};

export default FundFormActions;
