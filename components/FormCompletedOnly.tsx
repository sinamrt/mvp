import { useSession, signIn } from "next-auth/react";
import React, { useEffect, useState } from "react";

function checkFormCompleted(): boolean {
  // Check localStorage for a 'formCompleted' flag
  if (typeof window !== "undefined") {
    return localStorage.getItem("formCompleted") === "true";
  }
  return false;
}

export default function FormCompletedOnly({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [formCompleted, setFormCompleted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setFormCompleted(checkFormCompleted());
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

  if (!formCompleted) {
    return <p>You must complete the onboarding form to access this content.</p>;
  }

  return <>{children}</>;
} 