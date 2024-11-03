import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcnUI/form"
import { Input } from "@/components/shadcnUI/input"
import { Button } from "@/components/shadcnUI/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/shadcnUI/input-otp"

const otpFormSchema = z.object({
  code: z.string().min(8, { message: 'Code must be 8 digits' }),
})

type TOTPFormSchema = z.infer<typeof otpFormSchema>

type OTPVerificationFormProps = {
  onSubmit: (data: TOTPFormSchema) => Promise<void>
  email: string
}

const OTPVerificationForm = ({ onSubmit, email }: OTPVerificationFormProps) => {
  const methods = useForm<TOTPFormSchema>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: { code: '' }
  })

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <FormItem>
          <FormLabel>Email</FormLabel>
          <Input value={email} disabled className="mt-2" />
        </FormItem>

        <FormField
          control={methods.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={8} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                    <InputOTPSlot index={6} />
                    <InputOTPSlot index={7} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


        <Button type="submit" className="w-full mt-4">Verify</Button>
      </form>
    </Form>
  )
}

export default OTPVerificationForm
