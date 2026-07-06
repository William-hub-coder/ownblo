export default function ProjectDetailLoading() {
  return (
    <div className="py-20 px-4 animate-pulse">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <div className="h-5 w-24 bg-[var(--cyber-border)] rounded mb-8" />

        {/* Category badge */}
        <div className="h-6 w-20 bg-[var(--cyber-border)] rounded-full mb-3" />

        {/* Title */}
        <div className="h-10 w-2/3 bg-[var(--cyber-border)] rounded mb-4" />

        {/* Description */}
        <div className="h-5 w-full bg-[var(--cyber-border)] rounded mb-8" />

        {/* Links */}
        <div className="flex gap-3 mb-10">
          <div className="h-10 w-28 bg-[var(--cyber-border)] rounded-lg" />
          <div className="h-10 w-28 bg-[var(--cyber-border)] rounded-lg" />
        </div>

        {/* Tech stack */}
        <div className="mb-10">
          <div className="h-4 w-20 bg-[var(--cyber-border)] rounded mb-3" />
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-20 bg-[var(--cyber-border)] rounded-full" />
            ))}
          </div>
        </div>

        {/* Detail cards */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          <div className="h-20 bg-[var(--cyber-border)] rounded-xl" />
          <div className="h-20 bg-[var(--cyber-border)] rounded-xl" />
        </div>

        {/* Tech challenges */}
        <div className="h-32 bg-[var(--cyber-border)] rounded-xl" />
      </div>
    </div>
  );
}
