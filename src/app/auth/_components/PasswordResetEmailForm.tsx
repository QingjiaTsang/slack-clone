"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const emailSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

type TEmailSchema = z.infer<typeof emailSchema>

type TEmailFormProps = {
  onSubmit: (email: string) => void
  onCancel: () => void
}

const EmailForm = ({ onSubmit, onCancel }: TEmailFormProps) => {
  const methods = useForm<TEmailSchema>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    }
  })

  const handleSubmit = (data: TEmailSchema) => {
    onSubmit(data.email)
  }

  return (
    <Form {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-4">
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

        <div className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  )
}

export default EmailForm