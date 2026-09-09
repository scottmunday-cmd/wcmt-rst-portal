import Link from "next/link";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline";

const variantClasses: Record<Variant, string> = {
  primary: "bg-wcmt-orange text-white hover:opacity-90",
  secondary: "bg-wcmt-navy text-white hover:opacity-90",
  outline: "border border-wcmt-navy text-wcmt-navy hover:bg-wcmt-navy hover:text-white",
};

const base =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 font-heading text-sm font-semibold transition-colors";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(base, variantClasses[variant], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={clsx(base, variantClasses[variant], className)}>
      {children}
    </Link>
  );
}
