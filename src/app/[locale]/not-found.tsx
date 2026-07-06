import Link from "next/link";
import { Home } from "lucide-react";

export default function LocaleNotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-6">
          <h1
            className="text-8xl font-bold text-[var(--cyber-primary)] opacity-20 select-none"
            aria-hidden="true"
          >
            404
          </h1>
          <span className="absolute inset-0 flex items-center justify-center text-8xl font-bold gradient-text select-none">
            404
          </span>
        </div>

        <h2 className="mb-3 text-xl font-semibold text-[var(--cyber-text)]">
          Page Not Found
        </h2>
        <p className="mb-8 text-sm text-[var(--cyber-muted)]">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--cyber-primary)] to-[var(--cyber-accent)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--cyber-primary)]/25 transition-all hover:scale-105"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
