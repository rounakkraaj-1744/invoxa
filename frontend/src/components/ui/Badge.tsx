import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
    {
        variants: {
            variant: {
                paid: "border-success/40 bg-success/10 text-success",
                sent: "border-info/40 bg-info/10 text-info font-medium",
                draft: "border-border-active bg-surface text-text-tertiary",
                overdue: "border-error/40 bg-error/10 text-error",
                accent: "border-accent/40 bg-accent/10 text-accent",
            },
        },
        defaultVariants: {
            variant: "draft",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
