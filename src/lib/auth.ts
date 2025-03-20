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
        // return ['thibautscholaert@gmail.com'].includes(profile.email)
        return true;
      }
      return false; // Do different verification for other providers that don't have `email_verified`

    },
    async jwt({ token, account, user }) {
      console.log('account', account);
      if (account) {
        token.id = user?.id;
        token.accessToken = account.access_token;
      }

      const valid = await validateToken(token.accessToken as string);

        return valid ? token : {};
     

    },
    async session({ session, token }) {
      if (!token.accessToken) {
        throw new Error("Session expired. Please log in again.");
      }

      if (session.user) {
        session.user.accessToken = token.accessToken as string;
      }
      return session;
    },
  }
}

const validateToken = async (token?: string): Promise<boolean> => {
  let valid = false;
    if(token){
      console.log('token validation', token);
        try {
            // Call Google API to validate the token
            const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
            const data = await response.json();
            console.log('token validation data', data);
            if (data.error || data.error_description) {
                console.error(data.error || data.error_description);
            } else {
              valid = true;
            }
        } catch (error) {
            console.log(error);
        }
    }
    console.log('token validation valid', valid);

    return valid;
};
