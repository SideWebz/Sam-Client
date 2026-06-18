import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type ActionButtonVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "ghost";

type ActionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ActionButtonVariant;
  loading?: boolean;
};

const variants: Record<ActionButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500 border-blue-500/30 shadow-blue-500/20",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-500 border-emerald-500/30 shadow-emerald-500/20",
  warning:
    "bg-amber-500 text-black hover:bg-amber-400 border-amber-400/30 shadow-amber-500/20",
  danger:
    "bg-red-600 text-white hover:bg-red-500 border-red-500/30 shadow-red-500/20",
  ghost:
    "bg-white/5 text-slate-100 hover:bg-white/10 border-white/10 shadow-black/20",
};

export function ActionButton({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ActionButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "inline-flex h-9 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium shadow-lg transition-all",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}