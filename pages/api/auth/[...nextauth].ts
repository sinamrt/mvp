import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Here you could check if the user is allowed to sign in
      return true;
    },
    async session({ session, token, user }) {
      // Attach role to session (default to 'user')
      if (session.user) {
        const role = typeof token.role === 'string' ? token.role : 'user';
        (session.user as typeof session.user & { role?: string }).role = role;
      }
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      // Assign a default role to the token if not present
      if (!token.role) {
        token.role = 'user';
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
