import { Suspense } from "react";
import { LoadingState } from "@/components/LoadingState";
import { TypeGrid } from "./features/TypeGrid";
import { PageHeader } from "@/components/PageHeader";

export default async function TypesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <PageHeader title="Types" subtitle="Browse all Pokémon types and their damage relations." />
      <Suspense fallback={<LoadingState variant="type-grid" />}>
        <TypeGrid />
      </Suspense>
    </main>
  );
}
