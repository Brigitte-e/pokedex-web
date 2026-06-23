import { FavoritesList } from "./features/FavoritesList";
import { PageHeader } from "@/components/PageHeader";

export default function FavoritesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader title="Favorites" />
      <FavoritesList />
    </main>
  );
}
