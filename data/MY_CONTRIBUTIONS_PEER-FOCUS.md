# Peer-Focus
## What it is
A real-time collaborative focus/study room app where peers join shared rooms with synchronized Pomodoro-style timers, set personal goals, and hold each other accountable — built for remote co-working, study groups, and productivity circles.
## My Role
Sole developer — designed the entire architecture, built the full frontend, implemented dual-backend abstraction (Supabase + Firebase), custom auth system, real-time sync engine, canvas-based analog timer, and goal tracking from scratch.
## Timeline
Feb 2026
## Tech Stack
React 19, TypeScript, Vite 7, Tailwind CSS 4, React Router v7, Supabase (PostgreSQL + Realtime subscriptions), Firebase / Cloud Firestore, Vercel (with SPA rewrites), ESLint, UUID v4, Lucide React (icons), Canvas API (custom SVG-free timer rendering)
## Key Features / What I built
- **Real-time collaborative focus rooms** — users create/join rooms with shared Pomodoro timers; every peer sees others' timer progress in real-time via Supabase Realtime subscriptions (Postgres CDC) and Firestore `onSnapshot` listeners.
- **Dual-backend abstraction layer** — wrote an abstract `BackendService` TypeScript interface with full Supabase and Firebase/Firestore implementations behind it. Switching backends requires changing a single env var (`VITE_SERVICE=SB` or `VITE_SERVICE=FB`), all UI code is backend-agnostic.
- **Custom auth system** (no third-party provider) — built sign-up/sign-in with username+email+password directly against the database, including session persistence via `localStorage`, duplicate username/email checks, and protected route patterns.
- **Canvas-drawn analog timer** — built a HiDPI-aware circular timer using raw Canvas 2D API with tick marks, progress arc with glow effect, a sweeping hand, and digital readout — zero SVG/DOM overhead, adapts to dark/light mode at render time.
- **Client-side timer tick engine** — timers tick locally every 1s for smooth UI, then sync to the database every 5s via debounced PATCH calls to avoid rate-limiting. Peer timers are adjusted on fetch by computing elapsed time since their `last_tick_at` to show accurate remaining time.
- **"Your Rooms" dashboard** — fetches all rooms the authenticated user has joined (across multiple rooms), merges room names and live member counts, and displays them in a card grid with relative timestamps.
- **Per-member goal tracking** — each user can add, complete (toggle checkbox), and delete goals within their member card inside a room. Goals sync in real-time across all peers in the room.
- **Auto-pause on tab close** — uses `beforeunload` + `fetch` with `keepalive: true` to reliably pause the user's timer and persist remaining seconds to the database when they close the tab or navigate away, preventing lost timer state.
- **Invite system with clipboard** — modal dialog displays the room URL and room ID, with copy-to-clipboard (using both modern `navigator.clipboard` API with `execCommand` fallback) and visual confirmation.
- **Dark/light theme** — full theme context with toggle switch, respects `prefers-color-scheme`, persists selection to `localStorage`, and renders the analog timer correctly in both themes.
- **Responsive UI** — tabbed create/join interface, preset timer durations (15m–90m) with range slider, spin-loader states, form validation, error banners, and polished Tailwind-styled cards with hover effects.
- **SPA deployment config** — Vercel `rewrites` to serve `index.html` for all routes, and `vite.config.ts` with `@` path alias for clean imports.
## Challenges / What I'm proud of
- **Stale timer values on re-fetch** — when Supabase realtime triggered a full data reload, the local user's timer would reset to the database value (which was up to 5s stale). Solved by preserving the local client's `timer_remaining` and `is_paused` from a `useRef` snapshot during re-fetches — the local client is the source of truth for its own timer. Peer timers are instead adjusted by computing elapsed seconds from `last_tick_at`.
- **Goals reload resetting timer state** — goals changes were triggering a full `loadData()` which re-fetched members and overwrote the local timer. Fixed by splitting goal subscriptions to call a separate `loadGoals()` callback that only fetches and sets goals without touching the members state.
- **Dual-backend architecture without code duplication** — designed a clean `BackendService` interface (types.ts) with both Supabase and Firebase implementations conforming to the same contract, enabling seamless backend switching. Handled Firestore-specific quirks like chunking `in` queries into batches of 30 and using explicit `setDoc` with pre-generated IDs for consistency with Supabase's `gen_random_uuid()`.
- **`beforeunload` reliability** — used `fetch` with `keepalive: true` (not `sendBeacon` limited to `POST`) to PATCH the member row on page unload, directly calling the Supabase REST API (or Firestore REST API) to bypass the JS SDK which may not complete in time during unload.
- **Memory management in real-time subscriptions** — properly tracked and cleaned up Supabase realtime channels and Firestore `onSnapshot` unsubscribe functions on component unmount to prevent memory leaks.
## Links
GitHub: https://github.com/Mehul112004/Peer-Focus
Live / Demo: https://peer-focus.vercel.app
