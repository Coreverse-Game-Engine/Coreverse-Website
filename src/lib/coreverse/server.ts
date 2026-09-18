import { configureCoreverseClient } from "@Coreverse-Game-Engine/db-client";

let configured = false;

/**
 * Configures the Coreverse DB SDK for use from Next.js Server Actions /
 * Route Handlers. Deliberately has no getAuthToken: the Supabase session
 * lives in the browser, not in this shared server process, so wiring one
 * up here would either be wrong (stale/cross-request) or require plumbing
 * a token through on every call. Only operations the OpenAPI spec marks
 * public (`security: []`) -- e.g. Faz 3's requestPasswordReset -- are
 * ever meant to be called through this configuration. Anything scoped to
 * the caller's own profile/avatar goes through the browser provider
 * instead (see ./client.ts).
 *
 * Call this once at the top of any server-side module that calls the SDK.
 * Idempotent, so calling it from multiple Server Actions is safe.
 */
export const configureServerCoreverseClient = () => {
  if (configured) return;
  configured = true;

  configureCoreverseClient({
    baseUrl: process.env.NEXT_PUBLIC_COREVERSE_API_URL!,
  });
};
