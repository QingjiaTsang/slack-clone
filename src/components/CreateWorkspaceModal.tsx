'use client'

import { Id } from "../../convex/_generated/dataModel";

import { useRouter } from "next/navigation";

import { useCreateWorkspaceModal } from "@/stores/useCreateWorkspaceModal";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { api } from "../../convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

import { useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery"; // 假设您有这个 hook

const workspaceFormSchema = z.object({
  name: z.string().min(1, { message: 'Workspace name is required' }),
})

type TWorkspaceFormSchema = z.infer<typeof workspaceFormSchema>


const CreateWorkspaceModal = () => {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { mutate, isPending } = useMutation<
    Id<"workspaces"> | null,
    Error,
    { name: string }
  >({
    mutationFn: useConvexMutation(api.workspaces.create),
    onSuccess: (newWorkspaceId) => {
      closeModal()
      toast.success('Workspace created')
      router.push(`/workspace/${newWorkspaceId}`)
    },
    onError: (error) => {
      toast.error('Failed to create workspace')
      console.error({ error })
    }
  });

  const methods = useForm<TWorkspaceFormSchema>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: { name: '' }
  })

  const { isOpen, setIsOpen, closeModal } = useCreateWorkspaceModal();

  const onSubmit = async (data: TWorkspaceFormSchema) => {
    mutate({ name: data.name })
  }

  const ModalContent = (
    <>
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Workspace name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="mt-4 flex justify-end">
            <Button type="submit" isLoading={isPending}>Create</Button>
          </div>
        </form>
      </Form>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="space-y-4">
          <SheetHeader>
            <SheetTitle>Create a Workspace</SheetTitle>
          </SheetHeader>
          {ModalContent}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Workspace</DialogTitle>
        </DialogHeader>
        {ModalContent}
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceModal
