import { notFound } from "next/navigation";
import { fetchType } from "@/lib/api/types";
import { isNotFoundError } from "@/lib/api/client";
import { PageContainer } from "@/components/PageContainer";
import { PageHeader } from "@/components/PageHeader";
import { TypeHeader } from "./features/type-header";
import { TypeDamageRelations } from "./features/type-damage-relations";
import { TypeMoves } from "./features/type-moves";
import { getLocalizedName } from "@/lib/locale";
import { capitalize } from "@/lib/pokeapi";
import type { Locale } from "@/lib/constants";
import { TYPE_DAMAGE_RELATIONS } from "@/lib/constants";

interface Props {
  params: Promise<{ lang: string; name: string }>;
}

export default async function TypeDetailPage({ params }: Props) {
  const { lang, name } = await params;
  const locale = lang as Locale;

  let type;
  try {
    type = await fetchType(name);
  } catch (err) {
    if (isNotFoundError(err)) notFound();
    throw err;
  }

  const localizedTypeName = getLocalizedName(type.names, locale, capitalize(type.name));

  const relatedTypeSlugs = [
    ...new Set(
      TYPE_DAMAGE_RELATIONS.flatMap(({ key }) =>
        (type.damage_relations[key as keyof typeof type.damage_relations] as { name: string }[]).map(
          (t) => t.name,
        ),
      ),
    ),
  ];

  const relatedTypeResults = await Promise.allSettled(relatedTypeSlugs.map((slug) => fetchType(slug)));
  const relatedTypes = relatedTypeResults
    .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof fetchType>>> => r.status === "fulfilled")
    .map((r) => r.value);
  const typeNameMap = Object.fromEntries(
    relatedTypes.map((t) => [t.name, getLocalizedName(t.names, locale, capitalize(t.name))]),
  );
  typeNameMap[type.name] = localizedTypeName;

  return (
    <PageContainer>
      <PageHeader backHref={`/${locale}/types`} />
      <div className="flex flex-col gap-6">
        <TypeHeader name={type.name} localizedName={localizedTypeName} />
        <TypeDamageRelations type={type} typeNameMap={typeNameMap} />
        <TypeMoves moves={type.moves} />
      </div>
    </PageContainer>
  );
}
