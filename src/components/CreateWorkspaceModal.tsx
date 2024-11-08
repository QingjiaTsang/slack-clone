'use client'

import { useRouter } from "next/navigation";

import { useCreateWorkspaceModal } from "@/stores/useCreateWorkspaceModal";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcnUI/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnUI/dialog"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/shadcnUI/form"
import { Input } from "@/components/shadcnUI/input"
import { Button } from "@/components/shadcnUI/button"
import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

import { useMediaQuery } from "@/hooks/useMediaQuery";

const workspaceFormSchema = z.object({
  name: z.string().min(1, { message: 'Workspace name is required' }),
})

type TWorkspaceFormSchema = z.infer<typeof workspaceFormSchema>


const CreateWorkspaceModal = () => {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 640px)");

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.create),
    onSuccess: (newWorkspaceId) => {
      closeModal()
      toast.success('Workspace created')
      router.push(`/workspace/${newWorkspaceId}`)
      methods.reset()
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
        <form id="create-workspace-form" onSubmit={methods.handleSubmit(onSubmit)}>
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
            <SheetDescription className="hidden">
              Create a new workspace to start your project.
            </SheetDescription>
          </SheetHeader>

          {ModalContent}

          <SheetFooter className="mt-4">
            <Button form="create-workspace-form" type="submit" isLoading={isPending}>Create</Button>
          </SheetFooter>
        </SheetContent>

      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Workspace</DialogTitle>
          <DialogDescription className="hidden">
            Create a new workspace to start your project.
          </DialogDescription>
        </DialogHeader>

        {ModalContent}

        <DialogFooter>
          <Button form="create-workspace-form" type="submit" isLoading={isPending}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateWorkspaceModal
