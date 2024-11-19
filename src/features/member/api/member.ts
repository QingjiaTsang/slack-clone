import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useDeleteMemberById = () =>
  useMutation({
    mutationFn: useConvexMutation(api.members.deleteOneById),
  });

export const useUpdateMemberRoleById = () =>
  useMutation({
    mutationFn: useConvexMutation(api.members.updateOneById),
  });
