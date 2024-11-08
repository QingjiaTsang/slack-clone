'use client'

import { Id } from "@/convex/_generated/dataModel";

import { useParams, useRouter } from "next/navigation";

import { useCreateChannelModal } from "@/stores/useCreateChannelModal";

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
  name: z.string().max(80).min(3, { message: 'Channel name must be between 3 and 80 characters' }),
})

type TWorkspaceFormSchema = z.infer<typeof workspaceFormSchema>


const CreateChannelModal = () => {
  const params = useParams()
  const router = useRouter()

  const workspaceId = params.workspaceId as Id<"workspaces">

  const isMobile = useMediaQuery("(max-width: 640px)");

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.channels.create),
    onSuccess: (newChannelId) => {
      closeModal()
      toast.success('Channel created')
      router.push(`/workspace/${workspaceId}/channel/${newChannelId}`)
      methods.reset()
    },
    onError: (error) => {
      toast.error('Failed to create channel')
      console.error({ error })
    }
  });

  const methods = useForm<TWorkspaceFormSchema>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: { name: '' }
  })

  const { isOpen, setIsOpen, closeModal } = useCreateChannelModal();

  const onSubmit = async (data: TWorkspaceFormSchema) => {
    mutate({ workspaceId: workspaceId, name: data.name })
  }

  const ModalContent = (
    <>
      <Form {...methods}>
        <form id="create-channel-form" onSubmit={methods.handleSubmit(onSubmit)}>
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. study-group"
                    onCompositionEnd={(e) => {
                      const target = e.target as HTMLInputElement;
                      field.onChange(target.value.replace(/\s+/g, '-'));
                    }}
                    onChange={(e) => {
                      if (!(e.nativeEvent as InputEvent).isComposing) {
                        field.onChange(e.target.value.replace(/\s+/g, '-'));
                      } else {
                        field.onChange(e.target.value);
                      }
                    }}
                  />
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
            <SheetTitle>Create a Channel</SheetTitle>
            <SheetDescription className="hidden">
              Create a new channel to start your project.
            </SheetDescription>
          </SheetHeader>

          {ModalContent}

          <SheetFooter className="mt-4">
            <Button form="create-channel-form" type="submit" isLoading={isPending}>Create</Button>
          </SheetFooter>
        </SheetContent>

      </Sheet>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Channel</DialogTitle>
          <DialogDescription className="hidden">
            Create a new channel to start your project.
          </DialogDescription>
        </DialogHeader>

        {ModalContent}

        <DialogFooter>
          <Button form="create-channel-form" type="submit" isLoading={isPending}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal
