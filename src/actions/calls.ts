"use server";

import { type UserRequest, StreamClient } from "@stream-io/node-sdk";
import { type User } from "@stream-io/video-react-sdk";
import { type MemberWithUserInfo } from "@/convex/helper";

const apiKey = process.env.STREAM_API_KEY!;
const secret = process.env.STREAM_SECRET!;
const client = new StreamClient(apiKey, secret, {
  // to prevent timeout error when joining call
  timeout: 30 * 1000,
});

export async function createStreamUserTokenAction(
  memberWithUserInfon: MemberWithUserInfo
) {
  try {
    const streamUser: UserRequest = {
      id: memberWithUserInfon._id,
      custom: {
        color: "red",
      },
      name: memberWithUserInfon.user.name,
      image: memberWithUserInfon.user.image,
    };
    await client.upsertUsers([streamUser]);

    const validity = 60 * 60;

    const token = client.generateUserToken({
      user_id: memberWithUserInfon._id,
      validity_in_seconds: validity,
    });

    const clientUser: User = {
      id: streamUser.id,
      name: streamUser.name,
      image: streamUser.image,
    };

    return { token, clientUser };
  } catch (error) {
    console.error("Failed to create stream user token:", error);
    throw new Error("Failed to create stream user token, please try again");
  }
}
