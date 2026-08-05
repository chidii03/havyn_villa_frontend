"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          renderButton: (parent: HTMLElement, options: Record<string, string | number | boolean>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const initialized = useRef(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!scriptReady || !GOOGLE_CLIENT_ID || initialized.current || !window.google) return;

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response) => {
        if (!response.credential) return;

        setLoading(true);
        setError(null);
        try {
          await loginWithGoogle(response.credential);
          toast.success("Welcome to Havyn Villa!");
          window.location.assign("/");
        } catch (err) {
          setError(err instanceof ApiError ? err.message : "Google sign-in failed. Please try again.");
        } finally {
          setLoading(false);
        }
      },
    });
    if (buttonRef.current) {
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
        logo_alignment: "left",
        width: Math.min(buttonRef.current.clientWidth || 360, 400),
      });
    }
    initialized.current = true;
  }, [loginWithGoogle, scriptReady]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-muted">or</span>
        <div className="h-px flex-1 bg-line" />
      </div>
      {!GOOGLE_CLIENT_ID && (
        <p role="alert" className="text-sm text-danger">
          Add NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID to enable Google sign-in.
        </p>
      )}
      {GOOGLE_CLIENT_ID && !scriptReady && <div className="h-12 w-full animate-pulse rounded-full bg-muted" aria-hidden="true" />}
      <div
        ref={buttonRef}
        className="min-h-12 w-full overflow-hidden rounded-full [&_iframe]:block"
        aria-busy={loading || !scriptReady}
        hidden={!GOOGLE_CLIENT_ID || !scriptReady}
      />
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
    </div>
  );
}
