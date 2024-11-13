import { api } from "@/convex/_generated/api";
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";

export const useGetCurrentUser = () =>
  useQuery(convexQuery(api.users.getCurrentUser, {}));
