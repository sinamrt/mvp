import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
  }
  
  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    sub?: string;
  }
}

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
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (existingUser) {
            // User exists, verify password
            if (!existingUser.passwordHash) {
              console.error("User exists but no password hash found");
              throw new Error("Invalid login method");
            }

            const isValidPassword = await bcrypt.compare(
              credentials.password,
              existingUser.passwordHash
            );
            
            if (!isValidPassword) {
              console.error("Invalid password for user:", credentials.email);
              throw new Error("Invalid credentials");
            }

            return {
              id: existingUser.id,
              email: existingUser.email,
              name: existingUser.name || "",
              role: existingUser.role,
            };
          } else {
            // New user registration
            if (!credentials.name) {
              throw new Error("Name is required for registration");
            }

            const hashedPassword = await bcrypt.hash(credentials.password, 12);
            
            const newUser = await prisma.user.create({
              data: {
                email: credentials.email,
                name: credentials.name,
                passwordHash: hashedPassword,
                role: "USER",
              },
            });

            console.log("New user created:", newUser.email);

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name || "",
              role: newUser.role,
            };
          }
        } catch (error) {
          console.error("Auth error:", error);
          // Throw specific error messages
          if (error instanceof Error) {
            throw error;
          }
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("Sign in attempt:", { user: user.email, provider: account?.provider });
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role || "USER";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
