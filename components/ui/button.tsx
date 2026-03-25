import { cn } from "@/components/ui/utils";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const base =
  "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white shadow-[0_14px_30px_rgba(21,184,121,0.35)] hover:bg-brand-600",
  secondary:
    "border border-brand-200 bg-white/80 text-brand-900 shadow-sm hover:border-brand-300 hover:bg-white",
  ghost: "text-brand-700 hover:text-brand-900",
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
