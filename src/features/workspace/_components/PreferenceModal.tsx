"use client";

import { Workspace } from "@/types/docs";
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
import { Button } from "@/components/shadcnUI/button";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

import useConfirm from "@/hooks/useConfirm";
import {
  useDeleteWorkspace,
  useUpdateWorkspace,
} from "@/features/workspace/api/workspace";

type PreferenceModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspace: Workspace;
};

const PreferenceModal = ({
  isOpen,
  setIsOpen,
  workspace,
}: PreferenceModalProps) => {
  const router = useRouter();
  const { mutate, isPending } = useDeleteWorkspace();
  const [isEditWorkspaceModalOpen, setIsEditWorkspaceModalOpen] =
    useState(false);

  const [DeleteWorkspaceConfirmDialog, confirm] = useConfirm({
    title: "Delete Workspace",
    message: "Are you sure you want to delete this workspace?",
  }) as [React.FC, () => Promise<boolean>];

  const handleDeleteWorkspace = async () => {
    const confirmed = await confirm();
    if (!confirmed) return;

    mutate(
      { id: workspace!._id! },
      {
        onSuccess: () => {
          toast.success("Workspace deleted");
          setIsOpen(false);
          router.replace("/workspace");
        },
        onError: (error) => {
          toast.error("Failed to delete workspace");
          console.error({ error });
        },
      }
    );
  };

  return (
    <>
      <DeleteWorkspaceConfirmDialog />
      <EditWorkspaceModal
        isOpen={isEditWorkspaceModalOpen}
        onClose={() => setIsEditWorkspaceModalOpen(false)}
        workspace={workspace}
      />

      <Credenza open={isOpen} onOpenChange={setIsOpen}>
        <CredenzaContent className="p-0 bg-gray-100 h-auto">
          <CredenzaHeader className="p-4 border-b border-slate-200">
            <CredenzaTitle>{workspace?.name}</CredenzaTitle>
            <CredenzaDescription className="hidden">
              Manage your workspace preferences.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            <div className="mx-4 p-4 max-md:mt-4 bg-white rounded-lg flex justify-between">
              <div>
                <div className="text-sm font-semibold">Workspace Name</div>
                <div className="text-sm">{workspace?.name}</div>
              </div>
              <div
                onClick={() => setIsEditWorkspaceModalOpen(true)}
                className="text-sm text-blue-500 cursor-pointer hover:underline"
              >
                Edit
              </div>
            </div>

            <div className="mx-4 my-4">
              <Button
                isLoading={isPending}
                onClick={handleDeleteWorkspace}
                variant="ghost"
                className="text-destructive w-full h-14 flex items-center justify-start gap-2 bg-white rounded-lg p-4 hover:bg-red-50 transition-colors duration-300"
              >
                <TrashIcon className="size-4 shrink-0" />
                <span className="text-sm font-semibold">Delete Workspace</span>
              </Button>
            </div>
          </CredenzaBody>
        </CredenzaContent>
      </Credenza>
    </>
  );
};

// EditWorkspaceModal component
const editWorkspaceFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

type EditWorkspaceFormSchema = z.infer<typeof editWorkspaceFormSchema>;

type EditWorkspaceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace | null;
};

const EditWorkspaceModal = ({
  isOpen,
  onClose,
  workspace,
}: EditWorkspaceModalProps) => {
  const router = useRouter();
  const { mutate, isPending } = useUpdateWorkspace();

  const methods = useForm<EditWorkspaceFormSchema>({
    resolver: zodResolver(editWorkspaceFormSchema),
    defaultValues: { name: workspace?.name },
  });

  const handleSubmit = async (data: EditWorkspaceFormSchema) => {
    mutate(
      { id: workspace!._id!, joinCode: workspace!.joinCode, name: data.name },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Workspace updated");
          onClose();
        },
        onError: (error) => {
          toast.error("Failed to update workspace");
          console.error({ error });
        },
      }
    );
  };

  return (
    <Credenza open={isOpen} onOpenChange={onClose}>
      <CredenzaContent>
        <CredenzaHeader>
          <CredenzaTitle>Rename Workspace</CredenzaTitle>
          <CredenzaDescription className="hidden">
            Rename your workspace to something more descriptive.
          </CredenzaDescription>
        </CredenzaHeader>

        <CredenzaBody>
          <Form {...methods}>
            <form
              id="edit-workspace-form"
              onSubmit={methods.handleSubmit(handleSubmit)}
            >
              <FormField
                control={methods.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={`Workspace Name e.g. "Personal Workspace"`}
                        {...field}
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
            form="edit-workspace-form"
            type="submit"
            isLoading={isPending}
          >
            Save
          </Button>
        </CredenzaFooter>
      </CredenzaContent>
    </Credenza>
  );
};

export default PreferenceModal;
