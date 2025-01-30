"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex-1">{children}</main>
    </QueryClientProvider>
  );
};
