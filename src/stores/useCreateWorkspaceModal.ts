import { atom, useAtom } from "jotai";

const isModalOpen = atom(false);

export const useCreateWorkspaceModal = () => {
  const [isOpen, setIsOpen] = useAtom(isModalOpen);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    setIsOpen,
    openModal,
    closeModal,
  };
};
