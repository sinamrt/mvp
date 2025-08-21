// pages/register.tsx
import { useState } from 'react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [ok, setOk] = useState(false);

  const handleRegister = async () => {
    setSubmitting(true); setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(()=>({}));
      if (res.ok) {
        setOk(true);
        // optional: redirect after short delay
        setTimeout(()=>{ window.location.href = '/dashboard'; }, 800);
      } else {
        setError(data?.error || data?.message || 'Registration failed');
      }
    } catch {
      setError('Network error, try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="form card">
        <div className="brand" style={{marginBottom:12}}>
          <div className="logo">M4V</div>
          <div>
            <div className="title">Create Your Account</div>
            <div className="subtitle">Join MEALS4V</div>
          </div>
        </div>

        <label htmlFor="name">Full Name</label>
        <input id="name" className="input" data-testid="name"
          value={name} onChange={(e)=>setName(e.target.value)} />

        <div className="spacer" />
        <label htmlFor="reg-email">Email Address</label>
        <input id="reg-email" className="input" data-testid="email" type="email"
          value={email} onChange={(e)=>setEmail(e.target.value)} />

        <div className="spacer" />
        <label htmlFor="reg-password">Password</label>
        <input id="reg-password" className="input" data-testid="password" type="password"
          value={password} onChange={(e)=>setPassword(e.target.value)} />

        <div className="spacer" />
        <button className="btn" data-testid="register-button"
          onClick={handleRegister} disabled={submitting} aria-busy={submitting}>
          {submitting ? 'Creating…' : 'Create Account'}
        </button>

        {ok && (
          <div role="alert" className="muted" data-testid="success-message" style={{marginTop:12}}>
            Registration successful! Redirecting…
          </div>
        )}
        {error && (
          <p role="alert" className="muted" data-testid="email-error" style={{marginTop:12}}>
            {error}
          </p>
        )}

        <div className="spacer" />
         
        <link className="btn-ghost" href="/api/auth/google" data-testid="register-google">
          Continue with Google
        </link>
      </div>
    </div>
  );
}
