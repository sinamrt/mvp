import { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-700">MEALS4V</h1>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-green-700 transition">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-green-700 transition">
                How It Works
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-green-700 transition">
                Pricing
              </Link>
              <Link href="#contact" className="text-gray-700 hover:text-green-700 transition">
                Contact
              </Link>
            </nav>

            {/* Authentication Status */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <AuthStatus />
              </div>
              <Link href="/register" className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6">
                  Personalized meal plans for your lifestyle
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  MEALS4V creates personalized meal plans based on your food preferences, budget, and schedule.
                  Reach your diet and nutritional goals with our calorie-smart meal planning.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/get-started"
                    className="bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-800 transition"
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="border-2 border-green-700 text-green-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="/meal-bowl.jpg"
                  alt="Healthy meal bowl"
                  className="w-96 h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose MEALS4V?
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our platform combines advanced nutrition science with personalized preferences to create the perfect meal plan for you.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg bg-gray-50">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🍽️</span>
                </div>
                <h4 className="text-xl font-semibold mb-3">Food Preferences</h4>
                <p className="text-gray-600">
                  Tell us what you love and what you avoid. We&apos;ll create meals that match your taste perfectly.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="text-xl font-semibold mb-3">Budget Friendly</h4>
                <p className="text-gray-600">
                  Set your budget and we&apos;ll suggest meals that fit your financial goals without compromising nutrition.
                </p>
              </div>
              
              <div className="text-center p-6 rounded-lg bg-gray-50">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h4 className="text-xl font-semibold mb-3">Flexible Schedule</h4>
                <p className="text-gray-600">
                  Whether you have 15 minutes or 2 hours, we&apos;ll adapt meal plans to your busy lifestyle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h3>
              <p className="text-xl text-gray-600">
                Get your personalized meal plan in just 3 simple steps
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-700 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <h4 className="text-xl font-semibold mb-3">Tell Us About You</h4>
                <p className="text-gray-600">
                  Share your dietary preferences, allergies, goals, and lifestyle to help us understand your needs.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-green-700 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <h4 className="text-xl font-semibold mb-3">Get Your Plan</h4>
                <p className="text-gray-600">
                  Our AI creates a personalized meal plan with recipes, shopping lists, and nutritional information.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-green-700 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  3
                </div>
                <h4 className="text-xl font-semibold mb-3">Cook & Enjoy</h4>
                <p className="text-gray-600">
                  Follow our easy-to-follow recipes and enjoy delicious, healthy meals that fit your lifestyle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* eslint-disable react/no-unescaped-entities */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                What Our Users Say
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-700 font-semibold">S</span>
                  </div>
                  <div>
                    <h5 className="font-semibold">Sarah M.</h5>
                    <p className="text-sm text-gray-600">Lost 15 lbs in 3 months</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "MEALS4V completely changed my relationship with food. The personalized plans made healthy eating enjoyable and sustainable."
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-700 font-semibold">M</span>
                  </div>
                  <div>
                    <h5 className="font-semibold">Mike R.</h5>
                    <p className="text-sm text-gray-600">Busy professional</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "As someone with a hectic schedule, MEALS4V's quick meal options have been a lifesaver. No more unhealthy takeout!"
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-green-700 font-semibold">L</span>
                  </div>
                  <div>
                    <h5 className="font-semibold">Lisa K.</h5>
                    <p className="text-sm text-gray-600">Vegetarian</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Finally, a meal planning service that understands vegetarian nutrition! The variety of recipes is amazing."
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* eslint-enable react/no-unescaped-entities */}

        {/* CTA Section */}
        <section className="py-20 bg-green-700">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Eating Habits?
            </h3>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of users who have already achieved their health and nutrition goals with MEALS4V.
            </p>
            <Link
              href="/get-started"
              className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-100 transition"
            >
              Start Your Free Trial
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold text-green-400 mb-4">MEALS4V</h4>
              <p className="text-gray-400">
                Personalized meal planning for a healthier, happier you.
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Product</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/diet-form" className="hover:text-white transition">Diet Form</Link></li>
                <li><Link href="/admin" className="hover:text-white transition">Admin</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#contact" className="hover:text-white transition">Contact Us</Link></li>
                <li><Link href="/help" className="hover:text-white transition">Help Center</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">Connect</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="https://twitter.com/meals4v" className="hover:text-white transition">Twitter</Link></li>
                <li><Link href="https://facebook.com/meals4v" className="hover:text-white transition">Facebook</Link></li>
                <li><Link href="https://instagram.com/meals4v" className="hover:text-white transition">Instagram</Link></li>
                <li><Link href="mailto:hello@meals4v.com" className="hover:text-white transition">Email</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MEALS4V. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Disable static generation for this page
export const getServerSideProps = () => {
  return {
    props: {},
  };
};
