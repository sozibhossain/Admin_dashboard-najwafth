import { cn } from "@/lib/utils";

const tones = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  default: "bg-slate-100 text-slate-700",
};

export function Badge({
  tone = "default",
  children,
  className,
}: {
  tone?: keyof typeof tones;
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize", tones[tone], className)}>{children}</span>;
}
