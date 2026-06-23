"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type LazyImageProps = Omit<ImageProps, "onLoad" | "onError"> & {
  wrapperClassName?: string;
  skeletonClassName?: string;
};

export function LazyImage({ wrapperClassName, skeletonClassName, className, ...props }: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const skeletonRef = useRef<HTMLSpanElement>(null);
  const [loaded, setLoaded] = useState(false);

  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      skeletonRef.current?.style.setProperty("display", "none");
      setLoaded(true);
    }
  }, []);

  return (
    <span className={cn("relative inline-block shrink-0", wrapperClassName)}>
      <span
        ref={skeletonRef}
        className={cn(
          "absolute inset-0 rounded-full bg-muted transition-opacity duration-300",
          loaded ? "opacity-0 pointer-events-none" : "opacity-100",
          skeletonClassName,
        )}
      />
      <Image
        loading="eager"
        {...props}
        ref={imgRef as React.Ref<HTMLImageElement>}
        className={cn(className)}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        alt={props.alt ?? ""}
      />
    </span>
  );
}
