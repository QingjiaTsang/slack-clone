"use client";

import { ReactNode } from "react";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";

import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Toaster } from "@/components/shadcnUI/sonner";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const convexQueryClient = new ConvexQueryClient(convex);
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <Toaster position="top-center" richColors={true} />
          {children}
        </QueryClientProvider>
      </NuqsAdapter>
    </ConvexAuthNextjsProvider>
  );
}
