"use client";

import { useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "@/stores/useCreateWorkspaceModal";

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

import { useCreateWorkspace } from "@/features/workspace/api/workspace";

const workspaceFormSchema = z.object({
  name: z.string().min(1, { message: "Workspace name is required" }),
});

type TWorkspaceFormSchema = z.infer<typeof workspaceFormSchema>;

const CreateWorkspaceModal = () => {
  const router = useRouter();
  const { mutate, isPending } = useCreateWorkspace();

  const methods = useForm<TWorkspaceFormSchema>({
    resolver: zodResolver(workspaceFormSchema),
    defaultValues: { name: "" },
  });

  const { isOpen, setIsOpen, closeModal } = useCreateWorkspaceModal();

  const onSubmit = async (data: TWorkspaceFormSchema) => {
    mutate(
      { name: data.name },
      {
        onSuccess: (newWorkspaceId) => {
          closeModal();
          toast.success("Workspace created");
          router.replace(`/workspace/${newWorkspaceId}`);
          methods.reset();
        },
        onError: (error) => {
          toast.error("Failed to create workspace");
          console.error({ error });
        },
      }
    );
  };

  return (
    <Credenza open={isOpen} onOpenChange={setIsOpen}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Create a Workspace</CredenzaTitle>
          <CredenzaDescription className="hidden">
            Create a new workspace to start your project.
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          <Form {...methods}>
            <form
              id="create-workspace-form"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
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
        </CredenzaBody>

        <CredenzaFooter>
          <Button
            form="create-workspace-form"
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

export default CreateWorkspaceModal;
