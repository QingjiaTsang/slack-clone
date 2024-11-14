import { Loader } from "lucide-react";
import {
  type GetMessagesPaginatedQueryType,
  DEFAULT_PAGINATION_NUM_ITEMS,
} from "@/api/message";

interface MessagesInfiniteScrollLoaderProps {
  status: GetMessagesPaginatedQueryType["status"];
  onLoadMore: GetMessagesPaginatedQueryType["loadMore"];
}

const MessagesInfiniteScrollLoader = ({
  status,
  onLoadMore,
}: MessagesInfiniteScrollLoaderProps) => {
  return (
    <>
      {status === "LoadingMore" && (
        <div className="relative text-center my-2">
          <hr className="absolute top-1/2 -translate-y-1/2 w-full -z-10" />
          <span className="px-4 py-1 rounded-full text-sm border border-gray-200 shadow-sm bg-white">
            <Loader className="size-4 animate-spin inline" />
          </span>
        </div>
      )}
      <div
        className="h-1"
        ref={(el) => {
          if (el) {
            const observer = new IntersectionObserver(
              (entries) => {
                if (entries[0].isIntersecting && status === "CanLoadMore") {
                  onLoadMore(DEFAULT_PAGINATION_NUM_ITEMS);
                }
              },
              {
                threshold: 1,
              }
            );
            observer.observe(el);
          }
        }}
      />
    </>
  );
};

export default MessagesInfiniteScrollLoader;
