// Auth flow: email-link (magic link) sign-in restricted to @amplitude.com.
//
// useAuth() exposes: { user, status, sendLink, completeSignIn, signOut }
//   status: "loading" | "signed-out" | "signed-in" | "link-sent" | "error"
//   user:   Firebase User object when signed-in, else null
//
// On page load, if the URL is a sign-in link, completeSignIn() is called
// automatically (we stash the email in localStorage when we send the link).

const ALLOWED_DOMAIN = "@amplitude.com";
const EMAIL_STASH_KEY = "gtm-cem-signin-email";

function useAuth() {
  const [user, setUser] = React.useState(null);
  const [status, setStatus] = React.useState("loading");
  const [error, setError] = React.useState(null);
  const [pendingEmail, setPendingEmail] = React.useState("");

  // Wait for Firebase, then subscribe to auth state
  React.useEffect(() => {
    if (!window.firebase || !window.firebaseApp) {
      const t = setInterval(() => {
        if (window.firebaseApp) { clearInterval(t); kickoff(); }
      }, 60);
      return () => clearInterval(t);
    }
    kickoff();

    function kickoff() {
      const auth = window.firebase.getAuth(window.firebaseApp);

      // If URL is a sign-in link, complete flow
      if (window.firebase.isSignInWithEmailLink(auth, window.location.href)) {
        let email = localStorage.getItem(EMAIL_STASH_KEY);
        if (!email) {
          email = window.prompt("Confirm your @amplitude.com email to finish signing in:") || "";
        }
        if (email) {
          window.firebase.signInWithEmailLink(auth, email, window.location.href)
            .then(() => {
              localStorage.removeItem(EMAIL_STASH_KEY);
              // Clean the query string
              window.history.replaceState({}, document.title, window.location.pathname);
            })
            .catch(err => { setError(err.message); setStatus("error"); });
        }
      }

      const unsub = window.firebase.onAuthStateChanged(auth, (u) => {
        if (u && u.email && u.email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
          setUser(u);
          setStatus("signed-in");
        } else if (u) {
          // Signed in but wrong domain — sign out immediately
          window.firebase.signOut(auth);
          setError(`Only ${ALLOWED_DOMAIN} accounts can access this page.`);
          setStatus("error");
          setUser(null);
        } else {
          setUser(null);
          setStatus(cur => cur === "link-sent" ? cur : "signed-out");
        }
      });
      return () => unsub();
    }
  }, []);

  const sendLink = async (email) => {
    setError(null);
    const clean = email.trim().toLowerCase();
    if (!clean.endsWith(ALLOWED_DOMAIN)) {
      setError(`Email must end in ${ALLOWED_DOMAIN}`);
      return;
    }
    try {
      const auth = window.firebase.getAuth(window.firebaseApp);
      await window.firebase.sendSignInLinkToEmail(auth, clean, {
        url: window.location.href.split("?")[0].split("#")[0],
        handleCodeInApp: true,
      });
      localStorage.setItem(EMAIL_STASH_KEY, clean);
      setPendingEmail(clean);
      setStatus("link-sent");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  };

  const signOut = async () => {
    try {
      const auth = window.firebase.getAuth(window.firebaseApp);
      await window.firebase.signOut(auth);
    } catch (err) { setError(err.message); }
  };

  return { user, status, error, pendingEmail, sendLink, signOut };
}

// ---------- UI ----------

const SignInScreen = ({ auth }) => {
  const [email, setEmail] = React.useState("");
  const { status, error, pendingEmail, sendLink } = auth;
  const busy = status === "loading";

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#fafbfc", padding: 24,
    }}>
      <div style={{
        width: "100%", maxWidth: 440,
        background: "#fff", border: "1px solid #dedfe2", borderRadius: 16,
        padding: "32px 32px 28px", boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
      }}>
        <img src="assets/logo-mark-blue.svg" alt="Amplitude" style={{ height: 28, marginBottom: 20 }}/>
        <h1 style={{
          fontFamily: "'Gellix', 'IBM Plex Sans', sans-serif", fontWeight: 500,
          fontSize: 24, lineHeight: 1.2, letterSpacing: "-0.3px", color: "#1e2024",
          margin: 0, marginBottom: 6,
        }}>GTM Process Overview</h1>
        <p style={{ fontSize: 13, color: "#6f7480", margin: 0, marginBottom: 24 }}>
          Sign in with your amplitude.com email to view and edit.
        </p>

        {status === "link-sent" ? (
          <div style={{
            padding: "14px 16px", borderRadius: 8,
            background: "#e3f0ef", border: "1px solid #259991",
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#0f5350", marginBottom: 4 }}>
              Check your inbox
            </div>
            <div style={{ fontSize: 12.5, color: "#1e2024", lineHeight: 1.45 }}>
              We sent a sign-in link to <strong>{pendingEmail}</strong>. Click the link
              in that email to finish signing in. You can close this tab.
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); if (email) sendLink(email); }}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 600, color: "#6f7480",
              textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 6,
            }}>Work email</label>
            <input type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@amplitude.com"
              autoFocus
              disabled={busy}
              style={{
                width: "100%", height: 40, padding: "0 12px", boxSizing: "border-box",
                border: "1px solid #dedfe2", borderRadius: 8, background: "#fff",
                font: "400 14px/1.2 'IBM Plex Sans', sans-serif", color: "#1e2024", outline: "none",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "#1e61f0"; e.currentTarget.style.boxShadow = "0 0 0 3px #b1d3ff"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#dedfe2"; e.currentTarget.style.boxShadow = "none"; }}/>

            {error && (
              <div style={{
                marginTop: 10, padding: "8px 10px", borderRadius: 6,
                background: "#fae2e2", border: "1px solid #f3b5b5",
                fontSize: 12, color: "#b41823",
              }}>{error}</div>
            )}

            <button type="submit" disabled={busy || !email}
              style={{
                marginTop: 16, width: "100%", height: 40, borderRadius: 8,
                background: busy || !email ? "#dedfe2" : "#1e61f0",
                color: busy || !email ? "#a8abb3" : "#fff",
                border: "none",
                fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 500,
                cursor: busy || !email ? "not-allowed" : "pointer",
              }}>
              {busy ? "Loading…" : "Email me a sign-in link"}
            </button>

            <div style={{
              marginTop: 16, fontSize: 11, color: "#8a8e99", lineHeight: 1.5,
            }}>
              We'll send you a one-time link — no password needed. The link expires in 1 hour.
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { useAuth, SignInScreen });
