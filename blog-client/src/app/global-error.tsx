'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-brand-bg text-brand-text">
        <main className="max-w-3xl mx-auto px-6 py-32 text-center">
          <h1 className="font-serif text-5xl font-medium mb-4">Something went wrong</h1>
          <p className="text-brand-muted mb-8">
            {error.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-brand-border text-sm font-medium hover:bg-brand-surface transition-colors"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}