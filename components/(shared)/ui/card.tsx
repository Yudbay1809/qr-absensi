import { cn } from "@/components/(shared)/ui/utils";

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
