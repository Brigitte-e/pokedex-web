"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useTranslation } from "@/hooks/useTranslation";

const AuthButton = () => {
  const { t, locale } = useTranslation();
  const profileLabel = t("nav.profile");
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }

  if (user) {
    const initials = user.displayName
      ? user.displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : user.email?.[0].toUpperCase() ?? "?";

    return (
      <Link
        href={`/${locale}/profile`}
        aria-label={profileLabel}
        title={user.displayName ?? user.email ?? profileLabel}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pk-red text-xs font-bold text-white hover:opacity-90 transition-opacity overflow-hidden"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.photoURL}
            alt={user.displayName ?? "User avatar"}
            className="h-full w-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          initials
        )}
      </Link>
    );
  }

  return (
    <Link
      href={`/${locale}/login`}
      className="rounded-lg px-3 py-1.5 text-sm font-bold whitespace-nowrap transition-colors bg-pk-red text-white hover:opacity-90"
    >
      {t("nav.login")}
    </Link>
  );
};

export { AuthButton };
