import { Id } from "../../../../convex/_generated/dataModel";

type WorkspacePageProps = {
  params: {
    id: Id<"workspaces">
  }
}

const WorkspacePage = ({ params }: WorkspacePageProps) => {
  return (
    <div>
      <h1>Workspace</h1>
    </div>
  )
}

export default WorkspacePage
