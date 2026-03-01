import { FeaturedPostSkeleton, PostCardSkeleton } from '@/components/Skeletons';

export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="animate-pulse mb-16">
        <div className="h-10 w-2/3 rounded bg-brand-surface dark:bg-brand-surface-dark mb-4" />
        <div className="h-5 w-1/2 rounded bg-brand-surface dark:bg-brand-surface-dark" />
      </div>

      <FeaturedPostSkeleton />

      <div className="mt-14">
        <div className="h-3 w-28 rounded bg-brand-surface dark:bg-brand-surface-dark mb-6" />
        {Array.from({ length: 4 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}