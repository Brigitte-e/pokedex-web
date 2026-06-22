"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { CharacterCard } from "@/components/CharacterCard";
import { Pagination } from "@/components/Pagination";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Character {
  _id: number;
  name: string;
  imageUrl?: string;
  tvShows: string[];
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

async function fetchCharacters(page: number): Promise<ApiResponse> {
  const res = await fetch(
    `${API_URL}/character?tvShows=Gravity%20Falls&page=${page}&pageSize=20`
  );
  if (!res.ok) throw new Error("Failed to fetch characters");
  return res.json();
}

export default function Home() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["characters", page],
    queryFn: () => fetchCharacters(page),
    placeholderData: keepPreviousData,
  });

  return (
    <main className="flex flex-col items-center min-h-screen py-12 px-6">
      <h1 className="text-3xl font-bold text-gf-peach mb-8 tracking-tight">
        Gravity Falls Characters
      </h1>

      {isLoading && <LoadingState variant="grid" />}

      {isError && (
        <ErrorState
          message={error instanceof Error ? error.message : undefined}
        />
      )}

      {data && (
        <>
          <ul className="grid grid-cols-2 gap-4 w-full max-w-3xl sm:grid-cols-3 md:grid-cols-4">
            {data.data.map((character) => (
              <li key={character._id}>
                <CharacterCard
                  id={character._id}
                  name={character.name}
                  imageUrl={character.imageUrl}
                />
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={data.info.totalPages}
              hasPrevious={!!data.info.previousPage}
              hasNext={!!data.info.nextPage}
              onPrevious={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
            />
          </div>
        </>
      )}
    </main>
  );
}
