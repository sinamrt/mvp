// pages/dashboard.tsx
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }, [router]);

  return (
    <div className="max-w-xl mx-auto mt-20 text-center">
      <h1 data-testid="user-greeting" className="text-3xl font-bold mb-4">
        🎉 Welcome to your dashboard!
      </h1>
      <p className="text-gray-600 mb-6">You are now logged in.</p>
      <button
        data-testid="logout-button"
        onClick={handleLogout}
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
      >
        Sign Out
      </button>
    </div>
  );
}
