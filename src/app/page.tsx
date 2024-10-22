import { api } from "../../convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

import InitialWorkspaceRedirect from "@/components/InitialWorkspaceRedirect";


export default async function Home() {
  const currentUserWorkspaces = await fetchQuery(
    api.workspaces.getAllByAuth,
    {},
    // Note: if no token is sent, getAuthUserId() in the server will return null
    // For more info, see:
    // https://labs.convex.dev/auth/authz/nextjs#preloading-and-loading-data
    // https://docs.convex.dev/client/react/nextjs/server-rendering#server-side-authentication
    {
      token: convexAuthNextjsToken()
    }
  );

  return (
    <>
      <InitialWorkspaceRedirect initialWorkspaces={currentUserWorkspaces} />
    </>
  );
}
