"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useConfig } from "@/app/providers/ConfigContext";

export function NavItem({ route, name, onClick }: any) {
  const envConfig = useConfig();
  const pathname = usePathname();

  return (
    <h4
      onClick={onClick}
      style={{ color: envConfig.labelColor }}
      className={cn(
        "max-w-36 tracking-wide transition-colors  cursor-pointer truncate"
      )}
    >
      {`${name}`}
    </h4>
  );
}
