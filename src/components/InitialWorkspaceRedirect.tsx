'use client'

import { Workspace } from "@/types/docs";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useCreateWorkspaceModal } from "@/stores/useCreateWorkspaceModal";
import CreateWorkspaceModal from "@/components/CreateWorkspaceModal";

type InitialWorkspaceRedirectProps = {
  initialWorkspaces: Workspace[] | null
}

const InitialWorkspaceRedirect = ({ initialWorkspaces }: InitialWorkspaceRedirectProps) => {
  const router = useRouter();
  const { openModal, closeModal } = useCreateWorkspaceModal();

  useEffect(() => {
    if (initialWorkspaces && initialWorkspaces.length > 0) {
      closeModal();
      router.push(`/workspace/${initialWorkspaces[0]?._id}`);
    } else {
      openModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialWorkspaces, openModal, closeModal, router]);

  return <CreateWorkspaceModal />
};

export default InitialWorkspaceRedirect;

