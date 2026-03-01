export function PostCardSkeleton() {
  return (
    <div className="py-6 border-b border-brand-border dark:border-brand-border-dark animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-3.5 w-20 rounded bg-brand-surface dark:bg-brand-surface-dark" />
        <div className="h-3.5 w-16 rounded bg-brand-surface dark:bg-brand-surface-dark" />
      </div>
      <div className="h-6 w-3/4 rounded bg-brand-surface dark:bg-brand-surface-dark mb-2.5" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded bg-brand-surface dark:bg-brand-surface-dark" />
        <div className="h-4 w-4/5 rounded bg-brand-surface dark:bg-brand-surface-dark" />
      </div>
    </div>
  );
}

export function FeaturedPostSkeleton() {
  return (
    <div className="p-8 md:p-10 rounded-2xl border border-brand-border dark:border-brand-border-dark animate-pulse">
      <div className="h-3 w-16 rounded bg-brand-surface dark:bg-brand-surface-dark mb-5" />
      <div className="h-10 w-3/4 rounded bg-brand-surface dark:bg-brand-surface-dark mb-3" />
      <div className="h-10 w-1/2 rounded bg-brand-surface dark:bg-brand-surface-dark mb-5" />
      <div className="space-y-2 mb-6">
        <div className="h-5 w-full rounded bg-brand-surface dark:bg-brand-surface-dark" />
        <div className="h-5 w-5/6 rounded bg-brand-surface dark:bg-brand-surface-dark" />
      </div>
      <div className="flex gap-3">
        <div className="h-3.5 w-24 rounded bg-brand-surface dark:bg-brand-surface-dark" />
        <div className="h-3.5 w-20 rounded bg-brand-surface dark:bg-brand-surface-dark" />
      </div>
    </div>
  );
}

export function PostPageSkeleton() {
  return (
    <div className="animate-pulse max-w-3xl mx-auto px-6 py-16">
      <div className="h-3.5 w-24 rounded bg-brand-surface dark:bg-brand-surface-dark mb-10" />
      <div className="h-10 w-3/4 rounded bg-brand-surface dark:bg-brand-surface-dark mb-3" />
      <div className="h-10 w-1/2 rounded bg-brand-surface dark:bg-brand-surface-dark mb-6" />
      <div className="flex gap-3 mb-10">
        <div className="h-3.5 w-24 rounded bg-brand-surface dark:bg-brand-surface-dark" />
        <div className="h-3.5 w-20 rounded bg-brand-surface dark:bg-brand-surface-dark" />
      </div>
      <div className="border-t border-brand-border dark:border-brand-border-dark mb-10" />
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-4 rounded bg-brand-surface dark:bg-brand-surface-dark"
            style={{ width: `${75 + Math.random() * 25}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-brand-border dark:border-brand-border-dark">
          <div className="space-y-2 flex-1">
            <div className="h-5 w-1/3 rounded bg-brand-surface dark:bg-brand-surface-dark" />
            <div className="h-3.5 w-1/4 rounded bg-brand-surface dark:bg-brand-surface-dark" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-14 rounded-lg bg-brand-surface dark:bg-brand-surface-dark" />
            <div className="h-8 w-16 rounded-lg bg-brand-surface dark:bg-brand-surface-dark" />
          </div>
        </div>
      ))}
    </div>
  );
}
