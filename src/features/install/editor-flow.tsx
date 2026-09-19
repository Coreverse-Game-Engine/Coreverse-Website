"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button/button";
import { StepIndicatorList, type StepIndicatorItem } from "./step-indicator-list";
import { OsOptionGrid } from "./os-option-grid";
import { GraphicsApiBadge } from "./graphics-api-badge";
import { operatingSystems, graphicsApisByOs, graphicsApiOptions, type OperatingSystem, type GraphicsApi } from "./install-types";

const stepKeys = ["os", "graphics", "download"] as const;

export const EditorFlow = () => {
  const t = useTranslations("installPanel");
  const tEditor = useTranslations("installPanel.editor");
  const [selectedOs, setSelectedOs] = useState<OperatingSystem | null>(null);
  const [selectedGraphicsApi, setSelectedGraphicsApi] = useState<GraphicsApi | null>(null);

  const selectedOsOption = operatingSystems.find((option) => option.value === selectedOs);
  const availableGraphicsApis = selectedOs !== null ? graphicsApisByOs[selectedOs] : [];
  const selectedGraphicsApiOption = selectedGraphicsApi !== null ? graphicsApiOptions[selectedGraphicsApi] : undefined;
  const currentStep = selectedOs === null ? "os" : selectedGraphicsApi === null ? "graphics" : "download";

  const downloadFileName = useMemo(() => {
    if (selectedOs === null || selectedGraphicsApi === null) {
      return "";
    }

    return `coreverse-engine-${selectedOs}-${selectedGraphicsApi}.txt`;
  }, [selectedGraphicsApi, selectedOs]);

  const handleDownload = () => {
    if (selectedOs === null || selectedGraphicsApi === null) {
      return;
    }

    const fileContent = [
      "Coreverse Editor installer placeholder",
      `Operating system: ${selectedOs}`,
      `Graphics API: ${selectedGraphicsApi}`,
      "Real installer binaries will replace this text file later.",
    ].join("\n");
    const file = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const fileUrl = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = fileUrl;
    link.download = downloadFileName;
    link.click();
    URL.revokeObjectURL(fileUrl);
  };

  const handleOsSelect = (os: OperatingSystem) => {
    setSelectedOs(os);
    // A previous pick may not be valid for the newly-selected OS (e.g.
    // switching from Windows/DX12 to macOS) -- clear it so the graphics
    // step always starts fresh for the new platform.
    setSelectedGraphicsApi(null);
  };

  const handleBack = () => {
    if (selectedGraphicsApi !== null) {
      setSelectedGraphicsApi(null);
      return;
    }

    setSelectedOs(null);
  };

  const steps: StepIndicatorItem[] = stepKeys.map((stepKey) => ({
    key: stepKey,
    title: tEditor(`steps.${stepKey}.title`),
    description: tEditor(`steps.${stepKey}.description`),
    isActive: currentStep === stepKey,
    isDone:
      (stepKey === "os" && selectedOs !== null) ||
      (stepKey === "graphics" && selectedGraphicsApi !== null) ||
      (stepKey === "download" && currentStep === "download"),
  }));

  return (
    <div className="grid gap-8 rounded-[1.5rem] border border-border/70 bg-background/80 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <StepIndicatorList steps={steps} />
      </div>

      <div className="rounded-[1.25rem] border border-border/70 bg-card/80 p-4 sm:p-5">
        {currentStep === "os" ? (
          <div>
            <h3 className="text-xl font-semibold text-foreground">{tEditor("osTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tEditor("osDescription")}</p>
            <OsOptionGrid onSelect={handleOsSelect} />
          </div>
        ) : null}

        {currentStep === "graphics" ? (
          <div>
            <h3 className="text-xl font-semibold text-foreground">{tEditor("graphicsTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tEditor("graphicsDescription")}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {availableGraphicsApis.map((api) => {
                const option = graphicsApiOptions[api];

                return (
                  <button
                    key={option.value}
                    type="button"
                    className="group rounded-3xl border border-border/70 bg-background/70 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/10"
                    onClick={() => setSelectedGraphicsApi(option.value)}
                  >
                    <span className="flex size-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                      <GraphicsApiBadge option={option} />
                    </span>
                    <span className="mt-4 block text-base font-semibold text-foreground">{t(`options.${option.labelKey}`)}</span>
                  </button>
                );
              })}
            </div>
            <Button type="button" variant="ghost" className="mt-5 rounded-full px-4" onClick={handleBack}>
              {t("back")}
            </Button>
          </div>
        ) : null}

        {currentStep === "download" && selectedOsOption !== undefined && selectedGraphicsApiOption !== undefined ? (
          <div>
            <h3 className="text-xl font-semibold text-foreground">{tEditor("downloadTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tEditor("downloadDescription")}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
                <span className="flex size-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <Image src={selectedOsOption.image} alt="" width={38} height={38} />
                </span>
                <p className="mt-4 text-sm text-muted-foreground">{t("selectedOs")}</p>
                <p className="text-base font-semibold text-foreground">{t(`options.${selectedOsOption.labelKey}`)}</p>
              </div>
              <div className="rounded-3xl border border-border/70 bg-background/70 p-5">
                <span className="flex size-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                  <GraphicsApiBadge option={selectedGraphicsApiOption} size={40} />
                </span>
                <p className="mt-4 text-sm text-muted-foreground">{t("selectedGraphics")}</p>
                <p className="text-base font-semibold text-foreground">{t(`options.${selectedGraphicsApiOption.labelKey}`)}</p>
              </div>
            </div>
            <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-700 dark:text-blue-200">
              {downloadFileName}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                size="lg"
                className="h-12 rounded-full bg-blue-600 px-6 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500"
                onClick={handleDownload}
              >
                {t("downloadAction")}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-blue-500/25 bg-background/60 px-6 hover:bg-blue-500/10"
                onClick={handleBack}
              >
                {t("back")}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
