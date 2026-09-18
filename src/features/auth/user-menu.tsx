"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { HoverCard as HoverCardPrimitive } from "radix-ui";

import { signOut } from "./actions";
import { createClient } from "@/supabase/client";
import type { CurrentUser } from "@/hooks/use-current-user";
import { UserAvatar } from "@/components/ui/UserAvatar/user-avatar";
import { Button } from "@/components/ui/Button/button";

type UserMenuProps = {
  user: CurrentUser;
};

export const UserMenu = ({ user }: UserMenuProps) => {
  const t = useTranslations("userMenu");
  const [isPending, startTransition] = useTransition();

  const handleSignOut = () => {
    startTransition(async () => {
      const supabase = createClient();
      // Clears the browser session immediately and fires onAuthStateChange,
      // so useCurrentUser updates the UI without waiting for navigation.
      await supabase.auth.signOut();
      // Clears server-side cookies and redirects.
      await signOut();
    });
  };

  return (
    <HoverCardPrimitive.Root openDelay={100} closeDelay={150}>
      <HoverCardPrimitive.Trigger asChild>
        <button
          type="button"
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          aria-label={t("userMenu")}
        >
          <UserAvatar avatarUrl={user.avatarUrl} username={user.username} size={40} className="border border-border/70" />
        </button>
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side="bottom"
          align="end"
          sideOffset={10}
          className="z-50 w-64 rounded-2xl border border-border/80 bg-popover/95 p-4 shadow-xl shadow-blue-950/10 backdrop-blur-xl dark:shadow-blue-950/30"
        >
          <div className="flex items-center gap-3">
            <UserAvatar avatarUrl={user.avatarUrl} username={user.username} size={44} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1.5 border-t border-border/70 pt-3">
            <Button type="button" variant="ghost" disabled className="h-9 w-full justify-start rounded-xl px-3 text-sm opacity-60">
              {t("settings")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={isPending}
              onClick={handleSignOut}
              className="h-9 w-full justify-start rounded-xl px-3 text-sm text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              {isPending ? t("loggingOut") : t("logOut")}
            </Button>
          </div>

          <HoverCardPrimitive.Arrow className="fill-popover" />
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
};
