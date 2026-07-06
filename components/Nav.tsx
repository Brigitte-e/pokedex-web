"use client";

import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { AuthButton } from "@/components/AuthButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth";
import { useTranslation } from "@/hooks/useTranslation";

const Nav = () => {
  const { t, locale } = useTranslation();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const navLinks = [
    { href: `/${locale}/pokemon`, label: t("nav.pokemon") },
    { href: `/${locale}/types`, label: t("nav.types") },
    { href: `/${locale}/moves`, label: t("nav.moves") },
    { href: `/${locale}/items`, label: t("nav.items") },
    { href: `/${locale}/pokemon-of-the-day`, label: t("nav.pokemonOfTheDay") },
    {
      href: user ? `/${locale}/favorites` : `/${locale}/login`,
      activePath: `/${locale}/favorites`,
      label: t("nav.favorites"),
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-pk-darker/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <Link
          href={`/${locale}/pokemon`}
          className="flex items-center gap-2 text-xl font-bold text-pk-yellow shrink-0"
        >
          <span className="text-2xl" aria-hidden="true">⚡</span>
          {t("nav.logo")}
        </Link>

        <nav aria-label={t("nav.ariaLabel")} className="flex items-center gap-1 overflow-x-auto flex-1">
          {navLinks.map(({ href, activePath, label }) => {
            const matchPath = activePath ?? href;
            const active = pathname === matchPath || pathname.startsWith(matchPath + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-pk-red text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <Suspense fallback={<Skeleton className="h-7 w-14 shrink-0 rounded-md" />}>
          <LanguageSwitcher />
        </Suspense>

        <AuthButton />
      </div>
    </header>
  );
};

export { Nav };
