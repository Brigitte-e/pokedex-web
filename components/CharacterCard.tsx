import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CharacterCardProps {
  id: number;
  name: string;
  imageUrl?: string;
  className?: string;
}

export function CharacterCard({ id, name, imageUrl, className }: CharacterCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-border hover:border-gf-peach/40 hover:shadow-gf-crimson/20 hover:shadow-xl transition-all duration-300 group",
        className
      )}
    >
      <Link
        href={`/character/${id}`}
        className="flex flex-col items-center gap-3 p-5 text-center"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-24 w-24 rounded-full object-cover ring-2 ring-gf-peach/20 group-hover:ring-gf-peach/60 transition-all duration-300"
          />
        ) : (
          <div className="h-24 w-24 rounded-full bg-gf-forest flex items-center justify-center text-gf-peach text-2xl font-bold ring-2 ring-gf-peach/20 group-hover:ring-gf-peach/60 transition-all duration-300">
            {name[0]}
          </div>
        )}
        <span className="text-sm font-semibold text-foreground group-hover:text-gf-peach transition-colors duration-300">
          {name}
        </span>
      </Link>
    </Card>
  );
}
