"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils/cn";

type LazyImageProps = Omit<ImageProps, "onLoad" | "onError" | "src"> & {
  /** null/undefined renders the placeholder, for entities without an image. */
  src: ImageProps["src"] | null | undefined;
  wrapperClassName?: string;
  skeletonClassName?: string;
  fetchPriority?: "high" | "low" | "auto";
};

export function LazyImage({ src, wrapperClassName, skeletonClassName, className, fetchPriority = "auto", ...props }: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Cached images may already be complete before onLoad can fire.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      if (img.naturalWidth > 0) setLoaded(true);
      else setError(true);
    }
  }, []);

  if (!src || error) {
    return (
      <span
        role="img"
        aria-label={typeof props.alt === "string" ? props.alt : ""}
        style={{ width: props.width, height: props.height }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
          wrapperClassName,
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-1/2 w-1/2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h6m6 0h6" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      </span>
    );
  }

  return (
    <span className={cn("relative inline-block shrink-0", wrapperClassName)}>
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-muted transition-opacity duration-300",
          loaded ? "opacity-0 pointer-events-none" : "opacity-100",
          skeletonClassName,
        )}
      />
      <Image
        fetchPriority={fetchPriority}
        {...props}
        src={src}
        ref={imgRef as React.Ref<HTMLImageElement>}
        className={cn(className)}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        alt={props.alt ?? ""}
      />
    </span>
  );
}
