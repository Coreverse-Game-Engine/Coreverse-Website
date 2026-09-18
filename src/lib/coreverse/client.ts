import { configureCoreverseClient } from "@Coreverse-Game-Engine/db-client";
import { createClient } from "@/supabase/client";

let configured = false;

/**
 * Configures the Coreverse DB SDK for use in the browser. Every request
 * (queries/mutations from "@Coreverse-Game-Engine/db-client/react") gets
 * the caller's current Supabase Auth session access token attached via
 * getAuthToken -- fetched fresh before each call, so token refresh is
 * Supabase's problem, not ours. Operations the OpenAPI spec marks public
 * (`security: []`, e.g. GET /releases) never consult it.
 *
 * Called once from CoreverseProvider. Idempotent so it's safe to import
 * and invoke from more than one place without double-configuring.
 */
export const configureBrowserCoreverseClient = () => {
  if (configured) return;
  configured = true;

  configureCoreverseClient({
    baseUrl: process.env.NEXT_PUBLIC_COREVERSE_API_URL!,
    getAuthToken: async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    },
  });
};
