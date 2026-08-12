"use client";

import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/http";
import { useAuth } from "@/lib/auth/auth-provider";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            ux_mode?: "popup" | "redirect";
            redirect_uri?: string;
          }) => void;
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
  const [gsiReady, setGsiReady] = useState(false);
  const initialized = useRef(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  const { isMobileBrowser, isEmbeddedBrowser } = useMemo(() => {
    const ua = typeof navigator === "undefined" ? "" : navigator.userAgent;
    const embedded = /(Instagram|FBAN|FBAV|FB_IAB|FB4A|FB5A|Messenger|Line|WhatsApp|Snapchat|Pinterest|TikTok|LinkedIn|Twitter)/i.test(ua)
      || (/Android/i.test(ua) && /\bwv\b/i.test(ua));
    const mobile = /\b(Android|iPhone|iPad|iPod)\b/i.test(ua);
    return { isMobileBrowser: mobile, isEmbeddedBrowser: embedded };
  }, []);

  const shouldUseRedirect = isMobileBrowser && !isEmbeddedBrowser;

  useEffect(() => {
    if (!gsiReady || !GOOGLE_CLIENT_ID || initialized.current || !window.google?.accounts?.id) return;
    if (isEmbeddedBrowser) return;

    const options = {
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: { credential?: string }) => {
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
      ux_mode: shouldUseRedirect ? "redirect" : "popup",
      ...(shouldUseRedirect ? { redirect_uri: `${window.location.origin}${window.location.pathname}` } : {}),
    } as const;

    window.google.accounts.id.initialize(options);
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
  }, [loginWithGoogle, gsiReady, isEmbeddedBrowser, shouldUseRedirect]);

  const markGsiReady = () => {
    if (window.google?.accounts?.id) {
      setGsiReady(true);
      return;
    }

    const startedAt = Date.now();
    const intervalId = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(intervalId);
        setGsiReady(true);
      } else if (Date.now() - startedAt > 5000) {
        window.clearInterval(intervalId);
      }
    }, 50);
  };

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
      {GOOGLE_CLIENT_ID && gsiReady && (
        <div ref={buttonRef} className="min-h-12 w-full overflow-hidden rounded-full [&_iframe]:block" aria-busy={loading} />
      )}
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={markGsiReady} />
    </div>
  );
}
