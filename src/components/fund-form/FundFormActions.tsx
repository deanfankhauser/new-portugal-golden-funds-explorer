
import React from 'react';
import { Button } from "@/components/ui/button";

type FundFormActionsProps = {
  onCancel: () => void;
  submitButtonText: string;
};

const FundFormActions = ({ onCancel, submitButtonText }: FundFormActionsProps) => {
  return (
    <div className="flex justify-end gap-4 pt-4">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit">{submitButtonText}</Button>
    </div>
  );
};

export default FundFormActions;
