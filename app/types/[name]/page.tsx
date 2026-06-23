import { fetchType } from "@/app/api/types";
import { ErrorState } from "@/components/ErrorState";
import { PageHeader } from "@/components/PageHeader";
import { TypeHeader } from "./features/TypeHeader";
import { TypeDamageRelations } from "./features/TypeDamageRelations";
import { TypeMoves } from "./features/TypeMoves";
import { t } from "@/lib/i18n";

interface Props {
  params: Promise<{ name: string }>;
}

export default async function TypeDetailPage({ params }: Props) {
  const { name } = await params;

  let type;
  try {
    type = await fetchType(name);
  } catch (err) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-10">
        <PageHeader backHref="/types" backLabel={t("typeDetail.backToTypes")} title="" />
        <ErrorState message={err instanceof Error ? err.message : undefined} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <PageHeader backHref="/types" backLabel={t("typeDetail.backToTypes")} title="" />
      <div className="flex flex-col gap-6">
        <TypeHeader name={type.name} />
        <TypeDamageRelations type={type} />
        <TypeMoves moves={type.moves} />
      </div>
    </main>
  );
}
