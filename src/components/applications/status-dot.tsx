type StatusDotProps = {
  status?: string;
};

export function StatusDot({ status }: StatusDotProps) {
  const isRunning = status === "running";

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
        isRunning
          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
          : "border-red-400/20 bg-red-400/10 text-red-300"
      }`}
    >
      <span
        className={`size-2 rounded-full ${
          isRunning ? "bg-emerald-400" : "bg-red-400"
        }`}
      />
      <span className="capitalize">{status ?? "unknown"}</span>
    </div>
  );
}