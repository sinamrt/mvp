import { useSession, signIn } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

export default function AdminOnly({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return <p>Loading...</p>;
  }

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    return (
      <div>
        <p>You must be signed in as an admin to view this page.</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  const userRole = (session.user as typeof session.user & { role?: string }).role;
  if (userRole !== "ADMIN") {
    return <p>Access denied. Admins only.</p>;
  }

  return <>{children}</>;
} 