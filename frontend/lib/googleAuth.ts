/**
 * Official Google OAuth 2.0 & Identity Services Authentication Handler
 */

export interface GoogleUserCredential {
  name: string;
  email: string;
  avatar?: string;
  googleId?: string;
}

export function triggerGoogleOAuth(
  onSuccess: (user: GoogleUserCredential) => void,
  onFallbackModal: () => void,
  onError?: (errMessage: string) => void
) {
  if (typeof window === "undefined") return;

  const realClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // If no real Google Client ID is set in environment, open Google Account Chooser Modal
  if (!realClientId || realClientId.includes("demo") || realClientId.length < 10) {
    onFallbackModal();
    return;
  }

  const handleCredentialResponse = (response: any) => {
    if (response && response.credential) {
      try {
        const base64Url = response.credential.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );
        const payload = JSON.parse(jsonPayload);
        if (payload && payload.email) {
          onSuccess({
            name: payload.name || payload.email.split("@")[0],
            email: payload.email,
            avatar: payload.picture,
            googleId: payload.sub,
          });
          return;
        }
      } catch (err) {
        console.warn("Could not parse Google OAuth credential payload:", err);
      }
    }
    onFallbackModal();
  };

  if ((window as any).google?.accounts?.id) {
    try {
      (window as any).google.accounts.id.initialize({
        client_id: realClientId,
        callback: handleCredentialResponse,
        auto_select: false,
      });
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          onFallbackModal();
        }
      });
    } catch (e) {
      onFallbackModal();
    }
  } else {
    // Inject official Google Identity Services Client Script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if ((window as any).google?.accounts?.id) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: realClientId,
            callback: handleCredentialResponse,
          });
          (window as any).google.accounts.id.prompt();
        } catch (e) {
          onFallbackModal();
        }
      } else {
        onFallbackModal();
      }
    };
    script.onerror = () => {
      onFallbackModal();
    };
    document.head.appendChild(script);
  }
}
