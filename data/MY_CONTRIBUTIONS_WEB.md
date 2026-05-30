# GoHappy Web Application

## Executive Summary

GoHappy Club Web Application is a highly optimized single-page React application tailored specifically for senior citizens in India (aged 50+). As the sole frontend developer, I architected and built the entire application from scratch, translating complex backend pipelines into a simple, high-accessibility UI. The app connects seniors with interactive sessions, workshops, trips, and memberships, featuring end-to-end PhonePe UPI subscription mandates, sandboxed payment gateways, custom client-side caching calendars, and automated lead capture pipelines.

## Project Impact

* **Senior-Centric Usability**: Created a tailored UX optimized for older adults, using legible typography (Nunito, Open Sans, DM Sans), clear contrast, large tap targets, and intuitive mobile layouts that solve accessibility challenges for the 50+ demographic.
* **Direct Revenue Conversion**: Designed and built the multi-step membership subscription flows (PhonePe UPI mandates, VPA validation, GPay intents, QR codes) and workshop booking systems. These secure, simplified checkout flows directly increased subscription conversions and workshop booking sales.
* **Clean & Modular Architecture**:
  * Programmed the application with strict CSS Module styling isolation (66 distinct `.module.css` files), eliminating global namespace pollution.
  * Developed a decoupled routing architecture with 14 main routes, utilizing the React Context API (`ContextProvider.jsx` and `Context.jsx`) to stream global layout states and configurations without prop-drilling.
* **Performance Optimization**:
  * Implemented client-side caching on the custom calendar strip (`eventsCache.current` ref) to eliminate duplicate API requests when navigating dates.
  * Optimized API latency and bandwidth usage by filtering past sessions client-side using epoch timestamp comparisons.
* **Enhanced Security & GDPR Compliance**:
  * Prevented search engine indexing of sensitive user maintenance pages (like account deletion requests) by programmatically injecting `noindex, nofollow` robots tags.
  * Implemented sandboxed payment iframes to isolate transaction routes and protect sensitive financial screens.

## Timeline

July 2025 – May 2026

## Tech Stack

* **Core**: React 19, React DOM, JavaScript (JSX), Node.js 23.9
* **Bundler**: Vite 6
* **Routing**: React Router DOM v7 (incorporating `AnimatePresence` from Framer Motion for smooth, animated page transitions)
* **HTTP Client**: Axios (custom configurations)
* **UI & Animation**: Swiper (carousels), React Fast Marquee, Lucide React (icons), React Spinners (`ClipLoader`), Framer Motion
* **Inputs & Formatting**: React OTP Input, React Phone Input 2
* **Payment & QR**: QRCode (dynamic client-side QR generation for UPI scan-to-pay), PhonePe SDK
* **Styling**: 66 CSS Modules for complete style isolation
* **CI/CD**: GitHub Actions, lftp (automated FTP deploy to Hostinger)
* **Linting**: ESLint flat config
* **Package Manager**: Yarn 1.22
* **Hosting**: Hostinger (shared hosting, FTP deploy)
* **External APIs**: PhonePe (payment gateway), Neodove (CRM), Zoom (meeting links), WhatsApp (chat support)

## Routing Blueprint

The entry route tree defined in `App.jsx` maps 14 paths inside a shared `Layout.jsx` layout wrapper:

| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page outlining value offerings, membership options, stats, and testimonials. |
| `/tours` | `Trips` | Tour bookings with interactive carousels, callback requests, and custom trip builders. |
| `/subscription-plans` | `SubscriptionPage` | Overview of available membership pricing tiers (1, 3, 6, or 12-month packages). |
| `/subscription-plans/buy/:id` | `MembershipFlow` | Multi-step OTP authentication, profile setup, and UPI auto-pay mandate configuration. |
| `/sessions` | `SessionsPage` | Daily calendar of activities, guest lectures, expert panels, and workshop lists. |
| `/book/workshop/:workshopId` | `WorkshopBookingPage` | Multi-step booking workflow with voucher validation and sandboxed PhonePe iframe wrapper. |
| `/check-status` | `CheckStatusPage` | Decoupled polling screen checking workshop registration payment states. |
| `/redirect` | `RedirectPage` | Security gate for Zoom sessions verifying start times and logging attendances. |
| `/redirect/:id` | `CommunityRedirect` | Clean redirects to WhatsApp community channels (live sessions, trips, members). |
| `/account/request-delete` | `RequestDeletion` | GDPR-compliant deletion request form hidden from web crawlers. |
| `/about` | `About` | Company roots, founder profiles, core values, and journey milestones. |
| `/terms-of-service` | `TermsOfService` | Legal rules and service guidelines. |
| `/privacy-policy` | `PrivacyPolicy` | Data privacy guidelines and rules. |
| `/refund-policy` | `RefundPolicy` | Cancellation and refund conditions. |

## Key Features & Codebase Architecture

### A. PhonePe UPI Subscription & Autopay Mandates
Located at `src/Components/Subscription/PaymentFlow/` (managed by `PaymentFlow.jsx`):
* **Step 1 (OTP Verification)**: Authenticates the user against backend `/auth/init` and `/auth/verify` routes.
* **Step 2 (Details & Selected Plan Confirmation)**: Resolves user details using `/user/update` and retrieves membership details from `/membership/getPlanById`. Features tiered pricing, 1/3/6/12 month durations, and "Best Value" tags.
* **Step 3 (UPI Collection Selection)**:
  * **VPA Input**: Calls `/phonePe/autopay/validate-upi` to verify target UPI Virtual Payment Address (e.g. `user@okaxis`) and returns the account holder's name for validation.
  * **UPI Mandate Setup**: Invokes `/phonePe/autopay/setup` to initiate recurring autopay.
  * **QR Code UPI Flow**: Issues intent requests mapping to `com.google.android.apps.nbu.paisa.user` (Google Pay/generic UPI intent), rendering a scan-to-pay QR code dynamically using the `createQR` utility.
* **Step 4 (Status Check Polling)**: Checks the mandate verification status at `/phonePe/autopay/orderStatus?phone=91${phoneNumber}` to confirm when the client approves the authorization in their UPI app.
* **Step 5 (Final Status Card)**: Success/Failure status indicator equipped with a transaction-clearing retry payment flow.

### B. Workshop Booking & Voucher Discount Engine
Located at `src/Components/WorkshopBookingFlow/` (managed by `WorkshopBookingFlow.jsx`):
* **Enrollment Pre-Check**: Checks `workshop.participantList` upon OTP verification. If the authenticated phone number is already registered, it short-circuits the payment steps and routes directly to the completion step.
* **Voucher Validation**: Fetches active vouchers matching the user's phone via `/membership/getVouchers`. Filters for category `"workshops"`, supports flat rate discounts (`value`) or percentage off (`percent`), and displays a real-time price calculation breakdown.
* **Sandboxed Iframe Gateway**: For paid workshops, the app initiates payment with `/phonePe/initiatePayment`. The received PhonePe transaction URL is rendered inside a secure `iframe` modal overlay:
  ```html
  <iframe src={phonePeUrl} sandbox="allow-scripts allow-same-origin allow-forms allow-top-navigation allow-popups" />
  ```
* **Transaction Status Polling**: The overlay mounts a `10-minute (600s)` countdown timer. It polls `${globalThis.SERVER_URL}/phonePe/check-status` every `5 seconds` to automatically close the overlay and trigger success/failure screens.

### C. Highly Composed Sessions Directory
Located at `src/Components/SessionsPage/` (managed by `SessionsPage.jsx`):
This is a deeply layered component integrating 14 sub-views:
1. **SessionsHero**: Features Google Play and Apple App Store download badges, highlights live sessions running at the current time, and links to app installations. Includes a custom video player built from scratch.
2. **SessionSearch**: Provides quick date filters ("Today", "Tomorrow").
3. **UpcomingSchedule**: A custom horizontal calendar strip displaying a sliding window of the next 14 days. 
   * Uses a caching ref (`eventsCache.current`) keyed by date to prevent duplicate API calls to `/event/getEventsByDate`.
   * Incorporates a green event indicator dot on calendar pills once scheduling metadata is confirmed for that day.
   * Smoothly shifts horizontal translation (`transform: translateX(-offset * 78px)`) when users scroll through dates.
   * Filters out past sessions dynamically using epoch timestamp comparisons (`Number(ev.endTime) > Date.now()`).
4. **EventCard**: Dynamic categorization tags (e.g., Wellness, Fitness, Fun, Music) with customized styling classes. Includes a status indicator badge for active sessions.
5. **HappeningToday**: Horizontal slider containing today's sessions using Swiper carousel.
6. **Workshops** & **GuestSpeakers**: Dedicated grids grouping specialized classes and masterclasses.
7. **MeetExperts**: Autoplay Swiper carousel displaying detailed trainer profiles, qualifications, and schedules.
8. **RealMoments**: Grid showcasing photos of senior participants smiling, learning, and gathering.
9. **MemberReviews**: Slideshow showing reviews from long-term members.
10. **Stats**: Displays metrics (e.g., 2000+ sessions held, 5000+ seniors connected).

### D. Zoom Meeting Redirect Gate with Early-Join Lock
Located at `src/Components/Redirection/Redirect.jsx`:
Prevents early attendees from overloading Zoom meetings and registers session logs on the backend:
* **Base64 Decryption**: Inspects URL parameters for `data`, sanitizing URL-safe characters and running `atob`:
  ```javascript
  const decoded = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
  const [meetingLink, phone, id, subCategory, startTime] = decoded.split("|");
  ```
* **Early-Join Check**: Compares the current local time against the parsed meeting epoch start time:
  ```javascript
  if (new Date().getTime() + 20 * 60 * 1000 < Number(startTime)) {
    setIsEarly(true); // blocks entry
  }
  ```
  If the user attempts to join more than **20 minutes** before the start time, the app displays a restriction message indicating the exact join time allowed.
* **Attendance Logging & Redirect**: If within the 20-minute window, the app makes an API call to `${globalThis.SERVER_URL}/event/logSessionJoining`, logs the user's presence, and executes a redirection: `window.location.href = meetingLink`. Prevents duplicate joining.

### E. Security & GDPR Compliance
* **Account Deletion Request Page (`/account/request-delete`)**:
  * Contains verification logic using `PhoneInput` and a dynamic dropdown menu for deletion reasons.
  * Submits structured deletion requests to `/user/request-delete`.
  * **SEO Anti-Indexing Policy**: Programmatically injects a no-index meta header on mount and removes it on unmount to keep user account maintenance forms hidden from search engine crawlers:
    ```javascript
    useEffect(() => {
      const metaRobots = document.createElement("meta");
      metaRobots.name = "robots";
      metaRobots.content = "noindex, nofollow";
      document.head.appendChild(metaRobots);
      return () => document.head.removeChild(metaRobots);
    }, []);
    ```

### F. CRM & Call Support Integrations
* **Neodove Lead Integration**: The trip booking page and general query forms collect lead details (name, phone, query source, specific trip metadata) and send them directly to Neodove CRM via `neodoveService.js` using the `/neodove/create-lead` endpoint.
* **WhatsApp Support Widget**: Standard floating support button on all routes linking directly to WhatsApp customer support.
* **WhatsApp Group Redirection**: Sub-routes mapping WhatsApp invitations cleanly under `/redirect/:id`, preventing broken links and easing social onboarding for Live, Trips, and Member chats.

### G. Styling & Design System
* **CSS Modules**: Pure CSS Modules are used across the application to guarantee style isolation.
* **Color Palette** (Defined in `src/utils/Colors.js`):
  * Primary Brand Accent: Coral/Pink (`#ff8b81`)
  - Accent Beige: Warm tone (`#F2EBE2`)
  - Supporting: Dark Grey (`rgba(0,0,0,0.6)`), Pure Black, Pure White.
* **Responsive Layout**: Accommodates varying viewports, fixing Safari overlapping layout bugs, providing responsive mobile headers, sidebars, and custom calendar horizontal touch gestures.

### H. Build and Deployment Pipeline
* **CI/CD Pipeline**: GitHub Actions workflows on `push` to `master`:
  * Installs dependencies, triggers the production build `vite build`.
  * Transports the built package `/dist` assets securely to Hostinger Shared Hosting space using the `lftp` protocol.
* **Environment configurations**: Local, Dev, and Cloud config maps with auto-switching backend URLs and JWT-based API authentication.

## Challenges / What I'm proud of

**PhonePe UPI Payment Integration:** Integrated a full UPI payment flow from scratch including VPA collection, QR code generation for scan-to-pay, mandate creation, OTP verification, and post-payment processing — all coordinated across a 491-line state machine (`PaymentFlow.jsx`) managing 5 separate step components. Debugged and fixed retry payment errors, UPI UI issues, and subscription processing edge cases.

**Zoom Meeting Early-Joiner System:** Built a base64-encoded redirect system that decrypts meeting parameters from URL, checks the current time against the meeting start time with a 20-minute grace window, prevents duplicate joins for the same link, and logs session attendance to the backend — all in a single client-side component.

**Multi-Mode Payment Architecture:** Designed a flexible payment flow that supports both VPA (Virtual Payment Address) UPI and QR-based UPI payment, with a unified status-checking mechanism that polls PhonePe transaction status and provides real-time feedback.

**Sessions Page with 14+ Sub-Components:** Architected a deeply composable sessions page with 14 independent sub-components including a custom calendar strip with smooth horizontal scrolling, session search with day-based filtering, and a multi-section layout that handles today's live sessions, upcoming workshops, and historical sessions in one cohesive page.

**Responsive Design Edge Cases:** Solved complex iOS Safari viewport issues causing layout overlaps, reworked the calendar strip for tablet breakpoints, and built a fully responsive sidebar + header navigation system that works across all device sizes.

**Image & Asset Optimization:** Identified and removed unused assets, compressed large images to improve load times, and fixed case-sensitive import issues (e.g., `sujata.jpg` → `Sujata.jpg`) that caused builds to fail on case-sensitive filesystems.

**Full-Stack Ownership:** Single-handedly built the entire frontend (~24K lines added, 231 files changed) with no component library — every UI element from the custom video player to the carousel to the OTP input is hand-crafted. Set up CI/CD from scratch and managed production deployment.

## Links

GitHub: https://github.com/GoHappy-Club/Go-Happy-WebApp (private)
Live / Demo: https://www.gohappyclub.in
