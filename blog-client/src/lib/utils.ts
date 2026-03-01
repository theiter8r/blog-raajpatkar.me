import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Calculate reading time from markdown content.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadingTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Format a date string for display.
 * e.g. "Feb 18, 2026"
 */
export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Relative date (e.g. "3 days ago")
 */
export function relativeDate(dateString: string): string {
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  } catch {
    return dateString;
  }
}

/**
 * Generate an excerpt from content if one isn't provided.
 */
export function generateExcerpt(content: string, maxLength = 160): string {
  const plain = content
    .replace(/#{1,6}\s/g, '')
    .replace(/[*_~`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Validate email format.
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Slugify a string (for preview purposes).
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/**
 * Classnames utility (tiny cx replacement)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
