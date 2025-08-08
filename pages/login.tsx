'use client'; // Use this if you're in `app/` directory

import { useState } from 'react';
import type { NextApiRequest, NextApiResponse } from 'next';

export  function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email, password } = req.body;

  // Dummy login — replace with real check later
  if (email === 'user@example.com' && password === 'SecurePass123!') {
    // Set a simple session cookie for 1 hour
    res.setHeader('Set-Cookie', [
      `session=ok; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600`,
    ]);
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
}
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      // Redirect to a protected page after login
      window.location.href = '/dashboard'; // Or your desired route
    } else {
      const data = await res.json();
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <input
        type="email"
        data-testid="email"
        placeholder="Email"
        className="w-full p-2 border mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        data-testid="password"
        placeholder="Password"
        className="w-full p-2 border mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        data-testid="login-button"
        onClick={handleLogin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Sign In
      </button>

      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}
