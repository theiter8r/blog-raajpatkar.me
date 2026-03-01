'use client';

import { motion } from 'framer-motion';
import SubscribeCard from '@/components/SubscribeCard';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

export default function AboutContent() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <motion.header
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        custom={0}
        className="mb-14"
      >
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-brand-text dark:text-brand-text-dark leading-tight mb-4">
          About
        </h1>
        <p className="text-lg text-brand-muted dark:text-brand-muted-dark leading-relaxed">
          A space for long-form thinking on engineering, design, and the craft of building software.
        </p>
      </motion.header>

      <motion.div
        initial="hidden"
        animate="visible"
        className="space-y-6 text-brand-text/85 dark:text-brand-text-dark/85 leading-[1.8] text-[16.5px]"
      >
        <motion.p variants={fadeUp} custom={1}>
          Hi, I&apos;m Raaj. I write about the things I learn while building — from system
          design and backend architecture to the small frontend details that make a product
          feel right.
        </motion.p>

        <motion.p variants={fadeUp} custom={2}>
          This blog is my attempt to write clearly about complex subjects. I believe the best
          way to understand something deeply is to explain it, so that&apos;s what I try to do
          here — one post at a time.
        </motion.p>

        <motion.p variants={fadeUp} custom={3}>
          Topics you&apos;ll find here include:
        </motion.p>

        <motion.ul
          variants={fadeUp}
          custom={4}
          className="list-none space-y-3 pl-0"
        >
          {[
            'Software engineering & architecture',
            'Web development with React, Next.js, Node.js',
            'System design & scalability',
            'Developer tools & workflows',
            'Lessons from building products',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-accent shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </motion.ul>

        <motion.p variants={fadeUp} custom={5}>
          If you enjoy thoughtful technical writing, consider subscribing below. No spam,
          no fluff — just the occasional email when something new goes live.
        </motion.p>
      </motion.div>

      <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible" className="mt-16">
        <SubscribeCard />
      </motion.div>
    </main>
  );
}