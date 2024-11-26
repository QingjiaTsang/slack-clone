"use client";

import { Channel } from "@/types/docs";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Credenza,
  CredenzaBody,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/shadcnUI/credenza";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcnUI/form";
import { Input } from "@/components/shadcnUI/input";
import { toast } from "sonner";
import { Button } from "@/components/shadcnUI/button";

import { TrashIcon } from "lucide-react";

import useConfirm from "@/hooks/useConfirm";

import {
  useDeleteChannel,
  useUpdateChannel,
} from "@/features/channel/api/channel";

type ChannelOperationsModalProps = {
  isAdmin: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  channel: Channel;
};

const ChannelOperationsModal = ({
  isAdmin,
  isOpen,
  setIsOpen,
  channel,
}: ChannelOperationsModalProps) => {
  const router = useRouter();

  const { mutate, isPending } = useDeleteChannel();

  const [DeleteChannelConfirmDialog, confirm] = useConfirm({
    title: "Delete Channel",
    message: "Are you sure you want to delete this channel?",
  }) as [React.FC, () => Promise<boolean>];

  const [isEditChannelModalOpen, setIsEditChannelModalOpen] = useState(false);

  const handleDeleteChannel = async () => {
    const confirmed = await confirm();
    if (!confirmed) {
      return;
    }

    mutate(
      { id: channel._id! },
      {
        onSuccess: () => {
          toast.success("Channel deleted");
          setIsOpen(false);
          router.replace(`/workspace/${channel.workspaceId}`);
        },
        onError: (error) => {
          toast.error("Failed to delete channel");
          console.error({ error });
        },
      }
    );
  };

  return (
    <>
      <DeleteChannelConfirmDialog />
      <EditChannelModal
        isOpen={isEditChannelModalOpen}
        onClose={() => setIsEditChannelModalOpen(false)}
        channel={channel}
      />

      <Credenza open={isOpen} onOpenChange={setIsOpen}>
        <CredenzaContent className="p-0 bg-gray-100 h-auto">
          <CredenzaHeader className="p-4 border-b border-slate-200">
            <CredenzaTitle className="flex items-center gap-1">
              <span>#</span>
              <span>{channel.name}</span>
            </CredenzaTitle>
            <CredenzaDescription className="hidden">
              Manage your channel preferences.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody className="flex flex-col gap-4 mb-4 max-md:mt-4">
            <div className="mx-4 p-4 bg-white rounded-lg flex justify-between">
              <div>
                <div className="text-sm font-semibold">Channel Name</div>
                <div className="text-sm">{channel.name}</div>
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
                <div className="text-sm font-semibold">Delete Channel</div>
              </Button>
            )}
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </>
  );
};

export default ChannelOperationsModal;

const editChannelFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

type EditChannelFormSchema = z.infer<typeof editChannelFormSchema>;

type EditChannelModalProps = {
  isOpen: boolean;
  onClose: () => void;
  channel: Channel;
};

const EditChannelModal = ({
  isOpen,
  onClose,
  channel,
}: EditChannelModalProps) => {
  const router = useRouter();

  const { mutate, isPending } = useUpdateChannel();

  const methods = useForm<EditChannelFormSchema>({
    resolver: zodResolver(editChannelFormSchema),
    defaultValues: { name: channel.name },
  });

  const handleSubmit = async (data: EditChannelFormSchema) => {
    mutate(
      { id: channel!._id!, name: data.name },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Channel updated");
          methods.reset();
          onClose();
        },
        onError: (error) => {
          toast.error("Failed to update channel");
          console.error({ error });
        },
      }
    );
  };

  const formContent = (
    <Form {...methods}>
      <form
        id="edit-channel-form"
        onSubmit={methods.handleSubmit(handleSubmit)}
      >
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
                    field.onChange(target.value.replace(/\s+/g, "-"));
                  }}
                  onChange={(e) => {
                    if (!(e.nativeEvent as InputEvent).isComposing) {
                      field.onChange(e.target.value.replace(/\s+/g, "-"));
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

  return (
    <Credenza open={isOpen} onOpenChange={onClose}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Rename Channel</CredenzaTitle>
          <CredenzaDescription className="hidden">
            Rename your channel to something more descriptive.
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>{formContent}</CredenzaBody>

        <CredenzaFooter>
          <Button form="edit-channel-form" type="submit" isLoading={isPending}>
            Save
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};
