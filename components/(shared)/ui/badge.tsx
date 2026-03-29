import { cn } from "@/components/(shared)/ui/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "solid" | "soft";
  className?: string;
};

export function Badge({ children, variant = "soft", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-semibold",
        variant === "solid"
          ? "bg-brand-500 text-white"
          : "bg-brand-100 text-brand-700",
        className
      )}
    >
      {children}
    </span>
  );
}
