import { Workspace } from "@/types/docs";

import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcnUI/dialog"
import { Button } from "@/components/shadcnUI/button";
import { toast } from "sonner";

import { CopyIcon, LinkIcon, RefreshCcw } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

import { generateJoinCode } from "@/lib/generateJoinCode";

import useConfirm from "@/hooks/useConfirm";

type InviteMemberModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspace: Workspace;
}

const InviteMemberModal = ({ isOpen, setIsOpen, workspace }: InviteMemberModalProps) => {
  const router = useRouter();

  const [GenerateNewJoinCodeDialog, confirm] = useConfirm({
    title: "Generate a new Join Code?",
    message: "This will invalidate the current Join Code and generate a new one.",
  }) as [React.FC, () => Promise<boolean>];

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workspaces.updateOneById),
    onSuccess: () => {
      router.refresh();
      toast.success("Join Code updated");
    },
    onError: () => {
      toast.error("Failed to update Join Code");
    }
  });

  const handleCopyLink = async () => {
    await window.navigator.clipboard.writeText(`${window.location.origin}/join/${workspace._id}?joinCode=${workspace.joinCode}`);
    toast.success("Link copied to clipboard");
  }

  const handleCopyJoinCode = async () => {
    await window.navigator.clipboard.writeText(workspace.joinCode);
    toast.success("Join Code copied to clipboard");
  }

  const handleNewJoinCode = async () => {
    const confirmed = await confirm()
    if (confirmed) {
      mutate({ id: workspace._id!, joinCode: generateJoinCode(), name: workspace.name });
    }
  }


  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to {workspace.name}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Copy the Join Code or the Link below to invite
          </DialogDescription>

          <div className="my-12">
            <div className="flex items-baseline justify-center gap-2 uppercase text-4xl font-bold tracking-widest">
              {workspace.joinCode}
              <Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleCopyJoinCode}>
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between w-full">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <div>
              <Button variant="ghost" className="gap-2" disabled={isPending} onClick={handleNewJoinCode}>
                <RefreshCcw className="size-4" />
                New Join Code
              </Button>
              <Button variant="ghost" className="gap-2" disabled={isPending} onClick={handleCopyLink}>
                <LinkIcon className="size-4" />
                Copy Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <GenerateNewJoinCodeDialog />
    </>
  )
}

export default InviteMemberModal