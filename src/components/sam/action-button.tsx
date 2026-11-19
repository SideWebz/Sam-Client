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
    "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
  warning:
    "border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100",
  danger:
    "border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
  ghost:
    "border-border bg-card text-foreground hover:bg-muted",
};

export function actionButtonClass(
  variant: ActionButtonVariant = "primary",
  className = ""
) {
  return [
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3.5 text-sm font-medium whitespace-nowrap transition-colors sm:h-9",
    "outline-none focus-visible:ring-2 focus-visible:ring-ring/20 active:translate-y-px",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:shrink-0",
    variants[variant],
    className,
  ].join(" ");
}

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
      className={actionButtonClass(variant, className)}
      {...props}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}
