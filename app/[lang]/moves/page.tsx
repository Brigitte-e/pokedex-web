import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { parsePageParam } from "@/components/pagination/pagination";
import { getDictionary, t } from "@/lib/i18n";
import { MOVE_LIST_PAGE_SIZE } from "@/lib/constants";
import type { Locale } from "@/lib/constants";
import { fetchMoveList } from "@/lib/api/moves";
import { MoveList } from "./features/move-list";

export default async function MovesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);
  const { page } = await searchParams;
  const initialPage = parsePageParam(page);
  const offset = (initialPage - 1) * MOVE_LIST_PAGE_SIZE;
  const list = await fetchMoveList(offset, MOVE_LIST_PAGE_SIZE);

  const moveModalLabels = {
    power: t(dict, "moveModal.power"),
    accuracy: t(dict, "moveModal.accuracy"),
    pp: t(dict, "moveModal.pp"),
    noDescription: t(dict, "common.noDescription"),
    errorDefault: t(dict, "common.errorDefault"),
    empty: t(dict, "common.empty"),
    close: t(dict, "common.close"),
    damageClassNames: dict.damageClass,
  };

  const listLabels = {
    previous: t(dict, "common.previous"),
    next: t(dict, "common.next"),
    pageOfTotalPattern: dict.common.pageOfTotal,
    pagination: t(dict, "common.pagination"),
    loading: t(dict, "common.loading"),
    errorDefault: t(dict, "common.errorDefault"),
  };

  return (
    <PageContainer>
      <PageHeader
        title={t(dict, "pages.moves.title")}
        subtitle={t(dict, "pages.moves.subtitle", { count: list.count })}
      />
      <MoveList
        list={list}
        initialPage={initialPage}
        moveModalLabels={moveModalLabels}
        listLabels={listLabels}
        locale={lang as Locale}
      />
    </PageContainer>
  );
}
