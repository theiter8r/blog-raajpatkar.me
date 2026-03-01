import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-brand-border dark:border-brand-border-dark">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-brand-muted dark:text-brand-muted-dark">
            &copy; {year} {SITE_NAME}
          </p>
          <div className="flex items-center gap-6 text-sm text-brand-muted dark:text-brand-muted-dark">
            <Link
              href="/"
              className="hover:text-brand-text dark:hover:text-brand-text-dark transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="hover:text-brand-text dark:hover:text-brand-text-dark transition-colors duration-200"
            >
              About
            </Link>
            <Link
              href="/rss.xml"
              className="hover:text-brand-text dark:hover:text-brand-text-dark transition-colors duration-200"
            >
              RSS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
