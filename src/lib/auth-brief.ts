import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const ALLOWED_EMAILS = ['zmsmina@gmail.com', 'mina@olunix.com'];

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return ALLOWED_EMAILS.includes(profile?.email ?? '');
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: '/brief/login',
    error: '/brief/login',
  },
});
