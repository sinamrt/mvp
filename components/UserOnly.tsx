import { useSession, signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function UserOnly({ children }: { children: React.ReactNode }) {
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
        <p>You must be signed in to view this page.</p>
        <button onClick={() => signIn()}>Sign In</button>
      </div>
    );
  }

  return <>{children}</>;
} 