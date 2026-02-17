import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import '../src/app/globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
      <SpeedInsights />
    </SessionProvider>
  );
} 