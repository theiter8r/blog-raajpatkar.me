import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login',
};

export default function LoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <LoginForm />
    </div>
  );
}
