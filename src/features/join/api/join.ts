import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useJoinWorkspace = () =>
  useMutation({
    mutationFn: useConvexMutation(api.workspaces.join),
  });
