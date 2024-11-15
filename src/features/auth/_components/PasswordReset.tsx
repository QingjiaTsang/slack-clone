"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcnUI/card";
import { toast } from "sonner";
import EmailForm from "@/features/auth/_components/PasswordResetEmailForm";
import ResetForm from "@/features/auth/_components/PasswordResetForm";
import { useAuthActions } from "@convex-dev/auth/react";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordResetProps = {
  onCancel: () => void;
};

const PasswordReset = ({ onCancel }: PasswordResetProps) => {
  const { signIn } = useAuthActions();

  const [stage, setStage] = useState<"forget" | { email: string }>("forget");
  const [isLoading, setIsLoading] = useState(false);

  const onEmailFormSubmit = async (email: string) => {
    try {
      setIsLoading(true);
      await signIn("password-code", {
        email,
        flow: "reset",
      });
      setStage({ email });
    } catch (_error) {
      toast.error("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetFormSubmit = async (data: {
    code: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      await signIn("password-code", {
        email: (stage as { email: string }).email,
        code: data.code,
        newPassword: data.password,
        flow: "reset-verification",
      });
      toast.success("Password reset successfully");
      onCancel();
    } catch (_error) {
      toast.error(
        "Code could not be verified or new password is not strong enough, please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center items-center">
      {isLoading && (
        <div className="absolute flex items-center justify-center">
          <LoaderIcon className="animate-spin text-2xl" />
        </div>
      )}
      <Card
        className={cn("w-[350px]", {
          "opacity-50 pointer-events-none": isLoading,
        })}
      >
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            {stage === "forget"
              ? "Enter your email"
              : "Enter the code and your new password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stage === "forget" ? (
            <EmailForm onSubmit={onEmailFormSubmit} onCancel={onCancel} />
          ) : (
            <ResetForm
              onSubmit={onResetFormSubmit}
              onBack={() => setStage("forget")}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordReset;
