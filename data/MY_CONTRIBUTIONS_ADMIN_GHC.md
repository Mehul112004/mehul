# GoHappy Club Admin Dashboard

## What it is

A comprehensive admin dashboard and operations portal for a club management platform, enabling admins to manage events, memberships, gamification (spin wheel, tambola), NGO fundraisers, user data, push notifications, analytics, and community content.

## My Role

Sole frontend developer — built the entire admin portal from scratch: architecture, routing, authentication, all 22+ feature pages, reusable component library, analytics dashboard, and the gamified Spin Wheel + Tambola admin interfaces.

## Timeline

Aug 2024 – May 2026

## Tech Stack

- **Frontend:** React 18.2, React Router DOM v6, React Helmet
- **UI Framework:** MUI v5.12 (Material UI), Emotion (CSS-in-JS), Stylis/RTL plugin
- **Charts:** Chart.js 4.3, react-chartjs-2, Nivo (funnel charts)
- **Rich Text:** Jodit React v4.1, React Quill v2
- **Data Grid:** React Table v7.8, MUI X Data Grid v5
- **HTTP:** Axios (custom instance with auth interceptors)
- **Other UI:** React Confetti v6, React Loader Spinner, Chroma JS v2, Prop-types
- **Linting:** ESLint 8.39, Prettier 2.8, eslint-config-prettier
- **Deployment:** Google App Engine (backend), Hostinger (frontend — SPA with .htaccess rewrite rules)

## Key Features / What I built

- **Tambola (Housie/Bingo) Live Game Board** — Interactive 90-number visual grid with live number calling, 2-second animation cycle, traditional Tambola rhymes database (e.g., "Sweet Sixteen", "Son of a Gun"), called/current number highlighting, confetti celebration on game completion, editable categories, ticket generation as base64 image, and data persistence
- **Spin Wheel Admin** — Complex 5-tab dashboard managing the entire spin-wheel gamification pipeline: Prize CRUD with image/probability/toggle configuration, partner inventory batch management with CSV bulk upload and single code add, daily budget with rollover calculations from previous day, budget history tracking, and user spin activity lookup. Includes overview cards showing remaining budget, unclaimed inventory counts, and low-batch warnings
- **Event Management System** — Full CRUD with paginated data table, date/field/recording filters via popup, event templates (create/edit/apply), Jodit rich-text editor for event descriptions, image uploads as base64, sub-category support, creator tracking via localStorage, ratings display, and after-start safety check before deletion
- **Karaoke Competition Forms** — Nested form builder per event with participant limits, free trial seat allocation, entry cost, form field definitions, competition rules, metadata, and participant list viewer with export
- **Give Coins & Scratch Cards** — Dialog-based flow to award coins to event participants and send scratch cards, integrated directly into the event management UI
- **Analytics Dashboard** — 5-tab analytics suite (Onboarding funnel with new registrations, Churn & Retention trends, Revenue with currency-formatted charts and summary KPIs, Engagement metrics, Acquisition campaign performance). Date range picker with refresh, bar/line/doughnut/funnel charts via Chart.js and Nivo, KPI cards
- **Membership Management** — Full members table with radio-based user selection, grant membership dialog with plan selection, give coins dialog, give voucher dialog, free trial extension flow (check eligibility → extend), CSV export with configurable fetch limit (1–100), and membership type/free trial filters
- **User Management** — 7 search modes via dropdown: Find by Phone, Find by Email, Find by Membership Type (with pagination), Referral List, Top Referrals, Download by Joining Date (with min/max date filter), and Expired Free Trials (with pagination)
- **NGO Campaigns / Fundraising** — Campaign lifecycle management (ACTIVE → FUNDS_GATHERED → DELIVERED / CANCELLED) with 16 categories (Education, Health, Disaster Relief, etc.), goal tracking with coin progress bars, donor counts, media URLs, and transparency log entries
- **Transaction History** — Per-user transaction lookup with built-in filters (credit/debit type, 10+ source types, amount range, document/source IDs, titles), refund capability for debit transactions, CSV export, and scratch card indicator
- **Push Notifications (Announcements)** — Three notification dispatch types: General (broadcast all users), Event-targeted, and Trip-targeted — each with dedicated forms
- **Community Admin Posts** — Admin-originated social feed with Jodit rich-text post creation/editing, post types (announcement vs admin post), event linking, pin toggle, and like/comment display
- **Payment CSV Download** — Filter payments by phone number, payment type (contribution/workshop), and date range for CSV export
- **Coin Packages CRUD** — Card grid display of coin packages (base coins, bonus percentage, total), create/update dialog
- **Posters / Info Cards CRUD** — Full CRUD with image thumbnail, URL, display order, external flag, and active toggle
- **Festival & Video Content Management** — CRUD interfaces for festival content and video content
- **Trip Management** — Listing, creation, detail/edit views with campaign URL and trip type fields
- **Voucher System** — Create/fetch/update vouchers with expiry dates and grid display
- **Dynamic Environment Switcher (Settings)** — Runtime server URL switching between Production, Development, Local, and Custom endpoints via radio selector, persisted to localStorage and applied immediately
- **Authentication System** — JWT-based username/password login, role-based access control (ADMIN/EVENT_MANAGER gating for edit/create actions), auto session expiration handling across all pages with localStorage expiry polling, and non-logged-in guard component with 5-second redirect
- **Global Error Handling** — Custom Axios interceptor that attaches Bearer token and `X-GOH-Source: admin-portal` header to every request, dispatches custom `go-happy-api-error` DOM events caught globally in App.js via Snackbar alerts
- **Deployment Config** — .htaccess with SPA rewrite rules for Hostinger hosting, robots.txt to disallow search engine crawlers, multi-environment config files (local/dev/cloud) for Google App Engine backend
- **Dark/Light Theme & RTL Support** — Full MUI theme customization with light/dark mode toggle, RTL (Arabic/Hebrew) support via stylis-plugin-rtl, collapsible sidebar, and configurator panel

## Challenges / What I'm proud of

- **Spin Wheel Admin Dashboard** — Built a complete gamification admin with 5 interconnected tabs (prizes, inventory stats, inventory list, daily budget, spin activity), managing complex state across prize probabilities, partner inventory batch tracking, and daily budget rollover calculations from previous day
- **Live Tambola Board** — Engineered a real-time interactive game board with number-calling animations, a database of 90 traditional Tambola rhymes, and confetti celebration — requiring careful state management for called/current number tracking
- **Analytics Dashboard** — Built a full analytics suite from scratch with 5 tabs and multiple chart types (bar, line, doughnut, funnel), parallelizing up to 3 API calls per tab and handling epoch-based date filtering
- **Event Form State Complexity** — The EventDetails component (1300+ lines) manages create, update, template creation, template editing, and "create from template" modes simultaneously, with field-level validation, Jodit rich-text editor integration, and sub-form modals for coins, scratch cards, and karaoke forms
- **Pagination Edge Cases** — Fixed tricky pagination bugs (e.g., page being undefined after deleting the last event on a page, null/empty participant list handling) that required understanding of MUI pagination state lifecycle
- **Session Expiry Handling** — Implemented consistent JWT expiry polling across all protected pages, clearing localStorage and redirecting to login — avoiding stale session states and inconsistent UX
- **NGO Campaign Lifecycle** — Modeled a complete fundraiser lifecycle (ACTIVE → FUNDS_GATHERED → DELIVERED/CANCELLED) with transparency logging, requiring careful status transition logic and role-gated admin-only create access

## Links

GitHub: https://github.com/GoHappy-Club/Go-Happy-Admin (private)
Live / Demo: admin.gohappyclub.in (requires authentication)
