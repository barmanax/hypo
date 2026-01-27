import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "database" },
  callbacks: {
    async session({ session, user }) {
      // Make user.id available in server code and API routes
      if (session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },
});
