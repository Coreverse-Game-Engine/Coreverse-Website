import Image from "next/image";
import { useTranslations } from "next-intl";
import { operatingSystems, type OperatingSystem } from "./install-types";

type OsOptionGridProps = {
  onSelect: (os: OperatingSystem) => void;
};

export const OsOptionGrid = ({ onSelect }: OsOptionGridProps) => {
  const t = useTranslations("installPanel");

  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {operatingSystems.map((option) => (
        <button
          key={option.value}
          type="button"
          className="group rounded-3xl border border-border/70 bg-background/70 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/10"
          onClick={() => onSelect(option.value)}
        >
          <span className="flex size-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <Image src={option.image} alt="" width={42} height={42} />
          </span>
          <span className="mt-4 block text-base font-semibold text-foreground">{t(`options.${option.labelKey}`)}</span>
        </button>
      ))}
    </div>
  );
};
