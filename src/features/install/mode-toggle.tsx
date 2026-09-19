"use client";

import { useRef, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { DownloadMode } from "./install-types";

type ModeToggleProps = {
  mode: DownloadMode;
  onChange: (mode: DownloadMode) => void;
};

const modes: readonly DownloadMode[] = ["launcher", "editor"];

// Each mode gets its own accent so the toggle visibly "changes color" as
// the person switches -- Launcher keeps the site's existing blue accent,
// Editor gets a distinct violet accent.
const activeModeClasses: Record<DownloadMode, string> = {
  launcher: "bg-blue-600 text-white shadow-lg shadow-blue-600/25",
  editor: "bg-violet-600 text-white shadow-lg shadow-violet-600/25",
};

export const ModeToggle = ({ mode, onChange }: ModeToggleProps) => {
  const t = useTranslations("installPanel.modeToggle");
  const tabRefs = useRef<Record<DownloadMode, HTMLButtonElement | null>>({ launcher: null, editor: null });

  const focusAndSelect = (next: DownloadMode) => {
    onChange(next);
    tabRefs.current[next]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = modes.indexOf(mode);

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusAndSelect(modes[(currentIndex + 1) % modes.length]);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusAndSelect(modes[(currentIndex - 1 + modes.length) % modes.length]);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAndSelect(modes[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAndSelect(modes[modes.length - 1]);
    }
  };

  return (
    <div
      role="tablist"
      aria-label={t("label")}
      className="inline-flex gap-1 rounded-full border border-border/70 bg-card/70 p-1"
    >
      {modes.map((candidate) => {
        const isActive = candidate === mode;

        return (
          <button
            key={candidate}
            ref={(el) => {
              tabRefs.current[candidate] = el;
            }}
            role="tab"
            type="button"
            id={`install-mode-tab-${candidate}`}
            aria-selected={isActive}
            aria-controls={`install-mode-panel-${candidate}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(candidate)}
            onKeyDown={handleKeyDown}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
              isActive ? activeModeClasses[candidate] : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(candidate)}
          </button>
        );
      })}
    </div>
  );
};
