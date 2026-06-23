import { capitalize } from "@/lib/pokeapi";
import { Badge } from "@/components/ui/badge";
import { t } from "@/lib/i18n";
import type { AbilitySlot } from "@/types";

interface Props {
  abilities: AbilitySlot[];
}

export function PokemonAbilities({ abilities }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60 mb-3">
        {t("pokemonDetail.abilities")}
      </h2>
      <div className="flex flex-wrap gap-2">
        {abilities.map(({ ability, is_hidden }) => (
          <Badge key={ability.name} variant={is_hidden ? "accent" : "secondary"}>
            {capitalize(ability.name)}
            {is_hidden && (
              <span className="ml-1 text-[10px] opacity-70">{t("pokemonDetail.hidden")}</span>
            )}
          </Badge>
        ))}
      </div>
    </section>
  );
}
