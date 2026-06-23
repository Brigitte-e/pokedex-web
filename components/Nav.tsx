"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

const LINKS = [
  { href: "/pokemon", labelKey: "nav.pokemon" },
  { href: "/types", labelKey: "nav.types" },
  { href: "/moves", labelKey: "nav.moves" },
  { href: "/items", labelKey: "nav.items" },
  { href: "/team-builder", labelKey: "nav.teamBuilder" },
  { href: "/favorites", labelKey: "nav.favorites" },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-pk-darker/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
        <Link
          href="/pokemon"
          className="flex items-center gap-2 text-xl font-bold text-pk-yellow shrink-0"
        >
          <span className="text-2xl">⚡</span>
          {t("nav.logo")}
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {LINKS.map(({ href, labelKey }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-pk-red text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
