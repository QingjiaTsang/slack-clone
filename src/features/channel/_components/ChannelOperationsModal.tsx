"use client"

import { Channel } from "@/types/docs";

import { useState } from "react";

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnUI/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/shadcnUI/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/shadcnUI/form"
import { Input } from "@/components/shadcnUI/input"
import { toast } from "sonner";

import { TrashIcon } from "lucide-react";

import useConfirm from "@/hooks/useConfirm";
import { Button } from "@/components/shadcnUI/button";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";
import { useRouter } from "next/navigation";

type ChannelOperationsModalProps = {
  isAdmin: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  channel: Channel;
}

const ChannelOperationsModal = ({ isAdmin, isOpen, setIsOpen, channel }: ChannelOperationsModalProps) => {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.channels.deleteOneById),
    onSuccess: () => {
      toast.success('Channel deleted');
      setIsOpen(false);
      router.replace(`/workspace/${channel.workspaceId}`);
    },
    onError: (error) => {
      toast.error('Failed to delete channel');
      console.error({ error });
    }
  });

  const [DeleteChannelDialog, confirm] = useConfirm({
    title: "Delete Channel",
    message: "Are you sure you want to delete this channel?",
  }) as [React.FC, () => Promise<boolean>];

  const [isEditChannelModalOpen, setIsEditChannelModalOpen] = useState(false);


  const handleDeleteChannel = async () => {
    const confirmed = await confirm();
    if (!confirmed) {
      return;
    }

    mutate({ id: channel._id! });
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 bg-gray-100 h-auto">
          <DialogHeader className="p-4 border-b border-slate-200">
            <DialogTitle className="flex items-center gap-1">
              <span>#</span>
              <span>{channel.name}</span>
            </DialogTitle>
            <DialogDescription className="hidden">
              Manage your channel preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mb-4">
            <div className="mx-4 p-4 bg-white rounded-lg flex justify-between">
              <div>
                <div className="text-sm font-semibold">
                  Channel Name
                </div>
                <div className="text-sm">
                  {channel.name}
                </div>
              </div>
              {isAdmin && (
                <div
                  onClick={() => setIsEditChannelModalOpen(true)}
                  className="text-sm text-blue-500 cursor-pointer hover:underline"
                >
                  Edit
                </div>
              )}
            </div>

            {isAdmin && (
              <Button
                isLoading={isPending}
                onClick={handleDeleteChannel}
                className="text-destructive h-14 flex justify-start items-center gap-2 bg-white rounded-lg p-4 mx-4 hover:bg-red-50 transition-colors duration-300"
              >
                <TrashIcon className="size-4 shrink-0" />
                <div className="text-sm font-semibold">
                  Delete Channel
                </div>
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteChannelDialog />
      <EditChannelModal
        isOpen={isEditChannelModalOpen}
        onClose={() => setIsEditChannelModalOpen(false)}
        channel={channel}
      />
    </>
  )
}

export default ChannelOperationsModal

const editChannelFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
})

type EditChannelFormSchema = z.infer<typeof editChannelFormSchema>

type EditChannelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
}

const EditChannelModal = ({ isOpen, onClose, channel }: EditChannelModalProps) => {
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 640px)");

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.channels.updateOneById),
    onSuccess: () => {
      router.refresh();
      toast.success('Channel updated');
      methods.reset()
      onClose();
    },
    onError: (error) => {
      toast.error('Failed to update channel');
      console.error({ error });
    }
  });

  const methods = useForm<EditChannelFormSchema>({
    resolver: zodResolver(editChannelFormSchema),
    defaultValues: { name: channel.name }
  })

  const handleSubmit = async (data: EditChannelFormSchema) => {
    mutate({ id: channel!._id!, name: data.name });
  }

  const formContent = (
    <Form {...methods}>
      <form id="edit-channel-form" onSubmit={methods.handleSubmit(handleSubmit)}>
        <FormField
          control={methods.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder={`Channel Name e.g. "General"`}
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
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose} >
        <SheetContent side="bottom" >
          <SheetHeader>
            <SheetTitle>Rename Channel</SheetTitle>
            <SheetDescription className="hidden">
              Rename your channel to something more descriptive.
            </SheetDescription>
          </SheetHeader>

          {formContent}

          <SheetFooter className="mt-4">
            <Button form="edit-channel-form" type="submit" isLoading={isPending}>
              Save
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Channel</DialogTitle>
          <DialogDescription className="hidden">
            Rename your channel to something more descriptive.
          </DialogDescription>
        </DialogHeader>

        {formContent}

        <DialogFooter>
          <Button form="edit-channel-form" type="submit" isLoading={isPending}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}