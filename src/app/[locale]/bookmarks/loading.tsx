export default function BookmarksLoading() {
  return (
    <div className="py-20 px-4 animate-pulse">
      <div className="mx-auto max-w-5xl">
        {/* Heading skeleton */}
        <div className="text-center mb-12 space-y-3">
          <div className="h-10 w-48 bg-[var(--cyber-border)] rounded mx-auto" />
          <div className="h-5 w-64 bg-[var(--cyber-border)] rounded mx-auto" />
        </div>

        {/* Search bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="h-12 bg-[var(--cyber-border)] rounded-xl" />
        </div>

        {/* Category filter */}
        <div className="flex justify-center gap-2 mb-10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-16 bg-[var(--cyber-border)] rounded-full" />
          ))}
        </div>

        {/* Bookmark card skeletons */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 p-5"
            >
              <div className="flex justify-between mb-2">
                <div className="h-5 w-5 bg-[var(--cyber-border)] rounded" />
                <div className="h-4 w-4 bg-[var(--cyber-border)] rounded" />
              </div>
              <div className="h-5 w-2/3 bg-[var(--cyber-border)] rounded mb-2" />
              <div className="h-4 w-full bg-[var(--cyber-border)] rounded mb-1" />
              <div className="h-4 w-3/4 bg-[var(--cyber-border)] rounded mb-3" />
              <div className="h-5 w-16 bg-[var(--cyber-border)] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
