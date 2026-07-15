"use client";

import { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { capitalize } from "@/lib/pokeapi";
import { getLocalizedName } from "@/lib/locale";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchMove } from "@/lib/api/moves";
import type { Locale } from "@/lib/i18n";

interface Props {
  name: string;
  locale: Locale;
  onSelect: (name: string) => void;
}

const MoveBadgeButton = ({ name, locale, onSelect }: Props) => {
  const { data } = useSuspenseQuery({
    queryKey: ["move", name],
    queryFn: () => fetchMove(name),
    staleTime: Infinity,
  });

  const label = getLocalizedName(data.names, locale, capitalize(name));

  return (
    <button
      onClick={() => onSelect(name)}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full"
    >
      <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">
        {label}
      </Badge>
    </button>
  );
};

// Each badge gets its own Suspense boundary (shares the "move" query cache
// with MoveModal) so a pokemon with 100+ moves keeps rendering the rest of
// the list while individual move names are still loading.
const MoveBadge = (props: Props) => (
  <Suspense fallback={<Skeleton className="h-6 rounded-full" style={{ width: `${(props.name?.length ?? 5)*10}px` }} />}>
    <MoveBadgeButton {...props} />
  </Suspense>
);

export { MoveBadge };
