import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../../../lib/prisma';

// Extend NextAuth types directly in this file
declare module "next-auth" {
  interface Session {
    userId?: string
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string
    role?: string
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // keep default profile mapping
    }),
  ],
  
  pages: {
    signIn: '/login', // optional: send all sign-ins to your styled page
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      // Debug logging (remove after debugging)
      console.log('JWT callback - token:', JSON.stringify(token, null, 2));
      console.log('JWT callback - user:', user ? JSON.stringify(user, null, 2) : 'null');
      
      // Persist the user ID and role to the token right after signin
      if (user) {
        token.userId = user.id;
        token.role = user.role;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Debug logging (remove after debugging)
      console.log('Session callback - token:', JSON.stringify(token, null, 2));
      console.log('Session callback - session before:', JSON.stringify(session, null, 2));
      
      try {
        // Add userId and role to session - now with proper typing
        if (token?.userId) {
          session.userId = token.userId;
        } else if (token?.sub) {
          session.userId = token.sub;
        }
        
        if (token?.role && session.user) {
          session.user.role = token.role;
        }
        
        console.log('Session callback - session after:', JSON.stringify(session, null, 2));
      } catch (error) {
        console.error('Session callback error:', error);
      }
      
      return session;
    },
  },
  
  // Enable debug messages in development
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);