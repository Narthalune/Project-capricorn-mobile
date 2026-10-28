# Capricorn Gemini backend (Cloudflare Worker)

This directory contains Capri's AI server, while the repository root remains the GitHub Pages iPhone app.

## Deploy from GitHub on Cloudflare

1. Open **Cloudflare Dashboard → Workers & Pages**.
2. To connect an existing **capricorn-api** Worker: open it, go to **Settings → Builds → Connect**. Or create a new Worker with **Import a repository** and name it `capricorn-api`.
3. Connect `Narthalune/Project-capricorn-mobile`, branch `main`.
4. Set **Root directory** to `server`. This is critical: GitHub Pages stays in the repository root.
5. Keep **Build command** blank, and set **Deploy command** to `npx wrangler deploy`.
6. Save / deploy, and check that the deployment has succeeded. If your existing Cloudflare Worker has a different name, either rename it or adjust `server/wrangler.jsonc` to match.
7. In the **Worker's runtime Settings → Variables & Secrets**, create these as **Secret** values: `GEMINI_API_KEY` and `CAPRI_ACCESS_TOKEN`. Never place either value in this public GitHub repository. (Build-time variables are not runtime secrets.)
8. Optional: add runtime **Text** variable `GEMINI_MODEL`, for example `gemini-3.5-flash-lite`. Default is the same model. Redeploy any changed Worker settings if requested.
9. Copy your deployed `https://...workers.dev` URL; on Capri's iPhone Home Screen app open **Settings**, paste the Worker URL and **CAPRI_ACCESS_TOKEN**, and press **Save & Test**.
10. Send a test message in Chat. **Save & Test** verifies your Worker access token; it does not itself verify the Google model/key or quota.

## Security
- This is an authenticated one-person prototype, not production-ready multi-user authentication.
- GitHub Pages is public; users can inspect the website and Worker code. The Gemini API key lives only in Cloudflare secrets.
- `CAPRI_ACCESS_TOKEN` is a password to your server. Keep it private and strong.
- Don't commit `.dev.vars`, `.env`, or any real credentials.
- Chat is stored locally on the device; a recent portion is sent to Google via the Worker for each AI reply.

## If Cloudflare won't let you edit code on an iPhone
You do not need to. Set up **Settings → Builds → Connect** and choose this repository. Cloudflare deploys `server/worker.js` from GitHub.

Documentation: https://developers.cloudflare.com/workers/ci-cd/builds/
