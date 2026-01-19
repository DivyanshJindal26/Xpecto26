"use client";
import { useEffect, useRef } from "react";

export default function GoogleOneTap() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("VITE_GOOGLE_CLIENT_ID is not set");
      return;
    }

    const loadGoogleScript = () => {
      return new Promise((resolve, reject) => {
        if (window.google?.accounts?.id) {
          resolve();
          return;
        }

        const existingScript = document.getElementById("google-one-tap");
        if (existingScript) {
          existingScript.onload = resolve;
          return;
        }

        const script = document.createElement("script");
        script.id = "google-one-tap";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initOneTap = async () => {
      if (initializedRef.current) return;

      try {
        await loadGoogleScript();

        if (!window.google?.accounts?.id) return;

        initializedRef.current = true;

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            if (!credential) return;

            try {
              const apiUrl =
                import.meta.env.VITE_API_URL || "https://xpecto.org/api";

              const res = await fetch(`${apiUrl}/auth/google-onetap`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ id_token: credential }),
              });

              if (res.ok) {
                window.location.reload();
              } else {
                console.error("One Tap sign-in failed", await res.json());
              }
            } catch (err) {
              console.error("One Tap request error:", err);
            }
          },
          cancel_on_tap_outside: true,
          itp_support: true,
        });

        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            console.warn(
              "One Tap not displayed:",
              notification.getNotDisplayedReason(),
            );
          }

          if (notification.isSkippedMoment()) {
            console.warn("One Tap skipped:", notification.getSkippedReason());
          }

          if (notification.isDismissedMoment()) {
            console.warn(
              "One Tap dismissed:",
              notification.getDismissedReason(),
            );
          }
        });
      } catch (err) {
        console.error("Failed to load Google One Tap:", err);
      }
    };

    initOneTap();

    return () => {
      try {
        window.google?.accounts?.id?.cancel();
      } catch {}
    };
  }, []);

  return null;
}
