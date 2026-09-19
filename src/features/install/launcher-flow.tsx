"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button/button";
import { StepIndicatorList, type StepIndicatorItem } from "./step-indicator-list";
import { OsOptionGrid } from "./os-option-grid";
import { operatingSystems, type OperatingSystem } from "./install-types";

const stepKeys = ["os", "download"] as const;

export const LauncherFlow = () => {
  const t = useTranslations("installPanel");
  const tLauncher = useTranslations("installPanel.launcher");
  const [selectedOs, setSelectedOs] = useState<OperatingSystem | null>(null);

  const selectedOsOption = operatingSystems.find((option) => option.value === selectedOs);
  const currentStep = selectedOs === null ? "os" : "download";

  const downloadFileName = useMemo(() => {
    if (selectedOs === null) {
      return "";
    }

    return `coreverse-launcher-${selectedOs}.txt`;
  }, [selectedOs]);

  const handleDownload = () => {
    if (selectedOs === null) {
      return;
    }

    const fileContent = [
      "Coreverse Launcher installer placeholder",
      `Operating system: ${selectedOs}`,
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

  const handleBack = () => setSelectedOs(null);

  const steps: StepIndicatorItem[] = stepKeys.map((stepKey) => ({
    key: stepKey,
    title: tLauncher(`steps.${stepKey}.title`),
    description: tLauncher(`steps.${stepKey}.description`),
    isActive: currentStep === stepKey,
    isDone: stepKey === "os" ? selectedOs !== null : currentStep === "download",
  }));

  return (
    <div className="grid gap-8 rounded-[1.5rem] border border-border/70 bg-background/80 p-6 sm:p-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <StepIndicatorList steps={steps} />
      </div>

      <div className="rounded-[1.25rem] border border-border/70 bg-card/80 p-4 sm:p-5">
        {currentStep === "os" ? (
          <div>
            <h3 className="text-xl font-semibold text-foreground">{tLauncher("osTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tLauncher("osDescription")}</p>
            <OsOptionGrid onSelect={setSelectedOs} />
          </div>
        ) : null}

        {currentStep === "download" && selectedOsOption !== undefined ? (
          <div>
            <h3 className="text-xl font-semibold text-foreground">{tLauncher("downloadTitle")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{tLauncher("downloadDescription")}</p>
            <div className="mt-5 rounded-3xl border border-border/70 bg-background/70 p-5">
              <span className="flex size-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
                <Image src={selectedOsOption.image} alt="" width={38} height={38} />
              </span>
              <p className="mt-4 text-sm text-muted-foreground">{t("selectedOs")}</p>
              <p className="text-base font-semibold text-foreground">{t(`options.${selectedOsOption.labelKey}`)}</p>
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
