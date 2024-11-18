import { Id } from "./_generated/dataModel";
import { type QueryCtxWithUserId } from "./functions";

export const getMember = (
  ctx: QueryCtxWithUserId,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_user_id_and_workspace_id", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .first();
};
