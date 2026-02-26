import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Invalid email or password',
  EmailExists:       'Email already exists',
  WeakPassword:      'Password is too weak',
  RequiredFields:    'All fields are required',
  NetworkError:      'Network error occurred',
};

export default function AuthError() {
  const router     = useRouter();
  const errorCode  = router.isReady ? (router.query.error as string) : '';
  const message    = ERROR_MESSAGES[errorCode] ?? 'An error occurred during authentication';

  useEffect(() => {
    const el = document.querySelector('[data-testid="error-message"]');
    if (el) el.textContent = message;
  }, [message]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600" data-testid="error-message">
            {message}
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

export const getServerSideProps = async () => {
  return { props: {} };
};