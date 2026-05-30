# GoHappy Club Mobile Client

## Executive Summary

GoHappy Club is a React Native mobile application custom-built for **senior citizens (50+ years old)** in India to keep them active, physically fit, mentally stimulated, and socially connected. As the sole mobile engineer, I architected and built the entire application (iOS + Android) from scratch. The app features live interactive classes, community forums, short video reels (GeetMantra), mini-games, and charitable giving, supported by a localized UI, automated push campaigns, and custom payment sharing methods.

## Project Impact

* **High Engagement Scale**: Successfully serves and supports **over 30,000 active senior citizen users** across India, facilitating daily bookings, social posting, and payments.
* **Elder-Focused UX/UI Design**: Carefully optimized navigation, readability, and interaction states for seniors—utilizing large, readable fonts, clear touch targets, and frictionless sign-in flows (such as auto-reading OTP codes and simplified confirmation grids).
* **Cross-Generational Payment Integration**: Developed remotely shareable checkout links shortened via `ulvis.net`. This allows senior users to share payment carts to their children on WhatsApp so they can securely pay on the user's behalf.
* **Direct Business Conversion**: Unified native PhonePe SDKs and pro-rata subscription upgrading systems to smoothly convert free trial participants into paying members.
* **Robust Application Stability**: Refactored the core lifecycle hooks and AsyncStorage race conditions to achieve high crash-free sessions across legacy Android and iOS systems.
* **Deeply Localized Experience**: Standardized localization bundles supporting **5 Indian languages** (English, Hindi, Marathi, Punjabi, Gujarati) with device-level language auto-detection on launch.

## Timeline

July 2024 – May 2026

## Tech Stack

* **Framework**: React Native 0.77.3, Expo SDK 52
* **State Management**: Redux Toolkit (migrated to Zustand)
* **Auth**: Firebase Phone Auth (primary) & Gupshup SMS API (fallback)
* **Payments**: PhonePe PG SDK v1/v2, Paytring Native SDK
* **Analytics**: Firebase Analytics, Facebook Ads Event Logger, Branch.io
* **Deep Linking**: Branch.io SDK (deferred and direct routing for 30+ destinations)
* **OTA Deployment**: Revopush (CodePush)
* **Styling & Components**: `@gorhom/bottom-sheet`, `react-native-reanimated`, `lottie-react-native`, `react-native-paper`
* **Localizations**: `react-i18next` / `i18n` (5 languages)
* **Testing & Tools**: Jest, Husky hooks, patch-package

## Technical Integrations & Dependencies

| Library / SDK | Purpose | Key File Usage |
| :--- | :--- | :--- |
| `react-native-phonepe-pg` | Native PhonePe UPI transactions | [Payments.js](file:///Users/artemis/GHC/Go-Happy-Client/components/PhonePe/Payments.js) |
| `tambola` | Online Tambola ticket mathematical generation | [HomeScreen.js](file:///Users/artemis/GHC/Go-Happy-Client/screens/homeScreen/HomeScreen.js) |
| `react-native-youtube-iframe` | Embeds short video clips and reels | [Reels.js](file:///Users/artemis/GHC/Go-Happy-Client/components/Reels/Reels.js) |
| `rn-scratch-card` | Scratch and win voucher animation effects | [VoucherScratch.js](file:///Users/artemis/GHC/Go-Happy-Client/components/Rewards/VoucherScratch.js) |
| `react-native-view-shot` | Screenshot render for custom card creations | [Quotes.js](file:///Users/artemis/GHC/Go-Happy-Client/components/Quotes/Quotes.js), [CollageMaker.js](file:///Users/artemis/GHC/Go-Happy-Client/components/Collage/CollageMaker.js) |
| `@gorhom/bottom-sheet` | Payments, profile details, and donations bottom sheets | [DonationSheet.js](file:///Users/artemis/GHC/Go-Happy-Client/campaigns/components/DonationSheet.js) |
| `react-native-branch` | Generates short deep links with referral codes | [generateLink.js](file:///Users/artemis/GHC/Go-Happy-Client/services/BranchIO/generateLink.js) |
| `react-i18next` | Localization into 5 Indian languages | [i18n.js](file:///Users/artemis/GHC/Go-Happy-Client/i18n.js) |

## Key Features & Codebase Architecture

### A. Dynamic Startup & Server Resolution
* **Endpoint Switching**: On launch, the client runs a ping against primary App Engine servers and leverages **Firebase Remote Config** to pull target backend maps (`server_url`) based on active build numbers to support zero-downtime server upgrades.
* **Branch Onboarding**: Hooks into `react-native-branch` on launch to resolve deferred deep link referrals.

### B. User Authentication & Onboarding
* **Secure OTP Verification**: Integrated via `react-native-otp-verify` and `react-native-phone-number-input` to simplify the sign-in experience for elder users.
* **Onboarding Forms**: Captures name, DOB, age (used for restricting rewards/trips), city (selected using a custom bottom sheet), profile pictures via `react-native-image-crop-picker`, and emergency contact information.
* **FCM Synchronization**: Automatically synchronizes new device tokens and metadata to the App Engine database on successful registration.

### C. Home Dashboard & Free Trials
* **Overview Feed**: Highlights dynamic posters and slides pulled from `/home/overview`.
* **30-Day Free Trial Popups**: Recognizes new free users and invites them to initiate a free trial, automatically computing trial expiry date ranges.
* **Central Navigation**: Quick links grids routing users to the Reels section, Fun Zone, and Trips module.

### D. Subscription, Upgrades & Remote Payments
* **Virtual Cards**: Renders styled Gold (GoHappy Parivar membership) or Silver cards showing their name, masked phone number, coins, and plan validity.
* **Native PhonePe**: Leverages `react-native-phonepe-pg` for direct payment mandates.
* **Pro-Rata Upgrades**: Upgrading users receive a pro-rata discount on new plans based on the remaining value of their active subscription.
* **Payment URL Sharing**: Generates remote checkout URLs shortened via `ulvis.net` so that the user's children can complete payments on their behalf via WhatsApp. Used to comply with Apple App Store digital purchase guidelines.

### E. Sessions & Event Bookings (Tambola Included)
* **Schedule & Bookings**: Daily calendar lists upcoming Fitness, Learning, and Fun sessions.
* **Happy Coins Deductions**: Premium classes cost coins. On booking, coins are dynamically deducted from the user's membership balance.
* **Tambola (Bingo) Tickets**: When booking a Tambola event, the app invokes the `tambola` package to generate a valid ticket array on the fly.
* **In-App Grid Renderer**: During live sessions, a "Check Tambola Ticket" button mounts a custom modal. It parses the ticket string and renders a formatted 3x9 grid table (`react-native-table-component`) showing their active numbers and ticket reference ID.

### F. Spin the Wheel & Fun Zone
* **Engagement Engine**: Located under the "Fun Zone", users spend `250 Coins` to spin a lucky draw wheel.
* **Physics & Sound Effects**: Utilizes React Native Reanimated spring animations and deceleration curves to simulate wheel spins.
* **Prize Tiers**: Users can win **Internal Vouchers**, **External Vouchers**, **Physical Gifts**, **Bonus Coins**, or a fallback **No Prize (Better Luck Next Time)**.
* **HTML5 Games**: Features a Webview-based game repository (Gamezop) containing Chess, Ludo, Word Finder, Sudoku, Bubble Smash, and Fruit Chop, with custom JavaScript ad-blocker injections.

### G. Social Community Feed
* **Interactive Forums**: Divided into **For You** and **All** feeds.
* **Post & Image Sharing**: Users upload images, write posts, like posts (`PostLikers`), and comment on threads (`PostComments`).
* **Open Event Forums**: Booked events mount group chat directories (`EventDiscussion`) where participants converse with one another before/after the live session.
* **Public Profiles**: Seniors can tap user avatars to view their public achievements and posts.

### H. Daily Quotes & Card Sharing
* **Typewriter Animation**: Displays a daily Hindi & English inspirational quote with a typing transition that automatically scales font sizes relative to text length.
* **Watermarked Sharing**: When shared, the app renders a hidden view overlaying the user's avatar, name, and GoHappy logo onto the quote card. It takes a screen capture using `ViewShot` and shares the PNG on WhatsApp/social media along with a deep link referral URL.

### I. Smart AI Chatbot Support
* **Multi-Turn Assistant**: Built on `react-native-gifted-chat` hitting `/api/chat`.
* **Automated Support Escalation**: If the AI detects an emergency or unresolved complaint (`data.escalation === true`), it places the user under an **Escalation Hold** for 30 minutes, locking further keyboard input and posting a banner: *"Your issue has been escalated. Support will contact you shortly."*

### J. GeetMantra (Short Reels Player)
* **Reels Feed**: Vertical scrolling video feed (`FlatList` paging) pulling inspirational clips and bhajans.
* **Player Integration**: Uses `react-native-youtube-iframe` with custom overlays.
* **Promotional Directives**: Sponsors can inject promotional videos that deep-link directly into booking flows or external URLs.

### K. Push Notifications & Reminders
* **Multi-Channel Registration**: Sets up separate channels for General announcements, Daily Quotes, and Membership reminders.
* **Healthcare Support**: Implements custom scheduler templates for daily Medicine and Water intake reminders.
* **Stale Notification Evictions**: Cancels outdated reminders automatically when local booking states update to prevent duplication.

### L. Group Tourism (Trips)
* **Destinations Listing**: Details upcoming domestic and international tours.
* **Itineraries & Inquiry**: Provides complete schedules and booking requests.

## Challenges / What I'm Proud Of

**PhonePe v2 Integration:** Integrated a complex payment SDK with fragile state management. Built a wrapper that handles loading states, back navigation, success/failure callbacks, and iOS payment restrictions — all while the SDK was being developed alongside the app.

**Free Trial + Subscription State Machine:** Designed a complete membership lifecycle state machine covering free trial activation, expiration pop-ups, membership expiry, renewal, and cancellation — with complex edge cases like trial date overlaps and membership-with-trial transitions. Handle many recurring bug cases where the wrong prompt showed at the wrong time.

**App Stability & Crash Hunting:** Diagnosed and fixed notoriously difficult bugs — app stuck on splash screen (AsyncStorage race condition), white screen on navigation (reanimated error), fragment screen crashes on Android (navigation state mismatch), and ExoPlayer crashes (video component lifecycle). These required deep understanding of React Native internals and native bridge behavior.

**Revopush / CodePush OTA Pipeline:** Set up and maintained the entire OTA update pipeline with deployment key rotation, version-aware targeting, and CI/CD automation — critical for rapidly shipping fixes to 30,000+ active senior users without App Store review delays.

**Notification System Architecture:** Built a push notification system from scratch with local scheduling, cancellation-on-update logic to prevent duplicate reminders, and targeted notification channels — handling edge cases like silent notification filtering, reward notifications with dynamic screen navigation, and membership-based conditional scheduling.

**Multi-language at Scale:** Integrated i18n into a pre-existing codebase of 40+ screens and 100+ components, migrating every hardcoded string into 5 translation files. Built a language picker that persists across app restarts without requiring a full reload.

**Solo Ownership:** Delivered the entire app (Android + iOS) as the only mobile engineer — from architecture decisions to App Store/Play Store submissions, handling 1500+ commits across 2 years.

## Links

GitHub: https://github.com/GoHappy-Club/Go-Happy-Client
Live / Demo: Available on Google Play Store and Apple App Store as "GoHappy Club"
App Store :- https://apps.apple.com/in/app/gohappy-club-app-for-seniors/id6737447673
Play store :- https://play.google.com/store/apps/details?id=com.gohappyclient&hl=en_IN
