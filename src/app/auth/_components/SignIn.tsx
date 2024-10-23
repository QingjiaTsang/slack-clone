"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { Loader } from 'lucide-react';

import { useAuthActions } from "@convex-dev/auth/react";

import { toast } from "sonner"

import { cn } from "@/lib/utils"
import OAuthButtons from "@/app/auth/_components/OAuthButtons"
import PasswordReset from "@/app/auth/_components/PasswordReset"

const signInFormSchema = z.object({
  email: z.string().email({
    message: 'Email is not valid',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters'
  }),
})

type TSignInFormSchema = z.infer<typeof signInFormSchema>

type SignInProps = {
  onToggleAuthCard: () => void
}

const SignIn = ({ onToggleAuthCard: onToggleAuthForm }: SignInProps) => {
  const router = useRouter()

  const { signIn } = useAuthActions()

  const methods = useForm<TSignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'signIn' | 'forgot' | { email: string }>('signIn');

  const onSubmit = async (data: TSignInFormSchema) => {
    setIsLoading(true)
    try {
      await signIn('password-code', {
        email: data.email,
        password: data.password,
        flow: 'signIn',
      })
      router.push('/')
    } catch (error) {
      console.error("Error during OAuth sign in:", error)
      toast.error('Sign in failed')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignInWithOAuth = async (provider: 'github' | 'google') => {
    setIsLoading(true)
    try {
      await signIn(provider)
    } catch (error) {
      console.error("Error during OAuth sign in:", error)
      setIsLoading(false)
    }
  }

  if (step === "forgot") {
    return <PasswordReset onCancel={() => setStep('signIn')} />
  }

  return (
    <div className="flex flex-col h-full justify-center items-center">
      {isLoading && (
        <div className="absolute flex items-center justify-center">
          <Loader className="animate-spin text-2xl" />
        </div>
      )}
      <Card className={cn('w-[350px]', { 'opacity-50 pointer-events-none': isLoading })}>
        <CardHeader>
          <CardTitle>Sign in to continue</CardTitle>
          <CardDescription>
            User your email or other services to sign in
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...methods} >
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>
                      <Button
                        className="p-0 h-auto text-sm"
                        type="button"
                        variant="link"
                        onClick={() => setStep('forgot')}
                      >
                        Forgot password?
                      </Button>
                    </div>

                    <FormControl>
                      <Input placeholder="Password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-2">
                <Button type="submit" disabled={isLoading} className="w-full">Sign in</Button>
              </div>
            </form>
          </Form>

          <Separator className="my-4" />

          <OAuthButtons onSignInWithOAuth={onSignInWithOAuth} />
        </CardContent>

        <CardFooter>
          <div className="text-sm text-gray-400 space-x-1">
            <span>Don't have an account?</span>
            <span className="text-blue-500 cursor-pointer" onClick={onToggleAuthForm}>Sign up</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignIn
