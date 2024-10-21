import { Id } from "../../../../convex/_generated/dataModel";

type TWorkspacePageProps = {
  params: {
    id: Id<"workspaces">
  }
}

const WorkspacePage = ({ params }: TWorkspacePageProps) => {

  return (
    <div>
      <h1>Workspace</h1>
    </div>
  )
}

export default WorkspacePage
