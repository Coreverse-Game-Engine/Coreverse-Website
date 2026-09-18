"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import { signUp } from "./actions";
import type { AuthActionState } from "./types";
import { Input } from "@/components/ui/Input/input";
import { Label } from "@/components/ui/Label/label";
import { Checkbox } from "@/components/ui/Checkbox/checkbox";
import { Button } from "@/components/ui/Button/button";
import { Link } from "@/i18n/navigation";

const initialState: AuthActionState = { status: "idle" };

const SubmitButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations("auth.register");

  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className="h-11 w-full rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
    >
      {pending ? t("submitting") : t("submit")}
    </Button>
  );
};

export const RegisterForm = () => {
  const t = useTranslations("auth.register");
  const [state, formAction] = useActionState(signUp, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-700 dark:text-blue-200">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username">{t("usernameLabel")}</Label>
        <Input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          placeholder={t("usernamePlaceholder")}
          aria-invalid={Boolean(state.fieldErrors?.username)}
        />
        {state.fieldErrors?.username ? <p className="text-xs text-destructive">{state.fieldErrors.username[0]}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={t("emailPlaceholder")}
          aria-invalid={Boolean(state.fieldErrors?.email)}
        />
        {state.fieldErrors?.email ? <p className="text-xs text-destructive">{state.fieldErrors.email[0]}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">{t("passwordLabel")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder={t("passwordPlaceholder")}
          aria-invalid={Boolean(state.fieldErrors?.password)}
        />
        {state.fieldErrors?.password ? <p className="text-xs text-destructive">{state.fieldErrors.password[0]}</p> : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">{t("confirmPasswordLabel")}</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder={t("confirmPasswordPlaceholder")}
          aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
        />
        {state.fieldErrors?.confirmPassword ? (
          <p className="text-xs text-destructive">{state.fieldErrors.confirmPassword[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-start gap-2">
          <Checkbox id="acceptTerms" name="acceptTerms" className="mt-0.5" />
          <Label htmlFor="acceptTerms" className="font-normal text-muted-foreground">
            {t.rich("acceptTerms", {
              terms: (chunks) => (
                <Link href="/terms" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                  {chunks}
                </Link>
              ),
            })}
          </Label>
        </div>
        {state.fieldErrors?.acceptTerms ? <p className="text-xs text-destructive">{state.fieldErrors.acceptTerms[0]}</p> : null}
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  );
};
