import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import AuthStatus from "../components/AuthStatus";
import React from 'react';
import Link from "next/link";

export default function LandingPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return <p>Loading...</p>;
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6">
      {/* Authentication Status */}
      <div style={{ 
        position: "absolute", 
        top: "1rem", 
        right: "1rem", 
        padding: "1rem", 
        backgroundColor: "#f8f9fa", 
        border: "1px solid #dee2e6", 
        borderRadius: "8px",
        zIndex: 1000
      }}>
        <AuthStatus />
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          <Link href="/register" style={{ color: "#007bff", textDecoration: "none" }}>
            Create Account
          </Link>
        </div>
      </div>

      <header className="w-full max-w-5xl flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-green-700">MEALS4V</h1>
        <Link href="/login" className="text-sm text-gray-700 hover:underline">Log In</Link>
      </header>

      <section className="text-center max-w-2xl">
        <h2 className="text-4xl font-bold mb-4">Personalized meal plans</h2>
        <p className="text-lg text-gray-700 mb-6">
          Meals4V creates personalized meal plans based on your food preferences, budget, and schedule.
          Reach your diet and nutritional goals with our calorie-smart meal planning.
        </p>

        <Link
          href="/get-started"
          className="inline-block px-6 py-3 bg-green-700 text-white rounded-lg font-semibold shadow hover:bg-green-800 transition"
        >
          Get Started
        </Link>

        <ul className="text-left mt-10 space-y-3">
          <li className="flex items-center">
            <span className="mr-2 text-green-700 font-bold">•</span> Food preferences
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-700 font-bold">•</span> Budget
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-green-700 font-bold">•</span> Schedule
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <img
          src="/meal-bowl.jpg"
          alt="Healthy meal bowl"
          className="w-80 h-auto rounded-xl shadow-md"
        />
      </section>
    </main>
  );
}

// Disable static generation for this page
export const getServerSideProps = () => {
  return {
    props: {},
  };
};
