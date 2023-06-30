import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getTokenFromNodeBackend } from "../../../services/user/index";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_ID,
      clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    }),
  ],

  callbacks: {
    async session({ session }) {
      const token = await getTokenFromNodeBackend({
        email: session.user.email,
        name: session.user.name,
      });

      session.accessToken = token;
      return session;
    },
  },
};

export default NextAuth(authOptions);
