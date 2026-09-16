import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Extend NextAuth types to carry isAdmin through token → session
declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin: boolean;
    }
  }
  interface User {
    isAdmin?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    // Persist isAdmin into the JWT on sign-in
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin ?? false;
      }
      return token;
    },
    // Expose id and isAdmin on the session object
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.isAdmin = token.isAdmin ?? false;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);


// JWT type extension must live in a separate declare module block
declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
  }
}
