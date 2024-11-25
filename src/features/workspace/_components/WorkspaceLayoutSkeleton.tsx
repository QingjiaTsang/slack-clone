import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/shadcnUI/resizable";
import { Skeleton } from "@/components/shadcnUI/skeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const WorkspaceLayoutSkeleton = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (isMobile) {
    return (
      <div className="flex flex-col h-[100dvh]">
        {/* mobile header skeleton */}
        <div className="h-14 bg-[#481349] flex items-center px-4 gap-4">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="flex-1 h-8" />
          <Skeleton className="w-8 h-8" />
        </div>

        {/* channel title skeleton */}
        <div className="px-4 py-2 border-b">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6" />
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-4 h-4 ml-auto" />
          </div>
        </div>

        {/* message list skeleton - flex-1 to take remaining space */}
        <div className="flex-1 overflow-y-auto">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-start gap-2 p-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-12 h-4" />
                </div>
                <Skeleton className="w-3/4 h-4" />
              </div>
            </div>
          ))}
        </div>

        {/* message input skeleton */}
        <div className="p-4 border-t bg-background">
          <div className="rounded-lg border">
            <div className="flex items-center gap-2 p-2">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
            </div>
            <div className="px-3 py-2">
              <Skeleton className="w-full h-8" />
            </div>
          </div>
        </div>

        {/* bottom navigation skeleton */}
        <div className="h-16 border-t flex justify-around items-center px-4">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* header skeleton */}
      <div className="h-14 bg-[#481349] flex justify-center items-center">
        <div className="px-3 h-full flex items-center">
          <Skeleton className="w-[50svw] h-8 bg-white/10" />
        </div>
      </div>

      <div className="flex">
        {/* workspace switcher sidebar skeleton */}
        <div className="hidden md:flex h-[calc(100dvh-56px)] w-20 bg-[#481349] flex-col items-center p-2 space-y-4">
          <div className="w-12 h-12 rounded-lg bg-white/10 animate-pulse" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 rounded-lg bg-white/10 animate-pulse"
            />
          ))}
        </div>

        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId="workspace-layout"
        >
          {/* workspace sidebar skeleton */}
          <ResizablePanel
            defaultSize={20}
            minSize={20}
            className="bg-[#5E2C5F] h-[calc(100dvh-56px)]"
          >
            <div className="p-4 space-y-6">
              {/* workspace header skeleton */}
              <div className="h-8 bg-white/10 rounded-md animate-pulse" />

              {/* navigation items skeleton */}
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 bg-white/10 rounded-md animate-pulse"
                  />
                ))}
              </div>

              {/* channels skeleton */}
              <div className="space-y-2">
                <div className="h-6 bg-white/10 rounded-md animate-pulse w-1/2" />
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 bg-white/10 rounded-md animate-pulse"
                  />
                ))}
              </div>

              {/* direct messages skeleton */}
              <div className="space-y-2">
                <div className="h-6 bg-white/10 rounded-md animate-pulse w-1/2" />
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-6 bg-white/10 rounded-md animate-pulse"
                  />
                ))}
              </div>
            </div>
          </ResizablePanel>

          {/* main content skeleton */}
          <ResizablePanel minSize={20} defaultSize={80}>
            <div className="flex flex-col h-full">
              {/* Channel header skeleton */}
              <div className="h-[49px] border-b border-gray-200 flex items-center px-4">
                <Skeleton className="w-48 h-7" />
              </div>

              {/* Channel hero skeleton */}
              <div className="mt-20 mx-5 mb-4 p-8 rounded-lg">
                <Skeleton className="w-48 h-8 mb-2" />
                <Skeleton className="w-96 h-4" />
              </div>

              {/* Message list skeleton */}
              <div className="flex-1">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-start gap-2 p-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-24 h-4" />
                        <Skeleton className="w-12 h-4" />
                      </div>
                      <Skeleton className="w-3/4 h-4" />
                      <Skeleton className="w-1/2 h-4" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Message editor skeleton */}
              <div className="px-4 pb-4">
                <div className="rounded-lg border bg-background">
                  {/* Editor toolbar skeleton */}
                  <div className="flex items-center gap-1 border-b px-4 py-2">
                    {[...Array(6)].map((_, i) => (
                      <Skeleton key={i} className="w-8 h-8" />
                    ))}
                  </div>
                  {/* Editor input area skeleton */}
                  <div className="px-4 py-3">
                    <Skeleton className="w-full h-[60px]" />
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayoutSkeleton;
