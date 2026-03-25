import { cn } from "@/components/ui/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("card-surface", "p-6", className)}>{children}</div>
  );
}
