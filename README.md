# Silver Living Tips (Taboola test — 45+ home upgrades)

A minimal, content‑first landing page for testing Taboola traffic. Built for GitHub + Netlify, with a serverless function that relays form submissions to a Telegram bot (token kept server‑side).

## Features
- Accessible, high‑contrast single page
- Two forms (lead/download + contact)
- Telegram relay via Netlify Function
- Free checklist PDF (static)
- Compliant copy (no medical claims), affiliate disclosure placeholder

## Quick Start
1. **Create repo** on GitHub and push these files.
2. **Netlify → New site from GitHub** → pick repo.
3. In Netlify **Site settings → Environment variables**, add:
   - `TELEGRAM_BOT_TOKEN` — from BotFather
   - `TELEGRAM_CHAT_ID` — your chat or channel ID
4. **Deploy**. Map your custom domain `silverlivingtips.com` and enable HTTPS.
5. Test both forms; confirm messages arrive in Telegram. The lead form also downloads `/assets/checklist.pdf`.

## Create a Telegram Bot
1. Open Telegram and chat with **@BotFather**.
2. Send `/newbot`, follow prompts, and copy the **HTTP API token**.
3. Start a chat with your bot (click the t.me link BotFather gives you) and send a *hello*.
4. Get your **chat ID**:
   - Easiest: forward a message from that chat to **@userinfobot** *(or)*
   - Use: `https://api.telegram.org/bot<token>/getUpdates` after you messaged the bot, and find `chat.id` in the JSON.
5. In Netlify, set env vars:
   - `TELEGRAM_BOT_TOKEN=123456:ABC...`
   - `TELEGRAM_CHAT_ID=123456789`

## Files
- `index.html` — page markup
- `styles.css` — styles
- `app.js` — form logic
- `netlify/functions/telegram.js` — serverless relay
- `netlify.toml` — config
- `assets/hero.jpg` — hero placeholder
- `assets/og-image.jpg` — social preview
- `assets/checklist.pdf` — downloadable lead magnet

## Notes for Taboola Compliance
- Avoid exaggerated claims; keep benefits phrased as “comfort,” “ease,” “reduce strain.”
- If you add affiliate links, include a disclosure near the link(s).
- Don’t use deceptive countdowns or forced redirects.
- Keep the checklist truly free; if you email tips, say so near the form.

## Customization
- Change colors/typography in `styles.css`.
- Edit copy in `index.html` to match your voice.
- Replace `/assets/hero.jpg` and `/assets/og-image.jpg` with real imagery.
