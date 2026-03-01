export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Raaj's Blog";
export const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  'Thoughts on engineering, design, and building great software.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
] as const;

export const POSTS_PER_PAGE = 10;
