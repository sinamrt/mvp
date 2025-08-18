// pages/login.tsx
import { useState } from 'react';

type LoginResponse = { message?: string };

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: LoginResponse = {};
      try {
        data = (await res.json()) as LoginResponse;
      } catch {
        // ignore if response has no JSON body
      }

      if (res.ok) {
        window.location.href = '/dashboard';
      } else {
        setError(data.message ?? 'Login failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || !email || !password;

  return (
    <div>
      <input
        data-testid="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Email Address"
      />
      <input
        data-testid="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        aria-label="Password"
      />
      <button
        data-testid="login-button"
        onClick={handleLogin}
        disabled={disabled}
        aria-busy={loading}
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
