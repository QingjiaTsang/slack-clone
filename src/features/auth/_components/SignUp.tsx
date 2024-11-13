"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcnUI/card";
import { Separator } from "@/components/shadcnUI/separator";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

import SignUpForm from "@/features/auth/_components/SignUpForm";
import OTPVerificationForm from "@/features/auth/_components/OTPVerificationForm";
import OAuthButtons from "@/features/auth/_components/OAuthButtons";

type SignUpProps = {
  onToggleAuthCard: () => void;
};

const SignUp = ({ onToggleAuthCard: onToggleAuthForm }: SignUpProps) => {
  const router = useRouter();

  const { signIn } = useAuthActions();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const onSignUpFormSubmit = async (data: {
    email: string;
    name: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      await signIn("password-code", {
        email: data.email,
        name: data.name,
        password: data.password,
        flow: "signUp",
      });
      setEmail(data.email);
    } catch (error) {
      console.error("error during password-code from sign-up flow:", error);
      toast.error(`Password is not strong enough. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignInWithOTPFormSubmit = async (data: { code: string }) => {
    setIsLoading(true);
    try {
      await signIn("password-code", {
        email,
        code: data.code,
        flow: "email-verification",
      });
      toast.success("Sign up successfully.");
      router.push("/");
    } catch (error) {
      console.error("Verification failed:", error);
      toast.error(`Verification failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSignInWithOAuth = async (provider: "github" | "google") => {
    setIsLoading(true);
    try {
      await signIn(provider);
    } catch (error) {
      console.error("Error during OAuth sign in:", error);
      toast.error(
        `Sign up failed. Please check your email and password and try again.`
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center items-center">
      {isLoading && (
        <div className="absolute flex items-center justify-center">
          <Loader className="animate-spin text-2xl" />
        </div>
      )}

      <Card
        className={cn("w-[350px]", {
          "opacity-50 pointer-events-none": isLoading,
        })}
      >
        <CardHeader>
          <CardTitle>Sign up to continue</CardTitle>
          <CardDescription>
            Use your email or other services to sign up
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!email ? (
            <SignUpForm onSubmit={onSignUpFormSubmit} />
          ) : (
            <OTPVerificationForm
              onSubmit={onSignInWithOTPFormSubmit}
              email={email}
            />
          )}

          <Separator className="my-4" />

          <OAuthButtons onSignInWithOAuth={onSignInWithOAuth} />
        </CardContent>

        <CardFooter>
          <div className="text-sm text-gray-400 space-x-1">
            <span>Already have an account?</span>
            <span
              className="text-blue-500 cursor-pointer"
              onClick={onToggleAuthForm}
            >
              Sign in
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
