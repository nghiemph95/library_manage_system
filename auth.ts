import NextAuth from "next-auth";
import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { compare } from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import config from "@/lib/config";

const nextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);

        if (user.length === 0) return null;

        const plainPassword = credentials.password.toString().trim();
        const storedHash = String(user[0].password ?? "");
        if (!storedHash.startsWith("$2a$") && !storedHash.startsWith("$2b$")) {
          return null;
        }
        const isPasswordValid = await compare(plainPassword, storedHash);

        if (!isPasswordValid) return null;

        return {
          id: user[0].id.toString(),
          email: user[0].email,
          name: user[0].fullName,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: { id?: string; name?: string | null; email?: string | null };
    }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }

      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = (token.email as string) ?? session.user.email;
        session.user.isGuest =
          !!config.env.guestEmail &&
          session.user.email === config.env.guestEmail;
      }

      return session;
    },
  },
};

const nextAuth = (
  NextAuth as (config: typeof nextAuthConfig) => {
    handlers: { GET: (req: Request) => Promise<Response>; POST: (req: Request) => Promise<Response> };
    signIn: (provider?: string, options?: { redirect?: boolean; email?: string; password?: string }) => Promise<{ error?: string } | undefined>;
    signOut: (options?: { redirect?: boolean }) => Promise<unknown>;
    auth: () => Promise<Session | null>;
  }
)(nextAuthConfig);

export const handlers = nextAuth.handlers;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
export const auth = nextAuth.auth;
