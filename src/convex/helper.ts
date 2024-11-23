import { Doc, Id } from "./_generated/dataModel";
import { type QueryCtxWithUserId } from "./functions";

export type MemberWithUserInfo = Doc<"members"> & {
  user: Doc<"users">;
};

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

export const getMemberWithUserInfoById = async (
  ctx: QueryCtxWithUserId,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">
) => {
  const member = await getMember(ctx, workspaceId, userId);
  if (!member) {
    return null;
  }

  const user = await ctx.db.get(member.userId);
  if (!user) {
    return null;
  }

  return { ...member, user };
};
