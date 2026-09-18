"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button/button";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { useScrollContext, type SectionId } from "@/context/scroll-context";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserMenu } from "@/features/auth/user-menu";
import { useIsPortrait } from "@/hooks/use-is-portrait";

type Theme = "light" | "dark";

const themeChangeEvent = "coreverse-theme-change";

const navigationItems: { key: string; id: SectionId }[] = [
  { key: "main", id: "main" },
  { key: "install", id: "install" },
  { key: "features", id: "features" },
  { key: "community", id: "community" },
  { key: "faq", id: "faq" },
];

const languageOptions = [
  { locale: "en", flag: "🇺🇸", labelKey: "english" },
  { locale: "tr", flag: "🇹🇷", labelKey: "turkish" },
  { locale: "fr", flag: "🇫🇷", labelKey: "french" },
  { locale: "de", flag: "🇩🇪", labelKey: "german"},
  { locale: "es", flag: "🇪🇸", labelKey: "spanish" },
  { locale: "pt", flag: "🇵🇹", labelKey: "portuguese" },
  { locale: "cn", flag: "🇨🇳", labelKey: "chinese" },
  { locale: "ru", flag: "🇷🇺", labelKey: "russian" },
  { locale: "jp", flag: "🇯🇵", labelKey: "japanese" },
  { locale: "kr", flag: "🇰🇷", labelKey: "korean" },
  { locale: "pl", flag: "🇵🇱", labelKey: "polish" },
  { locale: "in", flag: "🇮🇳", labelKey: "indian" },
  { locale: "sa", flag: "🇸🇦", labelKey: "arabic" },
] as const;

const getPreferredTheme = (): Theme => {
  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getServerTheme = (): Theme => "dark";

const subscribeTheme = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(themeChangeEvent, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(themeChangeEvent, callback);
  };
};

const applyTheme = (theme: Theme) => {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem("theme", theme);
};

const SunIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-none stroke-current stroke-2">
    <path d="M21 14.4A7.7 7.7 0 0 1 9.6 3 8.7 8.7 0 1 0 21 14.4Z" />
  </svg>
);

export const TopBar = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isPortrait = useIsPortrait();
  const theme = useSyncExternalStore(subscribeTheme, getPreferredTheme, getServerTheme);

  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const brand = useTranslations("brand");
  const navigation = useTranslations("navigation");
  const themeTranslations = useTranslations("theme");
  const language = useTranslations("language");
  const authTopBar = useTranslations("auth.topBar");

  const { navigate, activeSection } = useScrollContext();
  const { user, isLoading: isUserLoading } = useCurrentUser();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const currentLanguage = languageOptions.find((option) => option.locale === locale) ?? languageOptions[0];
  const themeLabel = theme === "dark" ? themeTranslations("light") : themeTranslations("dark");

  const handleThemeToggle = () => {
    applyTheme(theme === "dark" ? "light" : "dark");
    window.dispatchEvent(new Event(themeChangeEvent));
  };

  const handleLanguageToggle = () => {
    setIsLanguageOpen((prev) => !prev);
  };

  const handleLanguageChange = (nextLocale: Locale) => {
    router.replace(pathname, { locale: nextLocale });
    setIsLanguageOpen(false);
  };

  const handleNavigate = (id: SectionId) => {
    navigate(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative z-50 border-b border-border/70 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center gap-4">
        <button
          type="button"
          className="flex min-w-0 items-center gap-3"
          onClick={() => navigate("main")}
        >
          <span className="flex size-11 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 shadow-lg shadow-blue-500/10">
            <Image src="/images/coreverse-emblem.svg" alt="Coreverse Engine Logo" width={34} height={34} priority />
          </span>
          <span className="hidden min-w-0 flex-col sm:flex">
            <span className="truncate text-sm font-semibold tracking-[0.22em] text-foreground uppercase">
              {brand("name")}
            </span>
            <span className="truncate text-xs text-muted-foreground">{brand("tagline")}</span>
          </span>
        </button>

        <nav aria-label="Primary navigation" className={`ml-auto items-center gap-1 ${isPortrait ? "hidden md:flex" : "flex"}`}>
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              type="button"
              variant="ghost"
              data-active={activeSection === item.id}
              className="h-10 rounded-full px-4 text-sm text-muted-foreground hover:text-foreground data-[active=true]:text-foreground"
              onClick={() => navigate(item.id)}
            >
              {navigation(item.key)}
            </Button>
          ))}
        </nav>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={themeLabel}
          className={`size-10 rounded-full border-blue-500/30 bg-background/70 text-blue-600 shadow-sm shadow-blue-500/10 hover:bg-blue-500/10 dark:text-blue-300 ${isPortrait ? "ml-auto md:ml-2" : "ml-2"}`}
          onClick={handleThemeToggle}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>

        <div className="relative">
          <Button
            type="button"
            variant="outline"
            aria-label={language("label")}
            aria-expanded={isLanguageOpen}
            className="h-10 rounded-full border-blue-500/30 bg-background/70 px-3 text-base shadow-sm shadow-blue-500/10 hover:bg-blue-500/10"
            onClick={handleLanguageToggle}
          >
            <span aria-hidden="true" className="text-lg leading-none">
              {currentLanguage.flag}
            </span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 fill-current text-muted-foreground">
              <path d="M5.25 7.5 10 12.25 14.75 7.5H5.25Z" />
            </svg>
          </Button>

          {isLanguageOpen ? (
            <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-2xl border border-border/80 bg-popover/95 p-1 shadow-xl shadow-blue-950/10 backdrop-blur-xl dark:shadow-blue-950/30">
              {languageOptions.map((option) => (
                <button
                  key={option.locale}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-blue-500/10"
                  onClick={() => handleLanguageChange(option.locale)}
                >
                  <span aria-hidden="true" className="text-lg">
                    {option.flag}
                  </span>
                  <span className="font-medium">{language(option.labelKey)}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="ml-2 flex items-center">
          {isUserLoading ? (
            <div className="size-10 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <UserMenu user={user} />
          ) : (
            <Button
              asChild
              size="lg"
              className="h-10 rounded-full bg-blue-600 px-5 text-sm text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
            >
              <Link href="/login">{navigation("login")}</Link>
            </Button>
          )}
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Toggle Menu"
          className={`md:hidden ${isPortrait ? "flex" : "hidden"} ml-1 text-muted-foreground hover:text-foreground`}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6 fill-none stroke-current stroke-2">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </Button>
      </div>

      {isPortrait && isMobileMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-border/70 bg-background/95 p-4 shadow-lg backdrop-blur-xl md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                data-active={activeSection === item.id}
                className="h-12 w-full justify-start rounded-xl px-4 text-base text-muted-foreground hover:bg-blue-500/10 hover:text-foreground data-[active=true]:bg-blue-500/10 data-[active=true]:text-foreground"
                onClick={() => handleNavigate(item.id)}
              >
                {navigation(item.key)}
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
