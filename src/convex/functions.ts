/* eslint-disable no-restricted-imports */
import { Id } from "./_generated/dataModel";

import {
  action as actionRaw,
  mutation as mutationRaw,
  query as queryRaw,
  ActionCtx,
  QueryCtx,
  MutationCtx,
} from "./_generated/server";
/* eslint-enable no-restricted-imports */
import { ConvexError } from "convex/values";
import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { getAuthUserId } from "@convex-dev/auth/server";

// Note: consistent error handling practice in this project:
// for query, it doesn't throws error in order to avoid error handling in RSC and RCC for code briefness
// but for mutation, it's allowed to throw errors because it's always using react-query to handle error in client side
const authCheck = customCtx(async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Not authenticated");

  const userId = await getAuthUserId(ctx);
  if (!userId) throw new ConvexError("User ID not found");

  return { userId };
});

const queryAuthCheck = customCtx(async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  const userId = identity ? await getAuthUserId(ctx) : null;
  return { userId };
});

export const query = customQuery(queryRaw, queryAuthCheck);
export const mutation = customMutation(mutationRaw, authCheck);
export const action = customAction(actionRaw, authCheck);

export type QueryCtxWithUserId = QueryCtx & { userId: Id<"users"> | null };
export type MutationCtxWithUserId = MutationCtx & {
  userId: Id<"users"> | null;
};
