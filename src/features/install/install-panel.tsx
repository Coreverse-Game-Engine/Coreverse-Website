"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ModeToggle } from "./mode-toggle";
import { LauncherFlow } from "./launcher-flow";
import { EditorFlow } from "./editor-flow";
import type { DownloadMode } from "./install-types";

export const InstallPanel = () => {
  const t = useTranslations("installPanel");
  const [mode, setMode] = useState<DownloadMode>("launcher");

  return (
    <section id="install" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:py-24" aria-labelledby="install-title">
      <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/70 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl dark:shadow-blue-950/30">
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-6 sm:p-8">
          <div className="mb-5 inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-700 shadow-sm shadow-blue-500/10 dark:text-blue-300">
            {t("eyebrow")}
          </div>
          <h2 id="install-title" className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{t("description")}</p>

          <div className="mt-8">
            <ModeToggle mode={mode} onChange={setMode} />
          </div>
        </div>

        <div
          id="install-mode-panel-launcher"
          role="tabpanel"
          aria-labelledby="install-mode-tab-launcher"
          hidden={mode !== "launcher"}
          className="mt-6"
        >
          <LauncherFlow />
        </div>

        <div
          id="install-mode-panel-editor"
          role="tabpanel"
          aria-labelledby="install-mode-tab-editor"
          hidden={mode !== "editor"}
          className="mt-6"
        >
          <EditorFlow />
        </div>
      </div>
    </section>
  );
};
