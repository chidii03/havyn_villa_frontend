"use client";

import type { AuthResponse, UserSummary } from "@havyn/shared";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import * as authApi from "@/lib/api/auth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: UserSummary | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Re-fetch /me — e.g. after email verification changes emailVerified. */
  refreshUser: () => Promise<void>;
  /**
   * Apply a session envelope returned by any endpoint shaped like login/register
   * (same `{ accessToken, refreshToken, expiresIn, user }` envelope) without a second
   * round trip — e.g. `POST /host/onboarding` re-mints tokens reflecting a newly
   * granted role, and this is how that new access token/roles reach the rest of the
   * app immediately.
   */
  applySession: (session: AuthResponse) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const REFRESH_MARGIN_MS = 60_000; // rotate ~1 minute before the access token actually expires

/**
 * Access token lives only in React state (never localStorage — see
 * project-docs/security/01-security-plan.md). On mount it silently calls
 * POST /auth/refresh (the browser sends the httpOnly cookie automatically), then
 * re-arms itself on a timer before every expiry.
 *
 * Known limitation (documented, not fixed here): refresh token rotation is
 * per-browser-tab. Two tabs refreshing at close to the same moment can race — the
 * loser's rotation looks like reuse of an already-rotated token and gets signed out.
 * The standard fix is a cross-tab leader election (BroadcastChannel/Web Locks) so
 * only one tab ever rotates; out of scope for this pass — see
 * frontend/01-frontend-foundation.md.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<UserSummary | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // scheduleRefresh and silentRefresh call each other (refresh re-arms the timer;
  // the timer triggers another refresh). A ref breaks the cycle so neither useCallback
  // needs to close over a value declared after it.
  const silentRefreshRef = useRef<() => Promise<void>>(() => Promise.resolve());

  const scheduleRefresh = useCallback((expiresInSeconds: number) => {
    if (refreshTimer.current) {
      clearTimeout(refreshTimer.current);
    }
    const delay = Math.max(expiresInSeconds * 1000 - REFRESH_MARGIN_MS, 5_000);
    refreshTimer.current = setTimeout(() => {
      void silentRefreshRef.current();
    }, delay);
  }, []);

  const silentRefresh = useCallback(async () => {
    try {
      const session = await authApi.refresh();
      setAccessToken(session.accessToken);
      setUser(session.user);
      setStatus("authenticated");
      scheduleRefresh(session.expiresIn);
    } catch {
      setAccessToken(null);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [scheduleRefresh]);

  useEffect(() => {
    silentRefreshRef.current = silentRefresh;
  }, [silentRefresh]);

  useEffect(() => {
    void silentRefreshRef.current();
    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await authApi.login({ email, password });
      setAccessToken(session.accessToken);
      setUser(session.user);
      setStatus("authenticated");
      scheduleRefresh(session.expiresIn);
    },
    [scheduleRefresh],
  );

  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const session = await authApi.googleLogin(idToken);
      setAccessToken(session.accessToken);
      setUser(session.user);
      setStatus("authenticated");
      scheduleRefresh(session.expiresIn);
    },
    [scheduleRefresh],
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      const session = await authApi.register({ email, password, fullName });
      setAccessToken(session.accessToken);
      setUser(session.user);
      setStatus("authenticated");
      scheduleRefresh(session.expiresIn);
    },
    [scheduleRefresh],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Best-effort server-side revoke — client-side state clears below regardless,
      // so a network failure here shouldn't surface as an unhandled rejection to
      // callers that fire-and-forget this (e.g. ProfileMenu's `onClick`).
    } finally {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }
      setAccessToken(null);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!accessToken) {
      return;
    }
    setUser(await authApi.getMe(accessToken));
  }, [accessToken]);

  const applySession = useCallback(
    (session: AuthResponse) => {
      setAccessToken(session.accessToken);
      setUser(session.user);
      setStatus("authenticated");
      scheduleRefresh(session.expiresIn);
    },
    [scheduleRefresh],
  );

  return (
    <AuthContext.Provider value={{ status, user, accessToken, login, loginWithGoogle, register, logout, refreshUser, applySession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
