export default function ArticlesLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--stroke-soft)] border-t-[var(--text-muted)]"
        role="status"
        aria-label="Loading articles"
      />
    </div>
  );
}
