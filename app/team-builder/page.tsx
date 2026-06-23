import { TeamBuilder } from "./features/TeamBuilder";
import { PageHeader } from "@/components/PageHeader";

export default function TeamBuilderPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <PageHeader title="Team Builder" subtitle="Build your team of up to 6 Pokémon." />
      <TeamBuilder />
    </main>
  );
}
