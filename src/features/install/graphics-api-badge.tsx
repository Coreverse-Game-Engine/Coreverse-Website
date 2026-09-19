import Image from "next/image";
import { graphicsApiBadgeGlyph, type GraphicsApiOption } from "./install-types";

type GraphicsApiBadgeProps = {
  option: GraphicsApiOption;
  size?: number;
};

export const GraphicsApiBadge = ({ option, size = 46 }: GraphicsApiBadgeProps) => {
  if (option.kind === "image") {
    return <Image src={option.image} alt="" width={size} height={size} />;
  }

  return (
    <span
      aria-hidden
      className="select-none text-[11px] font-bold tracking-wide text-blue-700 dark:text-blue-300"
      style={{ fontSize: Math.max(10, size / 4) }}
    >
      {graphicsApiBadgeGlyph[option.value]}
    </span>
  );
};
