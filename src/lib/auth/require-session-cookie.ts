import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const REFRESH_COOKIE_NAME = "havyn_refresh";

/**
 * Fast-path server guard for protected route layouts — redirects before any client JS
 * loads if there's no refresh cookie at all.
 *
 * This is deliberately NOT the authoritative check (the cookie could be stale/expired)
 * and it deliberately does not call the backend's /auth/refresh here: that endpoint
 * rotates the token, but Server Components cannot set cookies during render (see
 * Next.js `cookies()` docs), so a server-side rotation would mint a token the browser
 * could never actually receive. {@link RequireAuth} (client) performs the real check
 * via AuthProvider's own silent refresh once it resolves — this just avoids
 * server-rendering protected content for the common case of "definitely signed out."
 */
export async function requireSessionCookie(redirectTo = "/login") {
  const cookieStore = await cookies();
  if (!cookieStore.has(REFRESH_COOKIE_NAME)) {
    redirect(redirectTo);
  }
}
