import { FavoritesList } from "./features/FavoritesList";
import { PageHeader } from "@/components/PageHeader";
import { t } from "@/lib/i18n";

export default function FavoritesPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader title={t("pages.favorites.title")} />
      <FavoritesList />
    </main>
  );
}
