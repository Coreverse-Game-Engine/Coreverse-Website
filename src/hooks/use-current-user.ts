"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useGetMyProfile } from "@Coreverse-Game-Engine/db-client/react";
import type { GetMyProfile200 } from "@Coreverse-Game-Engine/db-client";
import { createClient } from "@/supabase/client";

export type CurrentUser = {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
};

type UseCurrentUserResult = {
  user: CurrentUser | null;
  isLoading: boolean;
};

// Auth metadata's username is only ever a fallback now -- used before
// GET /profiles/me has resolved, and in the unlikely case a profile row
// doesn't exist yet. Once the API responds, its username/avatar_url win.
const fallbackUsername = (authUser: User): string => {
  const metadataUsername = authUser.user_metadata.username;
  if (typeof metadataUsername === "string" && metadataUsername.length > 0) {
    return metadataUsername;
  }
  return authUser.email?.split("@")[0] || "?";
};

export const useCurrentUser = (): UseCurrentUserResult => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setAuthUser(data.user);
      setIsAuthLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const profileQuery = useGetMyProfile({
    query: { enabled: !!authUser },
  });

  if (!authUser) {
    return { user: null, isLoading: isAuthLoading };
  }

  // NOTE: the generated type for this hook's `.data` is a
  // { data, status, headers } envelope (Orval's usual "fetch" client
  // shape), but the SDK's coreverseFetch mutator currently resolves with
  // the parsed response body directly, not that envelope -- so at runtime
  // this is a flat GetMyProfile200, not `.data.username`. Casting through
  // `unknown` here to match actual behavior; this should go away once
  // Coreverse DB's mutator is fixed to return the envelope its own
  // generated types promise (see chat note).
  const profile = profileQuery.data as unknown as GetMyProfile200 | undefined;

  return {
    user: {
      id: authUser.id,
      email: authUser.email ?? "",
      username: profile?.username || fallbackUsername(authUser),
      avatarUrl: profile?.avatar_url ?? null,
    },
    isLoading: isAuthLoading || profileQuery.isLoading,
  };
};
