// pages/login.tsx
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) window.location.href = '/dashboard';
    else setError(data.message || 'Login failed');
  };

  return (
    <div>
      <input data-testid="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input data-testid="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button data-testid="login-button" onClick={handleLogin}>Sign In</button>
      {error && <p>{error}</p>}
    </div>
  );
}
