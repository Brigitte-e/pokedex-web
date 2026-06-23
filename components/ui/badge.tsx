import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default:
          "bg-pk-red text-primary-foreground",
        secondary:
          "bg-pk-blue/40 text-secondary-foreground border border-pk-blue/60",
        accent:
          "bg-pk-yellow/20 text-accent-foreground border border-pk-yellow/50",
        outline:
          "border border-pk-yellow/40 text-pk-yellow bg-transparent",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
