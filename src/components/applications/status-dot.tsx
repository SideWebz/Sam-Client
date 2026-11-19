type StatusDotProps = {
  status?: string;
};

export function StatusDot({ status }: StatusDotProps) {
  const isRunning = status === "running";

  return (
    <div
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${
        isRunning
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-border bg-muted text-muted-foreground"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${
          isRunning ? "bg-emerald-500" : "bg-neutral-400"
        }`}
      />
      <span className="capitalize">{status ?? "unknown"}</span>
    </div>
  );
}
