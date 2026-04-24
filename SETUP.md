# Firebase setup — GTM Process Overview

This page uses Firebase (Auth + Realtime Database) so every teammate sees the same state live. Here's what you still need to do in the Firebase Console:

## 1. Paste the security rules

Go to **Build → Realtime Database → Rules tab** in the Firebase Console, replace the contents with exactly this, and click **Publish**:

```json
{
  "rules": {
    "state": {
      ".read": "auth != null && auth.token.email_verified == true && auth.token.email.endsWith('@amplitude.com')",
      ".write": "auth != null && auth.token.email_verified == true && auth.token.email.endsWith('@amplitude.com')"
    },
    "activity": {
      ".read": "auth != null && auth.token.email_verified == true && auth.token.email.endsWith('@amplitude.com')",
      ".write": "auth != null && auth.token.email_verified == true && auth.token.email.endsWith('@amplitude.com')"
    }
  }
}
```

(This is also saved as `firebase-rules.json` in the project.)

These rules enforce that **only signed-in, verified @amplitude.com emails** can read or write. Required — without them anyone on the internet could read/write your data.

## 2. Add your preview / hosting domain to Authorized domains

Firebase blocks sign-in links from unknown domains. Go to **Authentication → Settings → Authorized domains** and add whatever domain this page is served from. `localhost` and the Firebase default domains are already allowed.

If you plan to host this on Vercel/Netlify/S3, add those domains here too.

## 3. Share the link

Anyone with an @amplitude.com email can now open the link, enter their email, and get a magic-link sign-in. No password, no admin approval needed.

## Troubleshooting

- **"Email must end in @amplitude.com"** — the form only accepts work emails. Correct.
- **Sign-in link doesn't work / "unauthorized domain"** — you haven't added the current domain to Authorized domains in step 2.
- **"Permission denied" after sign-in** — you haven't published the rules in step 1.
- **Data not syncing** — check the "Live" pill in the top left. If red/offline, open browser devtools console for the Firebase error.
