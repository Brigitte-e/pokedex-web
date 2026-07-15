import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { PokemonDetailFeature } from "./features/pokemon-detail";
import type { Locale } from "@/lib/i18n";
import { parsePageParam } from "@/lib/utils/parsePageParam";

interface Props {
  params: Promise<{ lang: string; name: string }>;
  searchParams: Promise<RawSearchParams>;
}

export default async function PokemonDetailPage({ params, searchParams }: Props) {
  const { lang, name } = await params;
  const locale = lang as Locale;

  const resolvedSearchParams = await searchParams;
  const parsedPageParam = parsePageParam(resolvedSearchParams);
  const backHref = parsedPageParam?.backHref ?? `/${locale}/pokemon`;

  return (
    <PageContainer>
      <PageHeader backHref={backHref} />
      <PokemonDetailFeature name={name} locale={locale} />
    </PageContainer>
  );
}
