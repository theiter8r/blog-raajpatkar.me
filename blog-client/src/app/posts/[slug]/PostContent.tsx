'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Post } from '@/lib/types';
import { formatDate, calculateReadingTime } from '@/lib/utils';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import SubscribeCard from '@/components/SubscribeCard';

interface PostContentProps {
  post: Post;
}

export default function PostContent({ post }: PostContentProps) {
  const readingTime = calculateReadingTime(post.content);
  const dateLabel = post.published_at
    ? formatDate(post.published_at)
    : formatDate(post.created_at);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-brand-muted dark:text-brand-muted-dark hover:text-brand-text dark:hover:text-brand-text-dark transition-colors mb-10"
        >
          <span aria-hidden="true">&larr;</span>
          All posts
        </Link>
      </motion.div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-10"
      >
        <h1 className="font-serif text-3xl md:text-4xl lg:text-[2.75rem] font-medium leading-[1.15] text-brand-text dark:text-brand-text-dark mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-3 text-sm text-brand-muted dark:text-brand-muted-dark">
          <time dateTime={post.published_at || post.created_at}>{dateLabel}</time>
          <span className="text-brand-border dark:text-brand-border-dark">&middot;</span>
          <span>{readingTime}</span>
        </div>
      </motion.header>

      {/* Divider */}
      <div className="border-t border-brand-border dark:border-brand-border-dark mb-10" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <MarkdownRenderer content={post.content} />
      </motion.div>

      {/* Subscribe CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-20"
      >
        <SubscribeCard />
      </motion.div>
    </article>
  );
}