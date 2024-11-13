import { api } from "@/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { Id } from "@/convex/_generated/dataModel";

export const useGetAllMembersByWorkspaceId = (workspaceId: Id<"workspaces">) =>
  useQuery(convexQuery(api.members.getAllByWorkspaceId, { workspaceId }));
