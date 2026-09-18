"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useGetMyProfile } from "@Coreverse-Game-Engine/db-client/react";
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

  // profileQuery.data is a discriminated union over `status`
  // ({status:200,data:GetMyProfile200} | {status:401,...} | {status:404,...}),
  // since coreverseFetch resolves with the full envelope on success. Narrow
  // on status===200 before touching `.data` -- accessing it unnarrowed
  // fails to typecheck because the 401/404 bodies don't have
  // username/avatar_url at all.
  const profileResult = profileQuery.data;
  const profile = profileResult?.status === 200 ? profileResult.data : undefined;

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
