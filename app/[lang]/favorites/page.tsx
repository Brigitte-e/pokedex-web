import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { FavoritesList } from "./features/favorites-list";

export default function FavoritesPage() {
  return (
    <PageContainer>
      <PageHeader titleKey="pages.favorites.title" />
      <FavoritesList />
    </PageContainer>
  );
}
