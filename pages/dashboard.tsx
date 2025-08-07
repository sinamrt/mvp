// pages/dashboard.tsx

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="max-w-2xl mx-auto mt-16 text-center">
      <h1 data-testid="user-greeting" className="text-3xl font-bold mb-4">
        🎉 Welcome to your dashboard!
      </h1>
      <p className="text-lg text-gray-600">
        You are successfully logged in.
      </p>
    </div>
  );
}
