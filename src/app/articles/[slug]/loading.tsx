export default function ArticleLoading() {
  return (
    <main id="main-content" className="marketing-main site-theme page-gutter pb-20 pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-3xl">
        {/* Back link skeleton */}
        <div className="mb-10 h-4 w-24 animate-pulse rounded bg-[rgba(255,255,255,0.06)]" />

        {/* Tags skeleton */}
        <div className="mb-5 flex gap-2">
          <div className="h-5 w-16 animate-pulse rounded-full bg-[rgba(255,255,255,0.06)]" />
          <div className="h-5 w-20 animate-pulse rounded-full bg-[rgba(255,255,255,0.06)]" />
        </div>

        {/* Title skeleton */}
        <div className="mb-3 h-10 w-full animate-pulse rounded bg-[rgba(255,255,255,0.06)]" />
        <div className="mb-6 h-10 w-3/4 animate-pulse rounded bg-[rgba(255,255,255,0.06)]" />

        {/* Meta skeleton */}
        <div className="mb-10 h-4 w-48 animate-pulse rounded bg-[rgba(255,255,255,0.06)]" />

        <div className="h-px w-full bg-[var(--stroke-soft)]" />

        {/* Content skeleton */}
        <div className="mt-10 space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-[rgba(255,255,255,0.04)]" />
          <div className="h-4 w-full animate-pulse rounded bg-[rgba(255,255,255,0.04)]" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-[rgba(255,255,255,0.04)]" />
          <div className="h-4 w-full animate-pulse rounded bg-[rgba(255,255,255,0.04)]" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-[rgba(255,255,255,0.04)]" />
          <div className="mt-8 h-4 w-full animate-pulse rounded bg-[rgba(255,255,255,0.04)]" />
          <div className="h-4 w-full animate-pulse rounded bg-[rgba(255,255,255,0.04)]" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-[rgba(255,255,255,0.04)]" />
        </div>
      </div>
    </main>
  );
}
