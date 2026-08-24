"use client";

import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

export interface TextShimmerProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export const Shimmer = ({
  children,
  as: Component = "p",
  className,
}: TextShimmerProps) => {
  return (
    <Component className={cn("animate-pulse text-muted-foreground", className)}>
      {children}
    </Component>
  );
};
