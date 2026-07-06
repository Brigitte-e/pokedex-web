"use client";

import Link from "next/link";
import { DEFAULT_TYPE_COLOR, TYPE_COLORS, TYPE_DAMAGE_RELATIONS } from "@/lib/constants";
import { useTranslation } from "@/hooks/useTranslation";
import type { PokemonType, NamedResource } from "@/types";
import type { Locale } from "@/lib/constants";

interface Props {
  type: PokemonType;
  typeNameMap: Record<string, string>;
}

interface TypeBadgeProps {
  type: NamedResource;
  locale: Locale;
  typeNameMap: Record<string, string>;
}

const TypeBadge = ({
  type,
  locale,
  typeNameMap,
}: TypeBadgeProps) => {
  return (
    <Link
      href={`/${locale}/types/${type.name}`}
      className="rounded-full px-3 py-1 text-xs font-bold uppercase text-white transition-opacity hover:opacity-80"
      style={{ backgroundColor: TYPE_COLORS[type.name] ?? DEFAULT_TYPE_COLOR }}
    >
      {typeNameMap[type.name] ?? type.name}
    </Link>
  );
};

const TypeDamageRelations = ({
  type,
  typeNameMap,
}: Props) => {
  const { t, locale } = useTranslation();

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-4">
        {t("typeDetail.damageRelations")}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {TYPE_DAMAGE_RELATIONS.map(({ labelKey, key }) => {
          const label = t(labelKey);
          const items = type.damage_relations[key as keyof typeof type.damage_relations] as NamedResource[];
          return (
            <div key={key}>
              <p className="text-xs text-muted-foreground mb-2">{label}</p>
              {items.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {items.map((relationType) => (
                    <TypeBadge key={relationType.name} type={relationType} locale={locale} typeNameMap={typeNameMap} />
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">{t("common.empty")}</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export { TypeDamageRelations };
