import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (session && isClient) {
      router.push("/");
    }
  }, [session, router, isClient]);

  // Prevent hydration mismatch
  if (!isClient) {
    return <p>Loading...</p>;
  }

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.email) newErrors.push("Email is required");
    if (!formData.password) newErrors.push("Password is required");
    if (!formData.name) newErrors.push("Name is required");

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.push("Invalid email format");
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.push("Password must be at least 8 characters");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // For now, we'll use NextAuth's email provider
      // This will send a magic link to the user's email
      const result = await signIn("email", {
        email: formData.email,
        name: formData.name,
        redirect: false,
      });

      if (result?.error) {
        setErrors([result.error]);
      } else {
        // Success - user should check their email
        alert("Check your email for a sign-in link!");
        router.push("/");
      }
    } catch (error) {
      setErrors(["Registration failed. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ 
      padding: "2rem", 
      fontFamily: "sans-serif",
      maxWidth: "400px",
      margin: "0 auto",
      marginTop: "2rem"
    }}>
      <h1>📝 Create Account</h1>
      
      <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="name" style={{ display: "block", marginBottom: "0.5rem" }}>
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
            placeholder="Enter your full name"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: "0.5rem" }}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
            placeholder="Enter your email address"
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: "0.5rem" }}>
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
            placeholder="Enter a password (min 8 characters)"
          />
        </div>

        {errors.length > 0 && (
          <div style={{ 
            marginBottom: "1rem",
            padding: "0.5rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px"
          }}>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: isSubmitting ? "#6c757d" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            fontSize: "1rem"
          }}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p>Or sign in with:</p>
        <button
          onClick={() => signIn("google")}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "0.5rem"
          }}
        >
          Google
        </button>
        <button
          onClick={() => signIn("github")}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#333",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          GitHub
        </button>
      </div>

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <p>
          Already have an account?{" "}
          <Link href="/" style={{ color: "#007bff", textDecoration: "none" }}>
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}

// Disable static generation for this page
export const getServerSideProps = () => {
  return {
    props: {},
  };
}; 