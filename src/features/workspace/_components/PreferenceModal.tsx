"use client";

import { Workspace } from "@/types/docs";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnUI/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from "@/components/shadcnUI/sheet";
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
import { useMediaQuery } from "@/hooks/useMediaQuery";

import { useRouter } from "next/navigation";
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

  const [DeleteWorkspaceConfirmDialog, confirm] = useConfirm({
    title: "Delete Workspace",
    message: "Are you sure you want to delete this workspace?",
  }) as [React.FC, () => Promise<boolean>];

  const [isEditWorkspaceModalOpen, setIsEditWorkspaceModalOpen] =
    useState(false);

  const handleDeleteWorkspace = async () => {
    const confirmed = await confirm();
    if (!confirmed) {
      return;
    }

    mutate(
      { id: workspace!._id! },
      {
        onSuccess: () => {
          toast.success("Workspace deleted");
          setIsOpen(false);
          router.replace("/");
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 bg-gray-100 h-auto">
          <DialogHeader className="p-4 border-b border-slate-200">
            <DialogTitle>{workspace?.name}</DialogTitle>
            <DialogDescription className="hidden">
              Manage your workspace preferences.
            </DialogDescription>
          </DialogHeader>
          <div className="mx-4 p-4 bg-white rounded-lg flex justify-between">
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

          <Button
            isLoading={isPending}
            onClick={handleDeleteWorkspace}
            className="text-destructive h-14 flex justify-start items-center gap-2 bg-white rounded-lg p-4 mx-4 mb-4 hover:bg-red-50 transition-colors duration-300"
          >
            <TrashIcon className="size-4 shrink-0" />
            <div className="text-sm font-semibold">Delete Workspace</div>
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PreferenceModal;

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

  const isMobile = useMediaQuery("(max-width: 640px)");

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

  const formContent = (
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
  );

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Rename Workspace</SheetTitle>
            <SheetDescription className="hidden">
              Rename your workspace to something more descriptive.
            </SheetDescription>
          </SheetHeader>

          {formContent}

          <SheetFooter className="mt-4">
            <Button
              form="edit-workspace-form"
              type="submit"
              isLoading={isPending}
            >
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
          <DialogTitle>Rename Workspace</DialogTitle>
          <DialogDescription className="hidden">
            Rename your workspace to something more descriptive.
          </DialogDescription>
        </DialogHeader>

        {formContent}

        <DialogFooter>
          <Button
            form="edit-workspace-form"
            type="submit"
            isLoading={isPending}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
