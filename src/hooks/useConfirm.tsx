import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnUI/dialog";
import { Button } from "@/components/shadcnUI/button";

type UseConfirmProps = {
  title: string;
  message: string;
};

const useConfirm = ({ title, message }: UseConfirmProps) => {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () =>
    new Promise((resolve) => {
      setPromise({ resolve });
    });

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const ConfirmationDialog = () => (
    <Dialog open={promise !== null} onOpenChange={handleClose}>
      <DialogContent onKeyDown={(e) => e.key === "Enter" && handleConfirm()}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="hidden">{message}</DialogDescription>
        </DialogHeader>

        <>{message}</>

        <div className="flex justify-center gap-6 pt-4">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return [ConfirmationDialog, confirm];
};

export default useConfirm;
