import { useSession, signIn } from "next-auth/react";
import React, { ReactNode } from "react";

export default function AdminOnly({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

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
  if (userRole !== "admin") {
    return <p>Access denied. Admins only.</p>;
  }

  return <>{children}</>;
} 