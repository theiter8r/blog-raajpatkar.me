import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn more about this blog and the person behind it.',
};

export default function AboutPage() {
  return <AboutContent />;
}
