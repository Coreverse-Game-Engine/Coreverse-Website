import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";

const NEW_USER_WINDOW_MS = 5000;
const NEEDS_PASSWORD_COOKIE = "coreverse-needs-password";

type PendingCookie = { name: string; value: string; options: CookieOptions };

const deriveUsername = (metadata: Record<string, unknown>, email: string): string => {
  const candidates = [metadata.username, metadata.user_name, metadata.preferred_username, metadata.full_name, metadata.name];
  const found = candidates.find((value): value is string => typeof value === "string" && value.length > 0);
  return found ?? email.split("@")[0] ?? "user";
};

const isBrandNewUser = (user: User): boolean => {
  if (!user.last_sign_in_at) return true;
  const createdAt = new Date(user.created_at).getTime();
  const lastSignInAt = new Date(user.last_sign_in_at).getTime();
  return Math.abs(lastSignInAt - createdAt) < NEW_USER_WINDOW_MS;
};

const extractLocale = (next: string): string => next.split("/").filter(Boolean)[0] ?? "en";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const baseUrl = process.env.NEXT_APP_URL;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=oauth`);
  }

  // Session cookie'lerini burada topluyoruz; sonra hangi response'u
  // döneceğimize karar verince (ana sayfa mı, set-password mi) o
  // response'un üzerine yazacağız. next/headers() cookieStore'una yazıp
  // ayrı bir NextResponse döndürmek, cookie'lerin tarayıcıya hiç
  // gitmemesine yol açıyordu.
  const pendingCookies: PendingCookie[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            pendingCookies.push({ name, value, options });
          });
        },
      },
    },
  );

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth callback] exchangeCodeForSession error:", error.message);
    return NextResponse.redirect(`${baseUrl}/login?error=oauth`);
  }

  const applyCookies = (response: NextResponse): NextResponse => {
    pendingCookies.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  };

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (user) {
    if (!user.user_metadata.username) {
      const username = deriveUsername(user.user_metadata, user.email ?? "");
      await supabase.auth.updateUser({ data: { username } });
    }

    if (isBrandNewUser(user)) {
      // No service-role password assignment here anymore -- the user is
      // already in a verified session from exchangeCodeForSession above,
      // and that's all setInitialPassword needs to call
      // supabase.auth.updateUser({ password }) on the /set-password page.
      const locale = extractLocale(next);
      const setPasswordUrl = new URL(`${baseUrl}/${locale}/set-password`);
      setPasswordUrl.searchParams.set("next", next);

      const response = applyCookies(NextResponse.redirect(setPasswordUrl));
      response.cookies.set(NEEDS_PASSWORD_COOKIE, "1", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 30,
      });

      return response;
    }
  }

  return applyCookies(NextResponse.redirect(`${baseUrl}${next}`));
};
