"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { configureBrowserCoreverseClient } from "@/lib/coreverse/client";

// Configuring the SDK is a synchronous, idempotent call -- doing it at
// module scope (not inside an effect) guarantees it has already run
// before the first render of any child that fires a query/mutation via
// "@Coreverse-Game-Engine/db-client/react".
configureBrowserCoreverseClient();

type CoreverseProviderProps = {
  children: ReactNode;
};

export const CoreverseProvider = ({ children }: CoreverseProviderProps) => {
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
