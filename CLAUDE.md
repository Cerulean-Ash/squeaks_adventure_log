# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start dev server at localhost:5173
npm run build     # production build → dist/
npm run deploy    # build + push to gh-pages branch (deploys to GitHub Pages)
```

```bash
npm test          # run the Vitest suite once
npm run test:watch # watch mode
```

Tests use Vitest + Testing Library (jsdom). Specs live next to source as `*.test.js(x)`; shared setup is `src/test/setup.js`. Linter is the default Vite ESLint config (`npm run lint`).

## What this is

A Spotify Wrapped-style React SPA built for Julia ("Squeaks") by Ashley. Full-screen story slides through 7 shared adventures, then a final slide where she picks the next adventure, chooses a date, and fires a push notification to Ashley via ntfy.sh.

Live at: **https://cerulean-ash.github.io/squeaks_adventure_log/**

## Architecture

### Slide system (`App.jsx`)
The app is a full-screen slide deck. `SLIDES` is a flat array: `[intro, ...7 entries, adventures]`. Navigation state is just an integer index. `prevIndex` is tracked separately so the outgoing slide can remain visible as a static backdrop while the incoming slide animates over it (horizontal CSS keyframe animation). A `busy` ref with a 480ms timeout prevents double-navigation during transitions.

Navigation: tap right 35%+ of screen = next, tap left = prev. Also swipe (touch) and arrow keys.

### Themes (`src/data.js`)
`THEMES` is a parallel array to `SLIDES` — one theme object per slide with `bg` (gradient), `color` (text), `sub` (muted text), `bar`/`barFill` (progress bar colours). If you add an entry to `ENTRIES`, you must add a corresponding theme to `THEMES` at the matching index (entries start at index 1).

### Content (`src/data.js`)
All copy lives in `ENTRIES` (timeline) and `ADVENTURES` (picker cards). To add a new adventure entry to the timeline, add to `ENTRIES` and add a theme to `THEMES`. To add a new adventure option to the picker, add to `ADVENTURES` only. Set `custom: true` on an adventure to trigger the free-text input step in the overlay.

### AdventureOverlay flow (`src/components/AdventureOverlay.jsx`)
Step machine: `question → custom (if custom:true) → date → done` or `question → maybe`. On `done`, fires `notifyAshley()` from `src/utils.js` which POSTs to the ntfy.sh topic read from `import.meta.env.VITE_NTFY_TOPIC`.

### ntfy topic / env (`.env.local`)
The ntfy.sh topic is supplied via the `VITE_NTFY_TOPIC` env var, kept in a gitignored `.env.local` (copy `.env.example` to set up). This keeps the topic out of the repo source — but Vite **inlines** the value into the public build, so it is not a real secret (still visible in the deployed bundle and the network tab). If `VITE_NTFY_TOPIC` is unset, `notifyAshley()` is a no-op. To rotate: change the topic in `.env.local`, re-subscribe in the ntfy app, then `npm run deploy`.

### Date input
Uses a visible styled `div` (`.date-display`) overlaid by a transparent `<input type="date">` (`.date-input-hidden`). The hidden input has `onClick → showPicker?.()` for Chrome. This approach works on both Chrome Android and iOS Safari.

### Styling (`src/App.css`)
Single CSS file. Uses CSS custom properties `--c` (text colour) and `--s` (sub/muted colour) set inline per slide so all child components inherit the current theme's colours without prop drilling. All layout is `position: fixed` full-screen — there is no scrolling at the app level; only `.sbody--adv` (the adventures grid) has `overflow-y: auto` with hidden scrollbar.

### Deployment
`npm run deploy` = `vite build && gh-pages -d dist`. Vite `base` is set to `/squeaks_adventure_log/` in `vite.config.js`. The `gh-pages` branch is auto-managed — never edit it manually.
