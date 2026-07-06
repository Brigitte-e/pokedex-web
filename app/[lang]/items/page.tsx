import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { parsePageParam } from "@/components/pagination/pagination";
import { ITEM_LIST_PAGE_SIZE } from "@/lib/constants";
import { fetchItemList } from "@/lib/api/items";
import { ItemList } from "./features/item-list";

export default async function ItemsPage({
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const initialPage = parsePageParam(page);
  const offset = (initialPage - 1) * ITEM_LIST_PAGE_SIZE;
  const list = await fetchItemList(offset, ITEM_LIST_PAGE_SIZE);

  return (
    <PageContainer>
      <PageHeader
        titleKey="pages.items.title"
        subtitleKey="pages.items.subtitle"
        subtitleParams={{ count: list.count }}
      />
      <ItemList
        list={list}
        initialPage={initialPage}
      />
    </PageContainer>
  );
}
