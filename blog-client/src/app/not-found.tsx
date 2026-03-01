import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-32 text-center">
      <h1 className="font-serif text-6xl md:text-7xl font-medium text-brand-text dark:text-brand-text-dark mb-4">
        404
      </h1>
      <p className="text-lg text-brand-muted dark:text-brand-muted-dark mb-8">
        This page doesn&apos;t exist — perhaps it was moved, or it never was.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-brand-accent hover:text-brand-accent/80 transition-colors font-medium"
      >
        <span aria-hidden="true">&larr;</span>
        Back to home
      </Link>
    </main>
  );
}