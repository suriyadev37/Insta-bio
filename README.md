# Surprise Site — Full Project

## 📁 Structure
```
/
├── index.html
├── calculation-1.html
├── charger-2.html
├── numorder-3.html
├── shy-4.html
├── quess-4.html
├── patient-5.html
├── message-6.html
├── story-7.html
├── final.html
├── css/
│   └── style.css        ← ALL page styles, one file
├── js/
│   └── script.js         ← ALL page logic + Telegram notify, one file
├── img/
│   └── (put sk.png, sight.png, flower.png here)
├── api/
│   └── send.js            ← Vercel serverless function → Telegram
├── package.json
├── vercel.json
└── .env.example
```

## 🔗 Flow (fixed the broken link)
`index → calculation-1 → charger-2 → numorder-3 → shy-4 → quess-4 → patient-5 → message-6 → story-7 → final`

`shy-4.html` used to link to a non-existent `puzzle7.html` — it's now wired
into the real flow, landing on `quess-4.html`.

## 📲 Every activity → instant Telegram message
Because everything shares one `js/script.js`, every page calls the same
`notifyTelegram(message)` helper, which POSTs to your own `/api/send`
endpoint. Messages fire instantly for:

- Name entered on the welcome page
- Wrong / correct answer on the math puzzle
- Charger filled to 100%
- Memory puzzle completed
- Entering the Shy page + successfully completing it
- Winning the "guess the number" game
- Wrong click / successful pass on the Patience test
- The message the user actually typed
- Finishing the story page
- Completing the entire site (final gift reveal)

The user's name is read from `localStorage` (set once on `index.html`), so
every later page automatically tags messages with their name — no re-entry
needed.

## 🔑 Setup before deploying
1. Create a Telegram bot via **@BotFather** → copy the **Bot Token**.
2. Message your bot once, then get your **Chat ID** (e.g. via
   `https://api.telegram.org/bot<TOKEN>/getUpdates`, or a bot like
   `@userinfobot`).
3. Drop your real images into `/img` using the exact filenames noted in
   `img/PUT_YOUR_IMAGES_HERE.txt`.

## 🚀 Deploying to Vercel
1. Push this folder to a GitHub repo (or drag-and-drop into Vercel).
2. Import the repo in Vercel.
3. In **Project Settings → Environment Variables**, add:
   - `BOT_TOKEN` = your bot token
   - `CHAT_ID` = your chat id
4. Deploy. Vercel auto-detects `/api/send.js` as a serverless function and
   serves everything else (`index.html`, `css/`, `js/`, `img/`) as static
   files — no server needed, so `server.js` from the old setup is no longer
   required.

That's it — open your deployed URL and every step the user takes will land
in your Telegram instantly.
