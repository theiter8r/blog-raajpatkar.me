'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export default function Button({
  children,
  variant = 'default',
  size = 'md',
  loading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    default:
      'border border-brand-border dark:border-brand-border-dark bg-brand-card dark:bg-brand-card-dark text-brand-text dark:text-brand-text-dark hover:bg-brand-hover dark:hover:bg-brand-hover-dark rounded-lg',
    primary:
      'bg-brand-accent text-white hover:bg-amber-700 dark:bg-brand-accent-dark dark:hover:bg-amber-400 dark:text-brand-bg-dark rounded-lg',
    ghost:
      'text-brand-muted dark:text-brand-muted-dark hover:text-brand-text dark:hover:text-brand-text-dark hover:bg-brand-hover dark:hover:bg-brand-hover-dark rounded-lg',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  );
}
