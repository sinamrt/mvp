import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

function AuthStatusClient() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    return <button onClick={() => signIn()}>Sign In</button>;
  }

  const userRole = (session.user as typeof session.user & { role?: string }).role;

  return (
    <div>
      <span>
        Signed in as {session.user?.email} ({userRole})
      </span>
      <button onClick={() => signOut()} style={{ marginLeft: 8 }}>
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
    return <p>Loading...</p>;
  }

  return <AuthStatusClient />;
} 