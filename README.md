# Bloom 🌷

A private little garden, made as a birthday gift. No accounts, no servers, no tracking. Everything lives on her phone.

## What it does
- **Birthday welcome page** on first open (replayable from settings)
- **Today:** daily message, question, tiny challenge, something to look forward to, plus a "memory for you" card from things she wrote
- **Discover:** strengths, things she's proud of, things to explore, reflection questions
- **Dream:** dreams (stars), bucket list, vision board
- **Letters:** "open when…" letters from you, and letters to her future self
- **Story:** wins, memories, funny moments, milestones, with photos
- **Garden:** flowers and stars grow as she adds things. No streaks, no punishment
- **PIN lock**, **backup/restore** (file download/upload), **install button**, **reminders** (all in ⚙️ settings)

## Customise
Edit **`config.js`**: her name, your name, birthday message, daily messages, questions, challenges, discover questions, letters, and the `rescueCode` (unlocks the app if she forgets her PIN, so change it).
Replace `icon-192.png` / `icon-512.png` to change the app icon.

## Publish on GitHub Pages
1. Create a repository and upload the **contents** of this folder (so `index.html` is at the top level).
2. Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)` → Save.
3. After a minute the site is live at `https://<username>.github.io/<repo>/`.
4. Open it on her phone in Chrome. In Bloom, tap ⚙️ → **Install Bloom on this phone** (or Chrome menu ⋮ → Install app).

## Updating
After changing any file, change the version in `sw.js` (`bloom-v3` → `bloom-v4`) so installed copies refresh. Her data is kept.

## How data and reminders work
- Data is in the browser's `localStorage` on her device. Clearing browser data or changing phones deletes it, so she should use **Save a backup file** now and then.
- Photos are resized to save space. Around 30 to 40 photos is the practical limit.
- **Reminders** use Chrome's Periodic Background Sync: Chrome on Android, app installed, notifications allowed. Chrome decides the timing (about once a day, more often if she uses the app regularly), so it's not an exact alarm. iPhone/Safari doesn't support this; she still sees a "memory for you" card on Today whenever she opens the app. Exact-time push notifications would need a server, which this project deliberately avoids.
- Fonts (Fraunces, DM Sans) load from Google Fonts and are cached after the first visit.

## Files
`index.html` · `style.css` · `app.js` · `config.js` (edit me) · `manifest.json` · `sw.js` · `icon-*.png`
