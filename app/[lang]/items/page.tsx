import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { parsePageParam } from "@/components/pagination/pagination";
import { getDictionary, t } from "@/lib/i18n";
import { ITEM_LIST_PAGE_SIZE } from "@/lib/constants";
import type { Locale } from "@/lib/constants";
import { fetchItemList } from "@/lib/api/items";
import { ItemList } from "./features/item-list";

export default async function ItemsPage({
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
  const offset = (initialPage - 1) * ITEM_LIST_PAGE_SIZE;
  const list = await fetchItemList(offset, ITEM_LIST_PAGE_SIZE);

  const itemModalLabels = {
    cost: t(dict, "itemModal.cost"),
    category: t(dict, "itemModal.category"),
    noDescription: t(dict, "common.noDescription"),
    errorDefault: t(dict, "common.errorDefault"),
    empty: t(dict, "common.empty"),
    close: t(dict, "common.close"),
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
        title={t(dict, "pages.items.title")}
        subtitle={t(dict, "pages.items.subtitle", { count: list.count })}
      />
      <ItemList
        list={list}
        initialPage={initialPage}
        itemModalLabels={itemModalLabels}
        listLabels={listLabels}
        locale={lang as Locale}
      />
    </PageContainer>
  );
}
