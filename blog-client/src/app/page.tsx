import { Suspense } from 'react';
import { getPosts } from '@/lib/api';
import PostCard from '@/components/PostCard';
import SubscribeCard from '@/components/SubscribeCard';
import { PostCardSkeleton } from '@/components/Skeletons';
import { SITE_DESCRIPTION } from '@/lib/constants';

export const revalidate = 60;

async function PostsList() {
  try {
    const { posts } = await getPosts(1, 20);

    if (posts.length === 0) {
      return (
        <div className="text-center py-16">
          <p className="text-brand-muted dark:text-brand-muted-dark text-lg">
            No posts yet. Check back soon!
          </p>
        </div>
      );
    }

    const [featured, ...rest] = posts;

    return (
      <>
        {/* Featured post */}
        <section className="mb-16">
          <PostCard post={featured} featured />
        </section>

        {/* Recent posts */}
        {rest.length > 0 && (
          <section>
            <h2 className="text-sm font-medium text-brand-muted dark:text-brand-muted-dark uppercase tracking-widest mb-6">
              Recent Posts
            </h2>
            <div>
              {rest.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </section>
        )}
      </>
    );
  } catch {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 dark:text-red-400">Failed to load posts. Please try again later.</p>
      </div>
    );
  }
}

function PostsLoading() {
  return (
    <div className="space-y-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="max-w-3xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-20 pb-16 md:pt-28 md:pb-20">
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold mb-5 text-brand-text dark:text-brand-text-dark leading-[1.15] tracking-tight">
          Thoughts on engineering,{' '}
          <span className="text-brand-accent dark:text-brand-accent-dark">design</span>
          , and building great software.
        </h1>
        <p className="text-lg md:text-xl text-brand-muted dark:text-brand-muted-dark max-w-xl leading-relaxed">
          {SITE_DESCRIPTION}
        </p>
      </section>

      {/* Divider */}
      <div className="border-t border-brand-border dark:border-brand-border-dark mb-12" />

      {/* Posts */}
      <Suspense fallback={<PostsLoading />}>
        <PostsList />
      </Suspense>

      {/* Newsletter */}
      <SubscribeCard />
    </div>
  );
}
