'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/lib/api';
import toast from 'react-hot-toast';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await adminLogin({ email, password });
      toast.success('Welcome back!');
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-3xl font-medium text-brand-text dark:text-brand-text-dark mb-2 text-center">
          Admin
        </h1>
        <p className="text-sm text-brand-muted dark:text-brand-muted-dark mb-8 text-center">
          Sign in to manage your blog
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border dark:border-brand-border-dark bg-white dark:bg-brand-card-dark text-brand-text dark:text-brand-text-dark placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-text dark:text-brand-text-dark mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border dark:border-brand-border-dark bg-white dark:bg-brand-card-dark text-brand-text dark:text-brand-text-dark placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-accent/30 focus:border-brand-accent transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-brand-accent text-white font-medium text-sm hover:bg-brand-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  );
}