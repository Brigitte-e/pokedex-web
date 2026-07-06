import { TypeGrid } from "./features/type-grid";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { fetchTypeList, fetchType } from "@/lib/api/types";
import type { Locale } from "@/lib/constants";

interface Props {
  params: Promise<{ lang: string }>;
}

export default async function TypesPage({ params }: Props) {
  const { lang } = await params;
  const locale = lang as Locale;
  const list = await fetchTypeList();

  const types = await Promise.all(
    list.results
      .filter((t) => t.name !== "unknown" && t.name !== "stellar")
      .map((t) => fetchType(t.name))
  );

  return (
    <PageContainer>
      <PageHeader
        titleKey="pages.types.title"
        subtitleKey="pages.types.subtitle"
      />
      <TypeGrid types={types} locale={locale} />
    </PageContainer>
  );
}
