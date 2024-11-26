import { useState, useEffect } from "react";

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/shadcnUI/credenza";
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (promise && e.key === "Enter") {
        handleConfirm();
      }
    };

    if (promise) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [promise]);

  const ConfirmationDialog = () => (
    <Credenza open={promise !== null} onOpenChange={handleClose}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>{title}</CredenzaTitle>
          <CredenzaDescription className="hidden">
            {message}
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>{message}</CredenzaBody>

        <CredenzaFooter className="flex justify-center gap-6">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );

  return [ConfirmationDialog, confirm];
};

export default useConfirm;
