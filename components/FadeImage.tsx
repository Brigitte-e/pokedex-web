"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type FadeImageProps = Omit<ImageProps, "onLoad" | "onError"> & {
  wrapperClassName?: string;
  skeletonClassName?: string;
};

export function FadeImage({ wrapperClassName, skeletonClassName, style, className, ...props }: FadeImageProps) {
  const [loaded, setLoaded] = useState(false);
  const reveal = () => requestAnimationFrame(() => requestAnimationFrame(() => setLoaded(true)));

  return (
    <span className={cn("relative inline-block shrink-0", wrapperClassName)}>
      <span className={cn(
        "absolute inset-0 rounded-full bg-muted transition-opacity duration-300",
        loaded ? "opacity-0 pointer-events-none" : "opacity-100",
        skeletonClassName,
      )} />
      <Image
        {...props}
        className={cn("transition-transform duration-300 ease-out will-change-transform", className)}
        style={{ opacity: loaded ? 1 : 0, ...style }}
        onLoad={reveal}
        onError={reveal}
        alt={props.alt ?? ""}
      />
    </span>
  );
}
