import { useEffect, useRef } from "react";
import { Loader } from "lucide-react";
import {
  type GetMessagesPaginatedQueryType,
  DEFAULT_PAGINATION_NUM_ITEMS,
} from "@/api/message";

type MessagesInfiniteScrollLoaderProps = {
  status: GetMessagesPaginatedQueryType["status"];
  onLoadMore: GetMessagesPaginatedQueryType["loadMore"];
};

const MessagesInfiniteScrollLoader = ({
  status,
  onLoadMore,
}: MessagesInfiniteScrollLoaderProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // create new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          onLoadMore(DEFAULT_PAGINATION_NUM_ITEMS);
        }
      },
      {
        threshold: 1,
      }
    );

    // if element exists, start observing
    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    // cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [status, onLoadMore]);

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
      <div ref={elementRef} className="h-1" />
    </>
  );
};

export default MessagesInfiniteScrollLoader;
