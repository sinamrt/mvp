import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1>404 — Page Not Found</h1>
      <Link href="/">Go Home</Link>
    </div>
  );
}
