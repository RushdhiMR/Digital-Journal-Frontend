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
  onError?: (errMessage: string) => void
) {
  if (typeof window === "undefined") return;

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
    if (onError) onError("Google Sign-In credential parsing failed.");
  };

  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1083928172918-demo.apps.googleusercontent.com";

  if ((window as any).google?.accounts?.id) {
    try {
      (window as any).google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
      });
      (window as any).google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          openGoogleOAuthPopup(CLIENT_ID, onSuccess, onError);
        }
      });
    } catch (e) {
      openGoogleOAuthPopup(CLIENT_ID, onSuccess, onError);
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
            client_id: CLIENT_ID,
            callback: handleCredentialResponse,
          });
          (window as any).google.accounts.id.prompt();
        } catch (e) {
          openGoogleOAuthPopup(CLIENT_ID, onSuccess, onError);
        }
      } else {
        openGoogleOAuthPopup(CLIENT_ID, onSuccess, onError);
      }
    };
    script.onerror = () => {
      openGoogleOAuthPopup(CLIENT_ID, onSuccess, onError);
    };
    document.head.appendChild(script);
  }
}

function openGoogleOAuthPopup(
  clientId: string,
  onSuccess: (user: GoogleUserCredential) => void,
  onError?: (errMessage: string) => void
) {
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    window.location.origin + "/login"
  )}&scope=email%20profile&prompt=select_account`;

  const popup = window.open(authUrl, "GoogleOAuth", `width=${width},height=${height},top=${top},left=${left}`);

  if (!popup) {
    if (onError) onError("Popup blocked. Please allow popups for Google Sign-In.");
  }
}
