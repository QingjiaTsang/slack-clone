import { Id } from '@/convex/_generated/dataModel'

import { redirect } from 'next/navigation'

import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

import JoinCodeVerificationForm from '@/features/join/_components/JoinCodeVerificationForm'
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server'


type JoinWorkspacePageProps = {
  params: {
    workspaceId: Id<'workspaces'>
  }
}

const JoinWorkspacePage = async ({ params }: JoinWorkspacePageProps) => {
  const workspacePromise = fetchQuery(api.workspaces.getPublicInfoById,
    { id: params.workspaceId },
    { token: convexAuthNextjsToken() }
  )

  const userMemberPromise = fetchQuery(api.workspaces.getCurrentUserRoleInWorkspace,
    { id: params.workspaceId },
    { token: convexAuthNextjsToken() }
  )

  const [workspace, userMember] = await Promise.all([workspacePromise, userMemberPromise])

  if (userMember) {
    redirect(`/workspace/${workspace!._id}`)
  }

  return (
    <div className="h-full flex items-center justify-center bg-[#4A154B]">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <JoinCodeVerificationForm workspace={workspace} />
      </div>
    </div>
  )
}

export default JoinWorkspacePage