// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

// Extend the built-in User type
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: "USER" | "ADMIN"; // 👈 match your Prisma Role enum
  }

  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
    } & DefaultSession["user"];
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    role?: "USER" | "ADMIN";
  }
}
