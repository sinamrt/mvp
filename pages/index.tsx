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
      <header className="landing-header">
        <div className="header-container">
          <div className="header-content">
            <div className="flex items-center">
              <h1 className="header-logo">MEALS4V</h1>
            </div>
            
            {/* Navigation */}
            <nav className="header-nav">
              <Link href="#features" className="header-nav-link">
                Features
              </Link>
              <Link href="#how-it-works" className="header-nav-link">
                How It Works
              </Link>
              <Link href="#pricing" className="header-nav-link">
                Pricing
              </Link>
              <Link href="#contact" className="header-nav-link">
                Contact
              </Link>
            </nav>

            {/* Authentication Status */}
            <div className="header-actions">
              <div className="hidden md:block">
                <AuthStatus />
              </div>
              <Link href="/register" className="auth-btn auth-btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <div className="hero-text">
                <h2>Personalized meal plans for your lifestyle</h2>
                <p>
                  MEALS4V creates personalized meal plans based on your food preferences, budget, and schedule.
                  Reach your diet and nutritional goals with our calorie-smart meal planning.
                </p>
                <div className="hero-buttons">
                  <Link
                    href="/get-started"
                    className="btn btn-primary btn-large"
                  >
                    Start Your Journey
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="btn btn-secondary btn-large"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="hero-image">
                <img
                  src="/meal-bowl.jpg"
                  alt="Healthy meal bowl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          <div className="features-container">
            <div className="features-header">
              <h3 className="features-title">Why Choose MEALS4V?</h3>
              <p className="features-subtitle">
                Our platform combines advanced nutrition science with personalized preferences to create the perfect meal plan for you.
              </p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🍽️</div>
                <h4 className="feature-title">Food Preferences</h4>
                <p className="feature-description">
                  Tell us what you love and what you avoid. We&apos;ll create meals that match your taste perfectly.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">💰</div>
                <h4 className="feature-title">Budget Friendly</h4>
                <p className="feature-description">
                  Set your budget and we&apos;ll suggest meals that fit your financial goals without compromising nutrition.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⏰</div>
                <h4 className="feature-title">Flexible Schedule</h4>
                <p className="feature-description">
                  Whether you have 15 minutes or 2 hours, we&apos;ll adapt meal plans to your busy lifestyle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <div className="how-it-works-container">
            <div className="how-it-works-header">
              <h3 className="how-it-works-title">How It Works</h3>
              <p className="how-it-works-subtitle">
                Get your personalized meal plan in just 3 simple steps
              </p>
            </div>
            
            <div className="how-it-works-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h4 className="step-title">Tell Us About You</h4>
                <p className="step-description">
                  Share your dietary preferences, allergies, goals, and lifestyle to help us understand your needs.
                </p>
              </div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <h4 className="step-title">Get Your Plan</h4>
                <p className="step-description">
                  Our AI creates a personalized meal plan with recipes, shopping lists, and nutritional information.
                </p>
              </div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <h4 className="step-title">Cook & Enjoy</h4>
                <p className="step-description">
                  Follow our easy-to-follow recipes and enjoy delicious, healthy meals that fit your lifestyle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        {/* eslint-disable react/no-unescaped-entities */}
        <section className="testimonials-section">
          <div className="testimonials-container">
            <div className="testimonials-header">
              <h3 className="testimonials-title">What Our Users Say</h3>
            </div>
            
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">S</div>
                  <div className="testimonial-info">
                    <h5>Sarah M.</h5>
                    <p>Lost 15 lbs in 3 months</p>
                  </div>
                </div>
                <p className="testimonial-quote">
                  "MEALS4V completely changed my relationship with food. The personalized plans made healthy eating enjoyable and sustainable."
                </p>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">M</div>
                  <div className="testimonial-info">
                    <h5>Mike R.</h5>
                    <p>Busy professional</p>
                  </div>
                </div>
                <p className="testimonial-quote">
                  "As someone with a hectic schedule, MEALS4V's quick meal options have been a lifesaver. No more unhealthy takeout!"
                </p>
              </div>
              
              <div className="testimonial-card">
                <div className="testimonial-header">
                  <div className="testimonial-avatar">L</div>
                  <div className="testimonial-info">
                    <h5>Lisa K.</h5>
                    <p>Vegetarian</p>
                  </div>
                </div>
                <p className="testimonial-quote">
                  "Finally, a meal planning service that understands vegetarian nutrition! The variety of recipes is amazing."
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* eslint-enable react/no-unescaped-entities */}

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-container">
            <h3 className="cta-title">Ready to Transform Your Eating Habits?</h3>
            <p className="cta-description">
              Join thousands of users who have already achieved their health and nutrition goals with MEALS4V.
            </p>
            <Link
              href="/get-started"
              className="cta-button"
            >
              Start Your Free Trial
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="landing-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-brand">
              <h4>MEALS4V</h4>
              <p>
                Personalized meal planning for a healthier, happier you.
              </p>
            </div>
            
            <div className="footer-section">
              <h5>Product</h5>
              <ul>
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="/diet-form">Diet Form</Link></li>
                <li><Link href="/admin">Admin</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>Support</h5>
              <ul>
                <li><Link href="#contact">Contact Us</Link></li>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h5>Connect</h5>
              <ul>
                <li><Link href="https://twitter.com/meals4v">Twitter</Link></li>
                <li><Link href="https://facebook.com/meals4v">Facebook</Link></li>
                <li><Link href="https://instagram.com/meals4v">Instagram</Link></li>
                <li><Link href="mailto:hello@meals4v.com">Email</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 MEALS4V. All rights reserved.</p>
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
