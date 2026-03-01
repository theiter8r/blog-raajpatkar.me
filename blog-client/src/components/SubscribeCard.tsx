'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { subscribe } from '@/lib/api';
import { isValidEmail } from '@/lib/utils';

export default function SubscribeCard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await subscribe(email);
      setSubscribed(true);
      toast.success(res.message || 'Check your email to confirm!');
      setEmail('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="my-20"
    >
      <div className="relative p-8 md:p-10 rounded-2xl bg-brand-surface dark:bg-brand-surface-dark border border-brand-border dark:border-brand-border-dark">
        <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-2 text-brand-text dark:text-brand-text-dark">
          Stay updated
        </h3>
        <p className="text-brand-muted dark:text-brand-muted-dark mb-6 max-w-md">
          Get notified when I publish new posts. No spam, unsubscribe anytime.
        </p>

        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-brand-accent dark:text-brand-accent-dark font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Check your email to confirm your subscription!
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 px-4 py-2.5 rounded-lg bg-brand-card dark:bg-brand-card-dark border border-brand-border dark:border-brand-border-dark text-brand-text dark:text-brand-text-dark placeholder:text-brand-muted/60 dark:placeholder:text-brand-muted-dark/60 text-sm outline-none focus:ring-2 focus:ring-brand-accent/30 dark:focus:ring-brand-accent-dark/30 focus:border-brand-accent/50 dark:focus:border-brand-accent-dark/50 transition-all duration-200"
              required
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-lg bg-brand-accent text-white text-sm font-medium hover:bg-amber-700 dark:bg-brand-accent-dark dark:text-brand-bg-dark dark:hover:bg-amber-400 transition-colors duration-200 disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    </motion.section>
  );
}
