# Dr. UPSC Portal

## Executive Summary

Dr. UPSC is a full-featured, secure EdTech web application built using Next.js and Tailwind CSS designed for UPSC civil services aspirants in India. As the sole frontend developer, I architected and built the entire application from scratch, scaling it to handle thousands of concurrent students. The portal delivers secure DRM video streaming, real-time Agora classrooms, an interactive mock exam engine (supporting online and OMR sheet testing), active mentorship calendar bookings, and an e-commerce platform for study materials.

## Project Impact

* **High Scalability & Performance**: Successfully serves over **15,000 active users** with high-performance metrics:
  * Integrated Next.js dynamic imports and asset lazy-loading.
  * Built question prefetching to preload upcoming questions, achieving zero-latency navigation in test screens.
* **Great UI/UX**: Designed a modern, highly responsive, and accessible interface featuring a seamless dark/light mode engine, Framer Motion animations, custom slide-out drawers, and interactive seasonal themed components.
* **Secure DRM & Anti-Piracy**: Implemented secure Widevine/DRM content delivery using `shaka-player` and developed a rotating dynamic watermark that overlays a student's registered mobile number, mitigating stream ripping.
* **Proctored Examination System**: Built an anti-cheat proctoring listener that tracks browser focus/blur status and calculates away-durations, enhancing the reliability of simulated civil services exams.
* **Real-time Collaboration**: Enabled interactive student-mentor communication by integrating Agora video conferencing, Teachmint classrooms, and a synchronized replay chat module that matches recorded lecture timelines.
* **Secure Session Architecture**: Isolated authentication tokens from client-side script theft by proxying Next.js API endpoints (`/api/auth`, `/api/logout`) and storing JWTs in secure, server-side `httpOnly` cookies.

## Timeline

June 2024 – Jan 2025

## Tech Stack

* **Framework & Runtime**: Next.js 14 (Pages Router), React 18, Node.js
* **Styling & UI**: Tailwind CSS, CSS Modules, shadcn/ui (Radix UI), Framer Motion
* **DRM Video & Document Rendering**: Shaka Player (v4.9.7), `react-pdf` (v9.1.0), `pdfjs-dist` (v4.5.136)
* **Real-time & WebSockets**: Agora RTC (v2.5.1 & v4.24.4), `sockjs-client`, `@stomp/stompjs` (STOMP WebSockets)
* **Payments**: Cashfree Checkout (`@cashfreepayments/cashfree-js`), Razorpay SDK
* **Analytics & Push Notifications**: CleverTap Web SDK (v2.3.0), Google Tag Manager (GTM), Firebase Cloud Messaging (service worker)
* **Drag-and-Drop Checklist**: `@hello-pangea/dnd` (v17.0.0)
* **Interactive Sliders**: Swiper
* **Integrations**: Teachmint classroom iframe, Cloudflare Meeting SDK, Tawk.to

## Key Features & Codebase Architecture

### 1. Dynamic Video Classroom (`ShakaPlayer`)
* **DRM Playback**: Integrates Shaka Player with adaptive streaming and Widevine DRM to deliver protected lecture videos. Includes custom subtitle rendering with background styling.
* **Anti-Piracy Watermarking**: Dynamically overlays the student's registered mobile number (`user?.mobileNumber`) on top of the playing video. The overlay rotates across 3 random screen coordinates every 8 seconds, making screen recording/redistribution easily trace-identifiable.
* **Network-Adaptive Buffering**: Monitors connection speeds (downlink). Shifts buffering goals between 60s (with a 5s rebuffer goal) for slow connections (< 1 Mbps) and 120s for fast connections to prevent streaming pauses.
* **Progress Resuming**: Periodically fires background POST requests to `/tracking/save-status` saving playhead positions. Resumes playback automatically on re-entry by querying `/tracking/{folder}/tracking-info`.
* **Synchronized Replay Chat**: Syncs live chat streams during webcast replays. The chat overlay extracts logs and injects messages dynamically based on the current playhead `currentTime`, recreating a live discussion environment.

### 2. Mock Test Engine (Testify)
* **Dual Attempt Modes**:
  * **Online Mode**: Interactive web interface displaying one question at a time with instant AI English/Hindi translation toggles.
  * **Offline Mode (OMR Entry)**: Digitalizes printed test booklets. It displays a responsive OMR bubble sheet (A, B, C, D) corresponding to each question number, tracking answer submissions and timers as the student works off a physical copy.
* **Question Prefetching**: Preloads the next two questions in the queue to ensure zero-latency transitions during test-taking.
* **Anti-Cheat Proctoring**: Monitors window `blur` and `focus` events. If the student switches tabs or clicks off the test browser window, the system tracks the precise time spent away (`secondsAway`) and prompts a warning modal.
* **Intelligent Re-attempts**: Supports "Full Re-attempt" (resets selections, saving a brand new attempt history) or "Partial Re-attempt" (filters the previous attempt to let students re-answer only those questions that were left blank or answered incorrectly).
* **Analytics & Weakness Analysis**: Integrates performance statistics with doughnut charts, lists weak topics, and highlights recommended topics for revision based on the attempt results.
* **Printable Answer Keys**: Formats detailed step-by-step mock test solutions with print-friendly stylesheets (`@media print`) so users can export keys to PDF or paper.

### 3. Live Sessions & 1-on-1 Mentorship Booking
* **Teachmint Meeting Room**: A secure dynamic live meeting room path (`/meet/live/[uuid]`) that checks browser media permissions before proxying user tokens to the Teachmint server, loading an embedded session via iframe. Strips application headers for full-screen layouts.
* **Agora 1-on-1 Mentorship**: Facilitates scheduling virtual advisory calls with experienced/interview-appeared mentors for a nominal fee (₹99), using custom calendar grids.
* **Community Groups**: Maps students to cohorts based on courses, supporting group message streams and documents shared via STOMP sockets.

### 4. Daily Planner & To-Do Tracker
* **Prioritized Drag-and-Drop Checklist**: Utilizes Hello Pangea DnD to let students rearrange custom tasks. Checks update database status via `/todo/task-completion`.
* **Mental Health Tracker**: A persistent checklist covering daily meditation, evening walks, and physical exercises, designed to support student well-being during intense preparation.

### 5. Current Affairs Portal
* **Interval Capsules**: Distributes daily, weekly, and monthly current affairs briefs in PDF format using a custom text-selectable Canvas renderer (`react-pdf`).
* **Daily Quizzes**: Interactive current affairs quizzes with step-by-step detailed explanations and answer evaluations to test daily reading retention.

### 6. Course Store & Checkout
* **Catalogue Filters**: Lists active and archived courses categorized by preparation stage (Mains, Foundation, EPFO, Prelims, Test Series).
* **Vouchers & Coupon Codes**: Features combo discounts, validation messages, and custom pricing models calculated before checkouts.
* **Dual Payment Gateways**: Orchestrates checkout modals dynamically switching between Cashfree and Razorpay depending on env configuration.

### 7. Auth System & Security
* **OTP Logins**: Mobile/desktop OTP-based logins with auto-resend.
* **Encrypted Token Decryption**: Decrypts custom XOR-based API response payloads.
* **Session Cookie Proxies**: Stores authentication JWTs in secure, server-side `httpOnly` cookies via Next.js local API routes (`/api/auth`, `/api/get_token`, `/api/logout`) to prevent XSS-based token harvesting.

### 8. Global State & API Proxying
* **React Context (`Context.jsx`)**: Centralizes user sessions, shopping cart counts, Agora token states, and localStorage-persisted theme preferences (Light/Dark mode).

### 9. Seasonal / Holiday Interactive Animations
* **Diwali Animation**: Interactive sparkler follows the user's cursor/touch to light a diya on-screen, triggering canvas fireworks and celebrations.
* **Independence & Republic Day**: Fighter jet animations and an interactive SVG map of India showing state tooltips upon hover/touch.
* **Others**: Holi pichkari water guns, Christmas snowfall, and New Year decorations with full enter/exit animations and resource cleanups.

## Challenges / What I'm proud of

**Custom Token Decryption:** Built a XOR-based decryptor that handles encrypted API tokens, extracts clean JWTs from noisy byte streams, and gracefully degrades across multiple decryption strategies — an uncommon edge case that most libraries don't handle out of the box.

**Shaka Player + Chat Overlay:** Integrating Shaka Player's adaptive streaming with a synchronized live-chat replay required careful timing and state management so recorded lecture viewers experience the same chat as live attendees.

**Multi-Gateway Payment System:** Supporting both Razorpay and Cashfree with voucher stacking, order status polling, and graceful failure handling required a robust state machine across multiple pages.

**Diwali Sparkler Animation:** Built a proximity-based sparkler-to-diya lighting effect where the sparkler follows the user's cursor/touch and lights the diya when close enough, triggering fireworks — a complex interaction blending mouse/touch events, SVG rendering, and animation sequencing.

**Interactive India Map:** An SVG-based clickable map of India with per-state hover tooltips showing trivia, fully responsive with distinct mobile tap and desktop hover behaviors.

**Safari Video Quality Bug:** Debugged and fixed a Shaka Player quality switching issue that only manifested in Safari, requiring low-level investigation of the player's ABR logic.

**Push Notification Setup:** Firebase Cloud Messaging with service workers across browsers, soft permission prompting, and CleverTap event hookup — tricky to get right across all environments.

**Dark Mode on Existing Codebase:** Added full dark mode support retroactively to a large, already-built light-mode app, touching dozens of components and pages without breaking the existing UX.

**Test Question Prefetching:** Implemented preloading of upcoming test questions so students experience instant transitions between questions in mock tests — critical for a smooth OMR exam experience.

**Sole Developer Scale:** Built and maintained the entire frontend (82 pages, 184 components, 45K+ lines) solo over 2 years while the product was live with paying users.

## Links

GitHub: private  
Live: https://drupsc.com
