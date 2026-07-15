"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parsePageParam } from "@/lib/utils/parsePageParam";

interface Options {
  pageSize: number;
  initialCount?: number;
}

export function usePagination({ pageSize, initialCount }: Options) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { page: urlPage = 1 } = parsePageParam({ page: searchParams.get("page") ?? undefined });
  const [page, setPageState] = useState(urlPage);
  const [count, setCount] = useState(initialCount);
  const skipUrlSyncRef = useRef(false);
  const isInitialMountRef = useRef(true);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }
    setPageState((current) => (current === urlPage ? current : urlPage));
  }, [urlPage]);

  const setPage = useCallback(
    (nextPage: number) => {
      if (nextPage === page) return;

      skipUrlSyncRef.current = true;

      const params = new URLSearchParams(searchParams.toString());

      if (nextPage <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(nextPage));
      }

      const qs = params.toString();
      // Shallow URL update without a server round trip. replaceState does not
      // notify Next.js, so local state drives re-renders and client fetches.
      window.history.replaceState(null, "", qs ? `${pathname}?${qs}` : pathname);
      window.scrollTo(0, 0);
      setPageState(nextPage);
    },
    [pathname, searchParams, page],
  );

  const totalPages = count != null ? Math.max(1, Math.ceil(count / pageSize)) : 1;
  const effectivePage = Math.min(page, totalPages);

  const syncCount = useCallback((nextCount: number | undefined) => {
    if (nextCount != null) {
      setCount(nextCount);
    }
  }, []);

  const goToPrevious = useCallback(
    () => setPage(Math.max(1, effectivePage - 1)),
    [effectivePage, setPage],
  );

  const goToNext = useCallback(
    () => setPage(effectivePage + 1),
    [effectivePage, setPage],
  );

  return {
    page,
    effectivePage,
    totalPages,
    setPage,
    goToPrevious,
    goToNext,
    syncCount,
  };
}
