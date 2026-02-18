import Link from "next/link";
import { cn } from "@/lib/utils";
import React from "react";


const baseStyles =
  "text-[1.1rem] font-bold text-blue-primary flex items-center gap-2 whitespace-nowrap transition-colors hover:opacity-80 [&>svg]:w-4 [&>svg]:h-4";


interface InternalLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {
  className?: string;
}

export function InternalLink({
  className,
  children,
  ...props
}: InternalLinkProps) {
  return (
    <Link
      {...props}
      className={cn(baseStyles, className)}
    >
      {children}
    </Link>
  );
}


interface ExternalLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string;
}

export function ExternalLink({
  className,
  children,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(baseStyles, className)}
    >
      {children}
    </a>
  );
}