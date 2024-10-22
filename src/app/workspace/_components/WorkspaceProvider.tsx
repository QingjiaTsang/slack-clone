'use client';
import { Workspace } from '@/types/docs';

import { ReactNode } from 'react';
import { atom, Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';


type WorkspaceProviderProps = {
  currentWorkspace: Workspace | null;
  children: ReactNode;
};

export const workspaceAtom = atom<Workspace | null>(null);

const HydrateAtoms = ({ currentWorkspace, children }: WorkspaceProviderProps) => {
  // Note: useHydrateAtoms must be used in the Provider to hydrate the atoms
  // referenced practice: https://jotai.org/docs/guides/initialize-atom-on-render
  useHydrateAtoms([[workspaceAtom, currentWorkspace]]);
  return <>{children}</>;
};


const WorkspaceProvider = ({ currentWorkspace, children }: WorkspaceProviderProps) => {
  return (
    <Provider>
      <HydrateAtoms currentWorkspace={currentWorkspace}>
        {children}
      </HydrateAtoms>
    </Provider>
  );
};

export default WorkspaceProvider;