'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { PostListItem } from '@/lib/types';
import { formatDate, calculateReadingTime, generateExcerpt } from '@/lib/utils';

interface PostCardProps {
  post: PostListItem;
  index?: number;
  featured?: boolean;
}

export default function PostCard({ post, index = 0, featured = false }: PostCardProps) {
  const readingTime = post.excerpt
    ? calculateReadingTime(post.excerpt)
    : '1 min read';

  if (featured) {
    return (
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Link href={`/posts/${post.slug}`} className="group block">
          <div className="relative p-8 md:p-10 rounded-2xl bg-brand-card dark:bg-brand-card-dark border border-brand-border dark:border-brand-border-dark hover:border-brand-accent/30 dark:hover:border-brand-accent-dark/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/5">
            {/* Featured badge */}
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-accent dark:text-brand-accent-dark mb-4 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent dark:bg-brand-accent-dark" />
              Latest
            </div>

            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-brand-text dark:text-brand-text-dark group-hover:text-brand-accent dark:group-hover:text-brand-accent-dark transition-colors duration-300 leading-tight">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-brand-muted dark:text-brand-muted-dark text-lg leading-relaxed mb-6 max-w-2xl">
                {generateExcerpt(post.excerpt, 280)}
              </p>
            )}

            <div className="flex items-center gap-3 text-sm text-brand-muted dark:text-brand-muted-dark">
              {post.published_at && (
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              )}
              <span className="text-brand-border dark:text-brand-border-dark">/</span>
              <span>{readingTime}</span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Link href={`/posts/${post.slug}`} className="group block">
        <div className="py-6 border-b border-brand-border dark:border-brand-border-dark group-hover:border-brand-accent/30 dark:group-hover:border-brand-accent-dark/30 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-2.5 text-sm text-brand-muted dark:text-brand-muted-dark">
            {post.published_at && (
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            )}
            <span className="text-brand-border dark:text-brand-border-dark">/</span>
            <span>{readingTime}</span>
          </div>

          <h2 className="font-serif text-xl md:text-2xl font-semibold mb-2 text-brand-text dark:text-brand-text-dark group-hover:text-brand-accent dark:group-hover:text-brand-accent-dark transition-colors duration-200 leading-snug">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="text-brand-muted dark:text-brand-muted-dark leading-relaxed line-clamp-2">
              {generateExcerpt(post.excerpt, 200)}
            </p>
          )}

          <span className="inline-flex items-center mt-3 text-sm font-medium text-brand-accent dark:text-brand-accent-dark opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1">
            Read article
            <svg className="ml-1 w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
