import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="h-4 w-32 bg-[var(--cyber-border)] rounded mx-auto" />
          <div className="h-16 w-64 bg-[var(--cyber-border)] rounded mx-auto" />
          <div className="h-8 w-48 bg-[var(--cyber-border)] rounded mx-auto" />
          <div className="flex justify-center gap-4">
            <div className="h-12 w-36 bg-[var(--cyber-border)] rounded-xl" />
            <div className="h-12 w-36 bg-[var(--cyber-border)] rounded-xl" />
          </div>
        </div>
      </div>

      {/* Card grid skeleton */}
      <div className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
