# Deployment – seeing the latest theme

If you still see the **old UI** after deploying, do the following.

## 1. Redeploy and clear build cache

Your platform may be reusing an old build.

- **Vercel:** Project → **Deployments** → ⋮ on latest deployment → **Redeploy** → enable **Clear Build Cache** → Redeploy.
- **Netlify:** **Deploys** → **Trigger deploy** → **Clear cache and deploy**.
- **Other:** Use “rebuild without cache” or “clean build” if available.

## 2. Confirm the right commit is deployed

Ensure the deployment is from the commit that includes the theme changes (e.g. “Theme: soft watercolor healing UI…”).  
If not, push the latest `master` and let the platform auto-deploy, or manually deploy from that commit.

## 3. Hard refresh in the browser

After a new deployment:

- **Windows/Linux:** `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

Or clear site data for your app’s domain: DevTools → Application → Storage → **Clear site data**.

## 4. Build ID

This app uses a unique build ID per deploy (`next.config.mjs`). After a **new** deploy, JS/CSS URLs change, so caches that still had the old build will request the new assets.

If the old version still appears, the deployment is almost certainly still serving an old build — repeat step 1 and 2.
