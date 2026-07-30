"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { createClient } from "@/supabase/server";
import { createAdminClient } from "@/supabase/admin";
import { sendWelcomeEmail, sendPasswordResetEmail } from "@/services/brevo";
import { uploadAvatar } from "@/services/avatar-storage";
import {
  createLoginSchema,
  createRegisterSchema,
  createForgotPasswordSchema,
  createResetPasswordSchema,
} from "./validation";
import type { AuthActionState, OAuthProvider } from "./types";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024;
const RESET_COOLDOWN_SECONDS= 60;

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

  const avatarFile = formData.get("avatar");
  const hasAvatar = avatarFile instanceof File && avatarFile.size > 0;

  if (hasAvatar && avatarFile instanceof File) {
    const isValidType = avatarFile.type.startsWith("image/");
    const isValidSize = avatarFile.size <= MAX_AVATAR_SIZE_BYTES;

    if (!isValidType || !isValidSize) {
      return { status: "error", fieldErrors: { avatar: [t("errors.avatarInvalid")] } };
    }
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

  if (data.user && hasAvatar && avatarFile instanceof File) {
    try {
      await uploadAvatar(data.user.id, avatarFile);
    } catch {
      // Registration should not fail due to a non-critical avatar upload error.
    }
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

  const admin = createAdminClient();

  const { data: throttleRow } = await admin
    .from("password_reset_throttle")
    .select("last_requested_at")
    .eq("email", parsed.data.email)
    .maybeSingle();

  const isThrottled =
    throttleRow !== null &&
    Date.now() - new Date(throttleRow.last_requested_at).getTime() < RESET_COOLDOWN_SECONDS * 1000;

  if (!isThrottled) {
    await admin
      .from("password_reset_throttle")
      .upsert({ email: parsed.data.email, last_requested_at: new Date().toISOString() });

    const { data, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email: parsed.data.email,
      options: {
        redirectTo: `${process.env.NEXT_APP_URL}/${locale}/reset-password`,
      },
    });

    if (error) {
      console.error("[requestPasswordReset] generateLink error:", error.message);
    } else if (data.properties?.action_link) {
      await sendPasswordResetEmail({
        email: parsed.data.email,
        subject: t("resetEmail.subject"),
        bodyHtml: `<p>${t("resetEmail.body")}</p><p><a href="${data.properties.action_link}">${t("resetEmail.cta")}</a></p>`,
      });
    }
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
  const schema = createResetPasswordSchema(t); // reset ve set-password aynı kurallara tabi

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

  const next = (formData.get("next") as string | null) ?? `/${locale}`;
  redirect(next);
};
