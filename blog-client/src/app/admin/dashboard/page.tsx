import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
};

export default function DashboardPage() {
  return <DashboardClient />;
}
