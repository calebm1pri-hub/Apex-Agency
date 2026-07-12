import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

/**
 * Auth.js (NextAuth v5) config.
 *
 * Ships with a demo Credentials provider so you can build/run without a
 * provider set up. For production, add Google/Email/Passkey providers and set
 * AUTH_SECRET. Swap the `authorize` stub for a real Supabase lookup.
 *
 * Add providers like:
 *   import Google from "next-auth/providers/google"
 *   providers: [Google, ...]
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/account" },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // DEMO ONLY — accept any email, no password check.
        // TODO: verify against Supabase `auth.users` / your users table.
        if (!credentials?.email) return null;
        return {
          id: String(credentials.email),
          email: String(credentials.email),
          name: String(credentials.email).split("@")[0],
        };
      },
    }),
  ],
});
