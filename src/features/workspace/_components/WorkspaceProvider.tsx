"use client";
import { Workspace } from "@/types/docs";

import { ReactNode } from "react";
import { Provider } from "jotai";

type WorkspaceProviderProps = {
  currentWorkspace: Workspace | null;
  children: ReactNode;
};

const WorkspaceProvider = ({ children }: WorkspaceProviderProps) => {
  return <Provider>{children}</Provider>;
};

export default WorkspaceProvider;
