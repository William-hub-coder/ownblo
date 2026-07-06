export default function PhotographyLoading() {
  return (
    <div className="py-20 px-4 animate-pulse">
      <div className="mx-auto max-w-7xl">
        {/* Heading skeleton */}
        <div className="text-center mb-12 space-y-3">
          <div className="h-10 w-48 bg-[var(--cyber-border)] rounded mx-auto" />
          <div className="h-5 w-64 bg-[var(--cyber-border)] rounded mx-auto" />
        </div>

        {/* Album card skeletons */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 overflow-hidden"
            >
              <div className="h-64 bg-[var(--cyber-border)]" />
              <div className="p-5 space-y-2">
                <div className="h-6 w-2/3 bg-[var(--cyber-border)] rounded" />
                <div className="h-4 w-full bg-[var(--cyber-border)] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
