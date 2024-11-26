"use client";

import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useCreateChannelModal } from "@/stores/useCreateChannelModal";

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
import { Button } from "@/components/shadcnUI/button";
import { toast } from "sonner";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCreateChannel } from "@/features/channel/api/channel";

const workspaceFormSchema = z.object({
  name: z
    .string()
    .max(80)
    .min(3, { message: "Channel name must be between 3 and 80 characters" }),
});

type TWorkspaceFormSchema = z.infer<typeof workspaceFormSchema>;

const CreateChannelModal = () => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspaceId as Id<"workspaces">;
  const { mutate, isPending } = useCreateChannel();

  const methods = useForm<TWorkspaceFormSchema>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: { name: "" },
  });

  const { isOpen, setIsOpen, closeModal } = useCreateChannelModal();

  const onSubmit = async (data: TWorkspaceFormSchema) => {
    mutate(
      { workspaceId: workspaceId, name: data.name },
      {
        onSuccess: (newChannelId) => {
          closeModal();
          toast.success("Channel created");
          router.replace(`/workspace/${workspaceId}/channel/${newChannelId}`);
          methods.reset();
        },
        onError: (error) => {
          toast.error("Failed to create channel");
          console.error({ error });
        },
      }
    );
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Create a Channel</CredenzaTitle>
          <CredenzaDescription className="hidden">
            Create a new channel to start your project.
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          <Form {...methods}>
            <form
              id="create-channel-form"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
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
        </CredenzaBody>

        <CredenzaFooter>
          <Button
            form="create-channel-form"
            type="submit"
            isLoading={isPending}
          >
            Create
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default CreateChannelModal;
