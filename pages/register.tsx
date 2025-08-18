import { useState } from "react";
import { signIn } from "next-auth/react";

export default function RegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step 1: Register user
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      // Step 2: Auto-login immediately
      await signIn("credentials", {
        redirect: true,
        email,
        password,
      });
    } else {
      const data = await res.json();
      setError(data.error || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      <button type="submit">Create Account</button>
      {error && <p>{error}</p>}
    </form>
  );
}
