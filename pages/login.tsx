// pages/login.tsx
import { useState } from 'react';
import Head from 'next/head';

// Optional: if you use next-auth and want to redirect authed users server-side,
// keep this safe and never throw if session lookup fails.
// Remove this block entirely if you don't use next-auth.
/*
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
export async function getServerSideProps() {
  try {
    const session = await getServerSession({ req: null as any, res: null as any }, authOptions);
    if (session?.user) {
      return { redirect: { destination: '/dashboard', permanent: false } };
    }
  } catch (err) {
    console.error('getServerSideProps(/login) failed:', err);
    // Never throw; always render the login page.
  }
  return { props: {} };
}
*/

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return; // guard double clicks
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Keep body minimal and explicit
        body: JSON.stringify({ email, password }),
      });

      // Try to parse JSON safely
      let data: any = {};
      try {
        data = await res.json();
      } catch {
        // Non-JSON response; leave data as empty object
      }

      if (res.ok) {
        // Prefer router push if you’re using next/router; window.location is fine too.
        window.location.href = '/dashboard';
        return;
      }

      // Show server-provided message or a safe fallback
      setError(data?.message || 'Login failed. Please try again.');
    } catch (err) {
      console.error('Client login error:', err);
      setError('Unable to reach the server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Head>
        <title>Sign In • MEALS4V</title>
        <meta name="robots" content="noindex" />
      </Head>

      <main aria-labelledby="loginHeading" className="container">
        <h1 id="loginHeading" className="sr-only">Sign In</h1>

        <form onSubmit={handleLogin} data-testid="login-form" noValidate>
          <label htmlFor="email" className="sr-only">Email address</label>
          <input
            id="email"
            data-testid="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!error}
          />

          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            data-testid="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={!!error}
          />

          <button
            data-testid="login-button"
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
          >
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>

          {/* A11y-friendly error surface for tests */}
          {error && (
            <p
              role="alert"
              data-testid="login-error"
              aria-live="assertive"
              style={{ color: '#b00020', marginTop: 8 }}
            >
              {error}
            </p>
          )}
        </form>

        <style jsx>{`
          .container {
            max-width: 420px;
            margin: 48px auto;
            padding: 0 16px;
            display: grid;
            gap: 12px;
          }
          input, button {
            padding: 10px 12px;
            font-size: 16px;
          }
          button[disabled] {
            opacity: 0.7;
            cursor: not-allowed;
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
        `}</style>
      </main>
    </>
  );
}
