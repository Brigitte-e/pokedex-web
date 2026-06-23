import { Badge } from "@/components/ui/badge";

export interface DetailSectionProps {
  title: string;
  items: string[];
}

export function DetailSection({ title, items }: DetailSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-pk-yellow/60">
        {title}
      </h2>
      {items.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {items.map((item) => (
            <li key={item}>
              <Badge variant="secondary">{item}</Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground/50">—</p>
      )}
    </div>
  );
}
