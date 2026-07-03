import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { FavoritesList } from "./features/favorites-list";
import { getDictionary, t } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function FavoritesPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang as Locale);

  const favLabels = {
    loading: t(dict, "common.loading"),
    empty: t(dict, "favorites.empty"),
    savedCountPattern: dict.favorites.savedCount,
    removeLabel: t(dict, "favorites.remove"),
    clearAll: t(dict, "favorites.clearAll"),
    confirmRemove: t(dict, "favorites.confirmRemove"),
    confirmRemoveCancel: t(dict, "favorites.confirmRemoveCancel"),
    confirmRemoveConfirm: t(dict, "favorites.confirmRemoveConfirm"),
    confirmClearAll: t(dict, "favorites.confirmClearAll"),
    confirmClearAllConfirm: t(dict, "favorites.confirmClearAllConfirm"),
  };

  return (
    <PageContainer>
      <PageHeader title={t(dict, "pages.favorites.title")} />
      <FavoritesList labels={favLabels} locale={lang as Locale} />
    </PageContainer>
  );
}
