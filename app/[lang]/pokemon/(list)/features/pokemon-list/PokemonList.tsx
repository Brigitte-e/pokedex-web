"use client";

import { Pagination } from "@/components/pagination";
import { POKEMON_LIST_PAGE_SIZE } from "@/lib/constants";
import { usePokemonListQuery } from "@/app/[lang]/pokemon/(list)/hooks/usePokemonListQuery";
import { useLocalizedPokemonNames } from "@/hooks/useLocalizedPokemonNames";
import { useTranslation } from "@/hooks/useTranslation";
import type { ListResponse } from "@/types";
import { PokemonListItem } from "./PokemonListItem";
import { usePagination } from "@/hooks/usePagination";
import Link from "next/link";

interface Props {
  initialData?: ListResponse;
  initialPage: number;
}

const PokemonList = ({ initialData, initialPage }: Props) => {
  const { locale, t } = useTranslation();

  const {
    page,
    effectivePage,
    totalPages,
    goToPrevious,
    goToNext,
    setPage,
  } = usePagination({
    pageSize: POKEMON_LIST_PAGE_SIZE,
    initialCount: initialData?.count,
  });

  const { data } = usePokemonListQuery(page, page === initialPage ? initialData : undefined);

  const pokemonNames = useLocalizedPokemonNames(
    data.results.map((item) => item.name),
    locale,
  );

  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
        {t("pokemonList.all")}
      </h3>

      {!data.results.length ? (
        <p className="text-sm text-muted-foreground">{t("pokemonList.noMatch")}</p>
      ) : (
        <div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {data.results.map((item, index) => {
              const backHref = `/${locale}/pokemon?page=${effectivePage}`;
              const href = `/${locale}/pokemon/${item.name}?backHref=${encodeURIComponent(backHref)}`;

              return (
                <li key={item.name}>
                  <Link href={href}>
                    <PokemonListItem
                      item={item}
                      displayName={pokemonNames.get(item.name)}
                      fetchPriority={index === 0 && effectivePage === 1 ? "high" : undefined}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 flex justify-center">
            <Pagination
              page={effectivePage}
              totalPages={totalPages}
              hasPrevious={!!data.previous}
              hasNext={!!data.next}
              onPrevious={goToPrevious}
              onNext={goToNext}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export { PokemonList };
