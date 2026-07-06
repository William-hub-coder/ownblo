export default function ArticleLoading() {
  return (
    <div className="py-20 px-4 animate-pulse">
      <div className="mx-auto max-w-3xl">
        {/* Back link */}
        <div className="h-5 w-24 bg-[var(--cyber-border)] rounded mb-8" />

        {/* Tags */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 bg-[var(--cyber-border)] rounded-full" />
          <div className="h-6 w-20 bg-[var(--cyber-border)] rounded-full" />
        </div>

        {/* Title */}
        <div className="h-10 w-full bg-[var(--cyber-border)] rounded mb-4" />

        {/* Excerpt */}
        <div className="h-5 w-3/4 bg-[var(--cyber-border)] rounded mb-4" />

        {/* Meta */}
        <div className="flex gap-4 mb-8">
          <div className="h-4 w-24 bg-[var(--cyber-border)] rounded" />
          <div className="h-4 w-20 bg-[var(--cyber-border)] rounded" />
        </div>

        {/* Content lines */}
        <div className="border-t border-[var(--cyber-border)] pt-8 space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-4 bg-[var(--cyber-border)] rounded"
              style={{ width: `${Math.random() * 30 + 70}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
