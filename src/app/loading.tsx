export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--stroke-soft)] border-t-[var(--text-muted)]"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
