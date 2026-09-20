import { getTranslations } from "next-intl/server";

import { SetPasswordForm } from "@/features/auth/set-password-form";
import { sanitizeInternalPath } from "@/lib/safe-redirect";

type SetPasswordPageProps = {
  searchParams: Promise<{ next?: string }>;
};

const SetPasswordPage = async ({ searchParams }: SetPasswordPageProps) => {
  const t = await getTranslations("auth.setPassword");
  const { next } = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>
      <SetPasswordForm next={sanitizeInternalPath(next, "/")} />
    </div>
  );
};

export default SetPasswordPage;
