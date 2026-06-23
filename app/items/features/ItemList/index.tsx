import { fetchItemList } from "@/app/api/items";
import { ItemListClient } from "./ItemListClient";
import { PAGE_SIZE, type ItemListInitialData } from "../../hooks/useItemListQuery";

export async function ItemList() {
  const data = await fetchItemList(0, PAGE_SIZE);

  const initialData: ItemListInitialData = {
    pages: [data],
    pageParams: [1],
  };

  return <ItemListClient initialData={initialData} />;
}
