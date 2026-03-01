'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { confirmSubscription } from '@/lib/api';

export default function ConfirmPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) return;

    confirmSubscription(token)
      .then((data) => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch((err: Error) => {
        setStatus('error');
        setMessage(err.message || 'Confirmation failed. The link may be invalid or expired.');
      });
  }, [token]);

  return (
    <main className="max-w-3xl mx-auto px-6 py-32 text-center">
      {status === 'loading' && (
        <>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-brand-text dark:text-brand-text-dark mb-4">
            Confirming…
          </h1>
          <p className="text-lg text-brand-muted dark:text-brand-muted-dark">
            Please wait while we confirm your subscription.
          </p>
        </>
      )}

      {status === 'success' && (
        <>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-brand-text dark:text-brand-text-dark mb-4">
            You&apos;re subscribed!
          </h1>
          <p className="text-lg text-brand-muted dark:text-brand-muted-dark mb-8">
            {message}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-brand-accent hover:text-brand-accent/80 transition-colors font-medium"
          >
            <span aria-hidden="true">&larr;</span>
            Back to home
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="font-serif text-4xl md:text-5xl font-medium text-brand-text dark:text-brand-text-dark mb-4">
            Confirmation failed
          </h1>
          <p className="text-lg text-brand-muted dark:text-brand-muted-dark mb-8">
            {message}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-brand-accent hover:text-brand-accent/80 transition-colors font-medium"
          >
            <span aria-hidden="true">&larr;</span>
            Back to home
          </Link>
        </>
      )}
    </main>
  );
}
