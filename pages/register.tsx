import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [networkError, setNetworkError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors on input change
    setErrorMessage("");
    setNetworkError(false);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setNetworkError(false);
    
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
      } else {
        // Show success message briefly before redirect
        const successMessage = document.querySelector('[data-testid="success-message"]') as HTMLElement;
        if (successMessage) {
          successMessage.style.display = 'block';
        }
        setTimeout(() => router.push("/diet-form"), 500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setNetworkError(true);
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = (provider: string) => {
    signIn(provider, { callbackUrl: "/diet-form" });
  };

  if (!isClient) {
    return <div className="page-loading" data-testid="loading-spinner"><div className="spinner"></div></div>;
  }

  const getPasswordStrength = (password: string): string => {
    if (password.length < 8) return 'weak';
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;
    return strength <= 2 ? 'weak' : strength === 3 ? 'medium' : 'strong';
  };

  // Helper function to convert boolean to "true"/"false" string
  const toAriaInvalid = (condition: boolean): "true" | "false" => condition ? "true" : "false";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="auth-form">
        <div className="form-header">
          <h1 className="form-title">Create Your Account</h1>
          <p className="form-subtitle">
            Join MEALS4V to get personalized meal plans tailored to your preferences and goals.
          </p>
        </div>

        <form onSubmit={handleEmailSignIn} noValidate>
          <div className="form-group">
            <label htmlFor="name" className="form-label required">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              required
              maxLength={100}
              data-testid="name"
              aria-invalid={toAriaInvalid(!formData.name)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label required">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              required
              data-testid="email"
              aria-invalid={toAriaInvalid(!!formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))}
            />
            {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
              <span className="error-message" data-testid="email-error" role="alert">
                Please enter a valid email address
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label required">Password</label>
            <div className="password-input-wrapper">
            <input
                type={passwordVisible ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              required
              minLength={8}
                data-testid="password"
                aria-invalid={toAriaInvalid(formData.password.length < 8)}
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="password-toggle"
                data-testid="toggle-password"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
            {formData.password && (
              <div data-testid="password-strength" className={`password-strength ${getPasswordStrength(formData.password)}`}>
                Password Strength: {getPasswordStrength(formData.password)}
              </div>
            )}
            <div data-testid="password-requirements" className="password-requirements">
              Password must:
              <ul role="list">
                <li className={formData.password.length >= 8 ? 'met' : ''}>Be at least 8 characters</li>
                <li className={/[A-Z]/.test(formData.password) ? 'met' : ''}>Include uppercase letter</li>
                <li className={/\d/.test(formData.password) ? 'met' : ''}>Include number</li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) ? 'met' : ''}>Include special character</li>
              </ul>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label required">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="form-input"
              required
              minLength={8}
              data-testid="confirm-password"
              aria-invalid={toAriaInvalid(!!formData.confirmPassword && formData.password !== formData.confirmPassword)}
            />
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <span className="error-message" data-testid="password-match-error" role="alert">
                Passwords do not match
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="form-btn form-btn-primary"
            disabled={isLoading}
            data-testid="register-button"
          >
            {isLoading ? (
              <span data-testid="loading-spinner" className="spinner-small"></span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Error Messages */}
          {errorMessage && (
            <div data-testid="error-message" className="error-message" role="alert">
              {errorMessage}
            </div>
          )}
          {networkError && (
            <div data-testid="network-error" className="error-message" role="alert">
              Network error. Please check your connection.
            </div>
          )}
          <div data-testid="success-message" className="success-message" style={{ display: 'none' }} role="alert">
            Registration successful! Redirecting...
          </div>
        </form>

        <div className="oauth-section">
          <div className="oauth-divider">
            <span>or continue with</span>
          </div>

          <button
            onClick={() => handleOAuthSignIn("google")}
            className="oauth-btn oauth-btn-google"
            type="button"
          >
            <svg className="oauth-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleOAuthSignIn("github")}
            className="oauth-btn oauth-btn-github"
            type="button"
          >
            Continue with GitHub
          </button>
        </div>
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