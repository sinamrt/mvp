import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Head from 'next/head';

export default function LoginPage() {
  const [busy, setBusy] = useState(false);
  const handleGoogle = async () => {
    try {
      setBusy(true);
      await signIn('google', { callbackUrl: '/dashboard' });
    } finally {
      // NextAuth will redirect away; this is just defensive.
      setBusy(false);
    }
  };

  return (
    <>
      <Head><title>Sign In • MEALS4V</title></Head>
      <main className="min-h-screen flex items-center justify-center bg-[var(--background)] px-6">
        <div className="w-full max-w-md rounded-xl shadow-[var(--elevation-2)] bg-[var(--card-background)] p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-[var(--text)]">Welcome back</h1>
            <p className="text-[var(--text-muted)] mt-1">Sign in to continue</p>
          </div>

          <button
            data-testid="oauth-google"
            onClick={handleGoogle}
            disabled={busy}
            aria-busy={busy}
            className={`w-full inline-flex items-center justify-center gap-3 h-11 rounded-lg border border-[var(--input-border-color)] bg-white hover:bg-[var(--input-hover)] transition ${
              busy ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {/* Google "G" */}
            <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.32 0-6.02-2.75-6.02-6.15C6 8.75 8.68 6 12 6c1.9 0 3.18.8 3.91 1.5l2.67-2.57C17.32 3.5 14.9 2.5 12 2.5 6.98 2.5 3 6.57 3 12s3.98 9.5 9 9.5c5.2 0 8.64-3.65 8.64-8.79 0-.59-.06-1.04-.13-1.51H12z"/>
            </svg>
            <span className="text-sm font-medium text-[var(--text)]">
              {busy ? 'Redirecting…' : 'Continue with Google'}
            </span>
          </button>

          <div className="mt-6 text-center text-[var(--text-muted)] text-sm">
            By continuing, you agree to our&nbsp;
            <a href="/terms" className="underline">Terms</a> and&nbsp;
            <a href="/privacy" className="underline">Privacy Policy</a>.
          </div>
        </div>
      </main>
    </>
  );
}
