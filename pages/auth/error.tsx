import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;

  useEffect(() => {
    // For test purposes, expose error message in data-testid
    const errorElement = document.querySelector('[data-testid="error-message"]');
    if (errorElement) {
      errorElement.textContent = getErrorMessage(error as string);
    }
  }, [error]);

  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'CredentialsSignin':
        return 'Invalid email or password';
      case 'EmailExists':
        return 'Email already exists';
      case 'WeakPassword':
        return 'Password is too weak';
      case 'RequiredFields':
        return 'All fields are required';
      case 'NetworkError':
        return 'Network error occurred';
      default:
        return 'An error occurred during authentication';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600" data-testid="error-message">
            {getErrorMessage(error as string)}
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link href="/register" className="text-indigo-600 hover:text-indigo-500">
            Back to Registration
          </Link>
        </div>
      </div>
    </div>
  );
} 