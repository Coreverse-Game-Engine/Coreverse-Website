import type { ReactNode } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10" />
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <Image src="/images/coreverse-emblem.svg" alt="Coreverse Engine" width={36} height={36} />
          <span className="text-lg font-semibold tracking-[-0.03em] text-foreground">Coreverse Engine</span>
        </Link>

        <div className="relative overflow-hidden rounded-[2rem] border border-border/80 bg-card/70 p-5 shadow-2xl shadow-blue-950/10 backdrop-blur-xl dark:shadow-blue-950/30">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="rounded-[1.5rem] border border-border/70 bg-background/80 p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
