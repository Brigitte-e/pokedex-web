"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CharacterCard } from "@/components/CharacterCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Badge } from "@/components/ui/badge";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Character {
  _id: number;
  name: string;
  imageUrl?: string;
  videoGames: string[];
}

interface ApiResponse {
  data: Character[];
  info: {
    count: number;
    totalPages: number;
    previousPage: string | null;
    nextPage: string | null;
  };
}

async function fetchGameCharacters(): Promise<ApiResponse> {
  const res = await fetch(`${API_URL}/character?videoGames=Gravity%20Falls`);
  if (!res.ok) throw new Error("Failed to fetch characters");
  return res.json();
}

export default function GamesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["game-characters"],
    queryFn: fetchGameCharacters,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <main className="flex flex-col items-center min-h-screen py-12 px-6">
      <div className="w-full max-w-3xl mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gf-peach tracking-tight">
          Video Game Characters
        </h1>
        <Link
          href="/"
          className="text-sm font-medium text-gf-peach/60 hover:text-gf-peach transition-colors"
        >
          ← All Characters
        </Link>
      </div>

      {isLoading && <LoadingState variant="grid" />}

      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : undefined}
        />
      )}

      {data && (
        <>
          <p className="w-full max-w-3xl text-sm text-gf-peach/50 mb-6">
            {data.info.count} characters appeared in Gravity Falls video games
          </p>

          <ul className="grid grid-cols-2 gap-4 w-full max-w-3xl sm:grid-cols-3 md:grid-cols-4">
            {data.data.map((character) => (
              <li key={character._id} className="flex flex-col gap-1">
                <CharacterCard
                  id={character._id}
                  name={character.name}
                  imageUrl={character.imageUrl}
                />
                {character.videoGames.length > 0 && (
                  <div className="flex flex-wrap gap-1 px-1">
                    {character.videoGames.map((game) => (
                      <Badge key={game} variant="outline" className="text-xs">
                        {game}
                      </Badge>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
