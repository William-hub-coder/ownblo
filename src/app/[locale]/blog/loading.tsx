import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function BlogLoading() {
  return (
    <div className="py-20 px-4 animate-pulse">
      <div className="mx-auto max-w-4xl">
        {/* Heading skeleton */}
        <div className="text-center mb-12 space-y-3">
          <div className="h-10 w-48 bg-[var(--cyber-border)] rounded mx-auto" />
          <div className="h-5 w-64 bg-[var(--cyber-border)] rounded mx-auto" />
        </div>

        {/* Search bar skeleton */}
        <div className="max-w-md mx-auto mb-10">
          <div className="h-12 bg-[var(--cyber-border)] rounded-xl" />
        </div>

        {/* Article card skeletons */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-[var(--cyber-border)] bg-[var(--cyber-surface)]/50 p-6"
            >
              <div className="flex gap-2 mb-3">
                <div className="h-5 w-16 bg-[var(--cyber-border)] rounded-full" />
                <div className="h-5 w-20 bg-[var(--cyber-border)] rounded-full" />
              </div>
              <div className="h-7 w-3/4 bg-[var(--cyber-border)] rounded mb-2" />
              <div className="h-4 w-full bg-[var(--cyber-border)] rounded mb-1" />
              <div className="h-4 w-2/3 bg-[var(--cyber-border)] rounded mb-3" />
              <div className="h-4 w-40 bg-[var(--cyber-border)] rounded" />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    </div>
  );
}
