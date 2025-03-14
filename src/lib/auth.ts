import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly",
        }
      },
    }),
    // ...add more providers here
  ],
  session: {
    strategy: 'jwt'
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        return ['thibautscholaert@gmail.com'].includes(profile.email)
      }
      return false; // Do different verification for other providers that don't have `email_verified`

    },
    async jwt({ token, account, user }) {
      console.log(token);
      if (account) {
        token.id = user?.id;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {

      if (session.user) {
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  }
}
