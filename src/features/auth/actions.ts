"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { createClient } from "@/supabase/server";
import { requestPasswordReset as requestPasswordResetApi, CoreverseApiError } from "@Coreverse-Game-Engine/db-client";
import { configureServerCoreverseClient } from "@/lib/coreverse/server";
import { sendWelcomeEmail } from "@/services/brevo";
import { sanitizeInternalPath } from "@/lib/safe-redirect";
import {
  createLoginSchema,
  createRegisterSchema,
  createForgotPasswordSchema,
  createResetPasswordSchema,
} from "./validation";
import type { AuthActionState, OAuthProvider } from "./types";

export const signIn = async (_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "auth" });
  const schema = createLoginSchema(t);

  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient({ persistSession: parsed.data.rememberMe });
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { status: "error", message: t("errors.invalidCredentials") };
  }

  const cookieStore = await cookies();
  cookieStore.set("coreverse-remember-me", String(parsed.data.rememberMe), {
    path: "/",
    maxAge: parsed.data.rememberMe ? 60 * 60 * 24 * 365 : undefined,
  });

  redirect(`/${locale}`);
};

export const signUp = async (_prevState: AuthActionState, formData: FormData): Promise<AuthActionState> => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "auth" });
  const schema = createRegisterSchema(t);

  const parsed = schema.safeParse({
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    acceptTerms: formData.get("acceptTerms") === "on",
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { username: parsed.data.username },
      emailRedirectTo: `${process.env.NEXT_APP_URL}/${locale}/login`,
    },
  });

  if (error) {
    const isEmailInUse = error.code === "user_already_exists" || error.message.toLowerCase().includes("already registered");
    return { status: "error", message: isEmailInUse ? t("errors.emailInUse") : t("errors.generic") };
  }

  if (data.user) {
    await sendWelcomeEmail({
      email: parsed.data.email,
      username: parsed.data.username,
      subject: t("welcomeEmail.subject"),
      bodyHtml: `<p>${t("welcomeEmail.body", { username: parsed.data.username })}</p>`,
    });
  }

  return { status: "success", message: t("register.successMessage") };
};

export const signOut = async (): Promise<void> => {
  const locale = await getLocale();
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete("coreverse-remember-me");

  redirect(`/${locale}`);
};

export const requestPasswordReset = async (
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "auth" });
  const schema = createForgotPasswordSchema(t);

  const parsed = schema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  configureServerCoreverseClient();

  try {
    // Coreverse DB owns sending the actual Supabase Auth recovery email now
    // (and its own per-email/per-IP rate limiting) -- the Website no longer
    // talks to Supabase admin or Brevo for this. The response is identical
    // whether or not the address has an account, so this can't be used to
    // enumerate registered emails.
    await requestPasswordResetApi({
      email: parsed.data.email,
      redirectTo: `${process.env.NEXT_APP_URL}/${locale}/reset-password`,
    });
  } catch (err) {
    if (err instanceof CoreverseApiError && err.status === 429) {
      return { status: "error", message: t("errors.rateLimited") };
    }

    console.error("[requestPasswordReset] Coreverse DB error:", err);
    return { status: "error", message: t("errors.generic") };
  }

  return { status: "success", message: t("forgotPassword.successMessage") };
};

export const updatePassword = async (
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "auth" });
  const schema = createResetPasswordSchema(t);

  const parsed = schema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "error", message: t("errors.sessionExpired") };
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { status: "error", message: t("errors.generic") };
  }

  redirect(`/${locale}`);
};

export const signInWithOAuth = async (provider: OAuthProvider): Promise<void> => {
  const locale = await getLocale();
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_APP_URL}/api/auth/callback?next=/${locale}`,
    },
  });

  if (error || !data.url) {
    console.error("[signInWithOAuth] error:", error?.message);
    redirect(`/${locale}/login?error=oauth`);
  }

  redirect(data.url);
};

export const setInitialPassword = async (
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> => {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "auth" });
  // Set-password follows the same rules as password reset.
  const schema = createResetPasswordSchema(t);

  const parsed = schema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { status: "error", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect(`/${locale}/login`);
  }

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });

  if (error) {
    return { status: "error", message: t("errors.generic") };
  }

  const cookieStore = await cookies();
  cookieStore.delete("coreverse-needs-password");

  redirect(sanitizeInternalPath(formData.get("next"), `/${locale}`));
};
