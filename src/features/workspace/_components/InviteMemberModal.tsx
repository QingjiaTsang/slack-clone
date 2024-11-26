import { Workspace } from "@/types/docs";

import { useRouter } from "next/navigation";

import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/shadcnUI/credenza";
import { Button } from "@/components/shadcnUI/button";
import { toast } from "sonner";

import { CopyIcon, LinkIcon, RefreshCcw } from "lucide-react";

import { generateJoinCode } from "@/lib/generateJoinCode";

import useConfirm from "@/hooks/useConfirm";
import { useUpdateWorkspace } from "@/features/workspace/api/workspace";

type InviteMemberModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  workspace: Workspace;
};

const InviteMemberModal = ({
  isOpen,
  setIsOpen,
  workspace,
}: InviteMemberModalProps) => {
  const router = useRouter();

  const [GenerateNewJoinCodeConfirmDialog, confirm] = useConfirm({
    title: "Generate a new Join Code?",
    message:
      "This will invalidate the current Join Code and generate a new one.",
  }) as [React.FC, () => Promise<boolean>];

  const { mutate, isPending } = useUpdateWorkspace();

  const handleCopyLink = async () => {
    if (typeof window === "undefined") {
      return;
    }

    await window.navigator.clipboard.writeText(
      `${window.location.origin}/join/${workspace._id}?joinCode=${workspace.joinCode}`
    );
    toast.success("Link copied to clipboard");
  };

  const handleCopyJoinCode = async () => {
    await window.navigator.clipboard.writeText(workspace.joinCode);
    toast.success("Join Code copied to clipboard");
  };

  const handleNewJoinCode = async () => {
    const confirmed = await confirm();
    if (confirmed) {
      mutate(
        {
          id: workspace._id!,
          joinCode: generateJoinCode(),
          name: workspace.name,
        },
        {
          onSuccess: () => {
            router.refresh();
            toast.success("Join Code updated");
          },
          onError: () => {
            toast.error("Failed to update Join Code");
          },
        }
      );
    }
  };

  return (
    <>
      <GenerateNewJoinCodeConfirmDialog />

      <Credenza open={isOpen} onOpenChange={setIsOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Invite to {workspace.name}</CredenzaTitle>
            <CredenzaDescription>
              Copy the Join Code or the Link below to invite
            </CredenzaDescription>
          </CredenzaHeader>

          <CredenzaBody>
            <div className="flex items-baseline justify-center gap-2 uppercase text-4xl font-bold tracking-widest my-12">
              {workspace.joinCode}
              <Button
                variant="ghost"
                size="iconSm"
                disabled={isPending}
                onClick={handleCopyJoinCode}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </CredenzaBody>

          <CredenzaFooter className="flex items-center justify-between w-full">
            <CredenzaClose asChild>
              <Button variant="outline">Cancel</Button>
            </CredenzaClose>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="gap-2"
                disabled={isPending}
                onClick={handleNewJoinCode}
              >
                <RefreshCcw className="size-4" />
                New Join Code
              </Button>
              <Button
                variant="ghost"
                className="gap-2"
                disabled={isPending}
                onClick={handleCopyLink}
              >
                <LinkIcon className="size-4" />
                Copy Link
              </Button>
            </div>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  );
};

export default InviteMemberModal;
