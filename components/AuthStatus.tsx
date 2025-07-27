import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

function AuthStatusClient() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="auth-loading"><div className="auth-spinner"></div></div>;

  if (!session) {
    return (
      <div className="auth-status-content">
        <button onClick={() => signIn()} className="auth-btn auth-btn-primary">
          Sign In
        </button>
      </div>
    );
  }

  const userRole = (session.user as typeof session.user & { role?: string }).role;

  return (
    <div className="auth-status-content">
      <div className="auth-status-text">
        Signed in as <span className="auth-status-email">{session.user?.email}</span>
        {userRole && <span className="auth-status-role"> ({userRole})</span>}
      </div>
      <button onClick={() => signOut()} className="auth-btn auth-btn-outline">
        Sign Out
      </button>
    </div>
  );
}

export default function AuthStatus() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return <div className="auth-loading"><div className="auth-spinner"></div></div>;
  }

  return <AuthStatusClient />;
} 