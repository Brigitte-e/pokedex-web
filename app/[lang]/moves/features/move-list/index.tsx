import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { fetchMove } from "@/lib/api/moves";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { MoveListClient } from "./MoveListClient";
import type { MoveModalLabels } from "@/components/MoveModal";
import type { ListResponse } from "@/types";
import type { Locale } from "@/lib/constants";

interface ListLabels {
  previous: string;
  next: string;
  pageOfTotalPattern: string;
  pagination: string;
  loading: string;
  errorDefault: string;
}

interface Props {
  list: ListResponse;
  initialPage: number;
  moveModalLabels: MoveModalLabels;
  listLabels: ListLabels;
  locale?: Locale;
}

export async function MoveList({ list, initialPage, moveModalLabels, listLabels, locale = DEFAULT_LOCALE }: Props) {
  const queryClient = new QueryClient();
  queryClient.setQueryData(["move-list", initialPage], list);

  // Move details are only needed up front for localized display names; for the
  // default locale the capitalized slug suffices and the modal fetches on demand.
  if (locale !== DEFAULT_LOCALE) {
    await Promise.all(
      list.results.map((m) =>
        fetchMove(m.name)
          .then((move) => queryClient.setQueryData(["move", m.name], move))
          .catch(() => null)
      )
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MoveListClient moveModalLabels={moveModalLabels} listLabels={listLabels} locale={locale} />
    </HydrationBoundary>
  );
}
