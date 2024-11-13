import { api } from "@/convex/_generated/api";
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from "@convex-dev/react-query";

export const useCreateChannel = () =>
  useMutation({
    mutationFn: useConvexMutation(api.channels.create),
  });

export const useUpdateChannel = () =>
  useMutation({
    mutationFn: useConvexMutation(api.channels.updateOneById),
  });

export const useDeleteChannel = () =>
  useMutation({
    mutationFn: useConvexMutation(api.channels.deleteOneById),
  });
