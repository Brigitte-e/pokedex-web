"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback } from "react";
import { TypeFilter } from "../TypeFilter";
import { PageHeader } from "@/components/PageHeader";

interface Props {
  selected: string[];
}

export function PokemonListHeader({ selected }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleTypeChange = useCallback(
    (newSelected: string[]) => {
      const qs = newSelected.length > 0 ? `types=${newSelected.join(",")}` : "";
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname],
  );

  return (
    <PageHeader
      title="Pokédex"
      rightSlot={<TypeFilter selected={selected} onChange={handleTypeChange} />}
    />
  );
}
