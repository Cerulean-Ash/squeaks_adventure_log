# Squeaks' Adventure Log

A Spotify Wrapped-style React app built for Squeaks. Full-screen story slides through every adventure, with a date picker and live push notifications.

## What it does

- Swipeable story slides — one per adventure, each with its own colour theme
- Tap right to advance, tap left to go back, or swipe
- Final slide lets Julia pick the next adventure, choose a date, and send Ashley a push notification

## Stack

- React + Vite
- canvas-confetti
- ntfy.sh for push notifications (no backend needed)
- Deployed to GitHub Pages

## Dev

```bash
npm install
cp .env.example .env.local   # then set your ntfy topic
npm run dev
```

The ntfy topic is read from `VITE_NTFY_TOPIC` in `.env.local` (gitignored). Without it, notifications are simply skipped.

## Deploy

```bash
npm run deploy
```

Builds and pushes to the `gh-pages` branch. Live at:
**https://cerulean-ash.github.io/squeaks_adventure_log/**

## Notifications

Push notifications go to an [ntfy.sh](https://ntfy.sh) topic set via `VITE_NTFY_TOPIC` in `.env.local`. Install the ntfy app and subscribe to that topic to get alerts when Squeaks picks an adventure.
