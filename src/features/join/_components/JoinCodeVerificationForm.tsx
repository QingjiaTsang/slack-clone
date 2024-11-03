'use client'

import { Workspace } from "@/types/docs"

import Link from "next/link"
import { useRouter } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { toast } from "sonner";
import { Button } from "@/components/shadcnUI/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/shadcnUI/input-otp"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/shadcnUI/form"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'

import { ArrowRightIcon, HomeIcon, TriangleAlertIcon } from "lucide-react"

import { useQueryState } from 'nuqs'


const joinCodeVerificationSchema = z.object({
  joinCode: z.string().min(6, { message: "Code must be 6 digits" }),
})

type TJoinCodeVerificationSchema = z.infer<typeof joinCodeVerificationSchema>

type JoinCodeVerificationFormProps = {
  workspace: Workspace | null
}

const JoinCodeVerificationForm = ({ workspace }: JoinCodeVerificationFormProps) => {
  const router = useRouter();

  const [joinCode] = useQueryState('joinCode')

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.join),
    onSuccess: () => {
      toast.success("Joined workspace")
      router.replace(`/workspace/${workspace!._id}`)
    },
    onError: () => {
      toast.error("Invalid code")
    }
  })


  const methods = useForm<TJoinCodeVerificationSchema>({
    resolver: zodResolver(joinCodeVerificationSchema),
    defaultValues: {
      joinCode: joinCode ?? '',
    },
  })

  const handleSubmit = (data: TJoinCodeVerificationSchema) => {
    mutate({ workspaceId: workspace!._id, joinCode: data.joinCode })
  }


  if (!workspace) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-2">
        <TriangleAlertIcon className="size-10 text-destructive" />
        <div className="text-destructive text-lg font-semibold">
          No workspace found
        </div>
        <Button variant="outline" onClick={() => router.replace('/')}>
          <HomeIcon className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className='flex flex-col items-center justify-center space-y-2'>
        <div className="text-3xl font-bold tracking-tight text-[#1D1C1D]">Join {workspace.name}</div>
        <div className='text-sm text-muted-foreground'>Enter the code to join the workspace</div>
        <div>
          <Form {...methods}>
            <form
              id="join-workspace-form"
              onSubmit={methods.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={methods.control}
                name="joinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP
                        {...field}
                        maxLength={6}
                        inputMode="text"
                        pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                        autoFocus
                      >
                        <InputOTPGroup className="font-bold">
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <Button
          type="submit"
          form="join-workspace-form"
          isLoading={isPending}
          className="w-full bg-[#611f69] hover:bg-[#4A154B] text-white"
        >
          Join Workspace
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          className="w-full text-[#1D1C1D] border-[#1D1C1D] hover:bg-[#F8F8F8]"
          asChild
        >
          <Link href="/" className="flex items-center justify-center">
            <HomeIcon className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </>
  )
}

export default JoinCodeVerificationForm