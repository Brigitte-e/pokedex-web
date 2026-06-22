"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use } from "react";
import { DetailSection } from "@/components/DetailSection";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Character {
  _id: number;
  name: string;
  imageUrl?: string;
  films: string[];
  shortFilms: string[];
  tvShows: string[];
  videoGames: string[];
  parkAttractions: string[];
  allies: string[];
  enemies: string[];
  url: string;
}

interface ApiResponse {
  data: Character;
}

async function fetchCharacter(id: string): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/character/${id}`);
  if (!res.ok) throw new Error("Character not found");
  return res.json();
}

const SECTIONS: { title: string; key: keyof Character }[] = [
  { title: "TV Shows", key: "tvShows" },
  { title: "Films", key: "films" },
  { title: "Short Films", key: "shortFilms" },
  { title: "Video Games", key: "videoGames" },
  { title: "Park Attractions", key: "parkAttractions" },
  { title: "Allies", key: "allies" },
  { title: "Enemies", key: "enemies" },
];

export default function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["character", id],
    queryFn: () => fetchCharacter(id),
    staleTime: 5 * 60 * 1000,
  });

  const character = data?.data;

  return (
    <main className="flex flex-col items-center min-h-screen py-12 px-6">
      <div className="w-full max-w-2xl">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-gf-peach/60 hover:text-gf-peach transition-colors mb-8"
        >
          ← Back to Characters
        </Link>

        {isLoading && <LoadingState variant="detail" />}

        {isError && (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
          />
        )}

        {character && (
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-6 rounded-2xl border border-gf-crimson/30 bg-card p-6 shadow-lg shadow-black/30">
              {character.imageUrl && (
                <img
                  src={character.imageUrl}
                  alt={character.name}
                  className="h-36 w-36 rounded-2xl object-cover ring-2 ring-gf-peach/20 shrink-0"
                />
              )}
              <div className="flex flex-col gap-3 pt-1">
                <div>
                  <h1 className="text-2xl font-bold text-gf-peach leading-tight">
                    {character.name}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ID #{character._id}
                  </p>
                </div>
                <a
                  href={character.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 self-start rounded-full border border-gf-peach/30 px-3 py-1 text-xs font-medium text-gf-peach/70 hover:border-gf-peach hover:text-gf-peach transition-colors"
                >
                  Disney Wiki ↗
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-px rounded-2xl border border-gf-forest/40 overflow-hidden bg-gf-forest/20">
              {SECTIONS.map(({ title, key }) => (
                <div key={key} className="bg-card px-6 py-4">
                  <DetailSection
                    title={title}
                    items={character[key] as string[]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
