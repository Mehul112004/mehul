# GoHappy Backend

## Summary

GoHappy Backend is the robust core engine powering the GoHappy Club platform, a dedicated community engagement, learning, and wellness application tailored for senior citizens in India. As the sole backend developer over 22 months (~697 commits, 75% of total project commits), I designed, built, and maintained the entire server-side application, database schema, payment pipes, and automation workflows. The backend connects senior members through live interactive sessions, workshops, trips, and social feeds, supported by a gamified coin wallet and a tiered membership subscription system.

## Key Impact

* **Scale & Scalability**: Built a robust backend system that seamlessly manages and handles over **30,000 active users** during daily sessions, events, and transactional touchpoints.
* **Revenue Growth**: Designed and deployed the tiered subscription membership model from scratch (Free, Trial, Silver, Gold, Platinum). This implementation, coupled with PhonePe recurring payments, directly converted free users into recurring paying members, significantly increasing company revenue.
* **Streamlined System Architecture**: Optimized Firestore data storage by leveraging sub-collections (e.g., `MembershipTimeline` sub-collection under user profiles) and streamlining client-requested payloads, resulting in clean audit trails, reduced read/write billing costs, and data streamlining.
* **Improved Performance & Reliability**:
  * Decoupled cron workflows from application runtime resources, migrating cron jobs from Spring `@Scheduled` to Google Cloud Scheduler, resulting in optimized memory utilization, external observability, and Zero-Downtime deployments.
  * Designed budget-constrained weighted probability selection for the Spin the Wheel activity to control daily resource drain.
  * Implemented transaction locks (`firestore.runTransaction`) and ledger-based idempotency checks to prevent double-booking or double-crediting.

## What it is

A full-stack community engagement platform connecting members through live sessions, workshops, trips, and social features — with gamification, subscription memberships, and integrated payments. Built for older adults in India to discover and book wellness, learning, and travel experiences.

## My Role

Sole backend developer — designed and built the entire subscription membership system, payment infrastructure (PhonePe & Paytring), gamification engine (coins, vouchers, spin-the-wheel, scratch cards), admin tooling, analytics pipeline, CRM integrations, and background job orchestration. Contributed ~697 commits (75% of total project commits) across 22 months.

## Timeline

July 2024 – May 2026

## Tech Stack

**Language & Framework:** Java (8/16), Spring Boot 2.4.9, Spring Security, Spring Scheduling, Spring Actuator

**Database & Storage:** Google Cloud Firestore (NoSQL), Google Cloud Storage, Firestore BigQuery streaming export

**Auth & Security:** JWT (jjwt 0.11.5), Custom password encoder with salted + peppered hashing, Gupshup SMS OTP, Jasypt property encryption

**Payments:** PhonePe Payment Gateway (one-time payments + subscription autopay with UPI/VPA), Paytring Payment Gateway, Razorpay

**Messaging & Notifications:** Firebase Cloud Messaging (FCM push), SendGrid (email), Getgabs/AiSensy (WhatsApp), Gupshup (SMS)

**Integrations:** Zoom API (meetings, recordings, rewards), Neodove CRM (sales leads), Calendarific (festival/holiday data), Getgabs webhook (WhatsApp chatbot)

**Analytics:** Google BigQuery (Firestore streaming export), custom onboarding funnels, churn analysis, revenue metrics (MRR, ARPU, ARPPU)

**Infrastructure:** Google Cloud Platform (App Engine, Secrets Manager, Cloud Scheduler, Cloud Build), CircleCI, Docker

**Other:** Maven, Lombok, OpenCSV, Swagger 2 (Springfox), OkHttp, Unirest, FastJSON, Apache Commons, Guava, JUnit 5

## Key Features & Codebase Architecture

### Authentication & User Profiles
* **Paths**: [AuthController.java](file:///Users/artemis/GHC/Go-Happy-Backend/src/main/java/com/startup/goHappy/controllers/AuthController.java) & [UserProfileController.java](file:///Users/artemis/GHC/Go-Happy-Backend/src/main/java/com/startup/goHappy/controllers/UserProfileController.java)
* **SMS OTP Verification**: Two-factor authentication implemented via the Gupshup REST API for user login and signup.
* **Profile Management**: Stores age, city, date of birth, emergency contacts, streak data, and last active parameters. Automatically updates FCM tokens for targeted push notifications.
* **Account Deletion**: Supports both requested and immediate deletion. Sends user farewell emails and notifies the operations team with detailed user demographic data (reason for leaving, coins remaining, sessions attended, device type, etc.).
* **Security & Access Control**: 
  * Custom JWT authentication with role-based access controls (`ADMIN`, `RELATION_MANAGER`, `USER`) and token expiry in response.
  * Custom password encoder with fixed salt + pepper, multi-URL CORS whitelisting, and admin login restriction capability.
  * Migrated all secrets (API keys, passwords, tokens) from local dotenv files to GCP Secrets Manager with `sm://` references.

### Referral & Engagement Streaks
* **Self-Invite Codes**: Generates a unique 6-character invitation code for each profile upon registration.
* **Referral Rewards**: Tracks referrers. When a referred friend attends their first session, the referrer is automatically rewarded with 200 coins, logged via a referral credit transaction.
* **Streak Tracking**: Tracks user streaks (`streak`, `lastStreakUpdate`) to boost daily user engagement.

### Membership & Subscription System
* **Path**: [MembershipController.java](file:///Users/artemis/GHC/Go-Happy-Backend/src/main/java/com/startup/goHappy/controllers/MembershipController.java)
* **Tiered Memberships**: Silver, Gold, Platinum, and Premium tiers configured in Firestore.
* **Subscription Lifecycle**: Built the complete subscription lifecycle with PhonePe autopay (UPI mandate-based recurring payments with penny-drop auth flow).
* **Trial Flow**: Implemented free trial system (2-day initial + 14-day extension eligibility) with session quota enforcement and automated 1-month trial activations.
* **Soft-Downgrade Logic**: Paused memberships auto-unpause on schedule; expired trials auto-revert to the free tier.
* **Timeline Logging**: Designed `MembershipTimeline` subcollection logging every lifecycle event (trial start/end, subscription pause/resume/cancel, renewals, plan changes) with actor attribution (User/System/Admin).
* **Vouchers**: Manages category-specific vouchers (e.g., trips, sessions) linked to memberships that users can redeem during booking.

### Payments Infrastructure
* **PhonePe Integration**: Supporting 5 payment types (contribution, workshop, subscription, renewal, upgrade) with SHA-256 checksum signing and OAuth-based v2 API.
* **Paytring Integration**: Integrated Paytring as a secondary payment gateway with webhook-based order verification, termination handling, and 10-second idempotency delay.
* **Webhook & Callback Processing**: Autopay callback handling including subscription setup callbacks, payment success notifications, and redemption execution with retry strategies.
* **Security Workaround**: Implemented merchant transaction ID deduplication in the database layer to handle PhonePe's double-callback production issue, preventing double-crediting.

### Gamification & Coin Ledger
* **Coin Economy**: Coin packages for purchase, monthly coin credits for members, and an atomic coin transaction ledger (`CoinTransactions`) with source tracking.
* **Ledger Audits**: Debits/credits tracked for booking sessions, buying Tambola tickets, upgrading, referrals, and scratch card rewards.
* **Scratch Cards**: Random weighted prize allocation, one-time claim per user.

### Interactive Activities (Spin the Wheel, Tambola, Karaoke)
* **Spin the Wheel**:
  * **Path**: [SpinWheelController.java](file:///Users/artemis/GHC/Go-Happy-Backend/src/main/java/com/startup/goHappy/controllers/SpinWheelController.java)
  * **Budget & Weight Logic**: Selects prizes dynamically using a budget-constrained weighted probability algorithm. Base weights are calculated via `expenseRating` (2^exponent) and stock levels. High-value prizes are blocked if the remaining daily budget is exceeded.
  * **Pity Timer**: Automatically checks the last two spins. If both resulted in "NONE", it guarantees a win on the current spin to prevent player frustration.
  * **Prize Types**: Handles automated coins crediting, creating internal coupon vouchers, claiming external codes from `PartnerInventory`, and physical prizes.
  * **Budget Rollover**: Daily budget scheduler caps total coin/voucher payouts per day, auto-resets daily.
  * **Partner Collaboration Vouchers**: Inventory-managed external vouchers claimed from partner stock during spins, with bulk import and stats dashboard.
* **Tambola (Housie)**: 
  * Generates virtual Tambola tickets (90-number grid) upon booking. Manages extra ticket purchases in exchange for coins, Tambola initialization with shuffled 1-90 number caller, and live game state management.
* **Karaoke Form Manager**:
  * **Path**: [KaraokeFormController.java](file:///Users/artemis/GHC/Go-Happy-Backend/src/main/java/com/startup/goHappy/controllers/KaraokeFormController.java)
  * Admin customizes fields (required inputs, options, conditions). Enforces a weekly limit of 1 singing registration per user. Assigns a queue turn number to singers via transaction locks.

### Sessions & Event Management
* **Path**: [EventController.java](file:///Users/artemis/GHC/Go-Happy-Backend/src/main/java/com/startup/goHappy/controllers/EventController.java)
* **Event Scheduling**: Supports single events and recurring sessions generated dynamically using Unix cron expressions.
* **Zoom Meeting Creation**: Automatically creates meetings via the Zoom API, configures join-before-host settings, passcode, and records the meeting ID and join link.
* **Smart Attendance (Zoom Report Tracking)**: A daily cron job (`RewardsJob`) pulls Zoom participant lists, checks if the user's join duration is at least 60% of the maximum participant time, and automatically grants coin cashback.
* **Waitlists & Capacity**: Enforces capacity check (`seatsLeft`). Paid members get unlimited access, while free/expired members have booking limitations and duplicate booking prevention.
* **Ratings**: Feedback rating system with sub-categories, feedback-gated rewards (coins awarded on submission, not just joining).
* **Workshops**: Booking with rupees (real-money payment via PhonePe/Paytring), cashback coins per event.

### Trips & Travel
* **Trip Bookings**: Built trip booking system with voucher/discount applicability, and campaign URLs for Neodove lead generation.
* **Flyers**: Trip flyer generation service and image carousel configuration.
* **Admin Controls**: Admin controller for trip add/update operations with audit logging.

### Social & Community
* **Path**: [CommunityController.java](file:///Users/artemis/GHC/Go-Happy-Backend/src/main/java/com/startup/goHappy/controllers/CommunityController.java)
* **Feed Customization**: Standard, Event-specific, and "For You" (posts from user's booked events) feeds.
* **Social Actions**: Create, edit, delete posts; toggle likes; add comments; upload images to GCS; report offensive posts.
* **Moderation**: Supports pinning global or event-specific posts, unpinning posts, and community post moderation.
* **Reels**: Reels functionality with category-based video filtering and ad integration.

### Campaigns & Donations
* **Path**: [DonationController.java](file:///Users/artemis/GHC/Go-Happy-Backend/src/main/java/com/startup/goHappy/controllers/DonationController.java)
* **Atomic Transactions**: Users donate coins to active campaigns using `firestore.runTransaction` to safely decrement user coins and increment campaign funds.
* **Idempotency Protection**: Ledger logs ensure the same payment request is not processed twice. Automatically updates campaign status to `FUNDS_GATHERED` when goals are met.

### Neodove CRM Integration
* **Campaigns**: Built full Neodove integration with 6 campaign types: app login failed, registered-not-booked, booked-not-joined, payment failed, free-trial-ended-engaged, and engaged user nurturing.
* **Automated Sync**: Automated lead creation from cron-triggered membership expiry jobs — enriched with user stats (sessions joined, last payment, device, age, city, source) for sales team follow-up.

### Admin Tooling & Audit
* **Audit Logging**: Built comprehensive admin audit logging system: event-driven architecture with listeners capturing admin actions (create/update/delete of coins, festivals, videos, refunds, posters, events) via `AdminAuditLogService`.
* **Admin Dashboard Controllers**: Admin controllers for all domains: event templates, membership management, spin prizes, partner inventory, daily budget, coin packages, karaoke, community moderation.
* **Operations Tools**: User CSV export with structured columns, refund transaction API, and paginated transaction history.

### Analytics Pipeline
* **Telemetry**: Built 20+ BigQuery analytics endpoints covering onboarding funnel (login → registration → free trial → first session → payment), churn analysis (inactivity before/after trial, cancellations by duration, cohort retention), revenue metrics (MRR, ARPU, ARPPU, trial-to-paid conversion), and engagement metrics (DAU, MAU, booking-to-joining rate).
* **SQL Queries**: Designed queries with CTEs for deduplication and timezone-aware IST date formatting via `TIMESTAMP_MILLIS` with `Asia/Kolkata` zone.

### Automation, Background Jobs & CRON Tasks
* **Cloud Scheduler Transition**: Migrated all cron jobs from Spring `@Scheduled` to HTTP endpoints for Google Cloud Scheduler orchestration.
* **Targeted Marketing Nightly Job (`TargetedMarketingController`)**:
  * *Target 1*: Informs new free trial users to claim/activate their trial via push notifications and WhatsApp.
  * *Target 2*: Prompts free members with exhausted trials to upgrade.
  * *Target 3 (Inactive Users)*: Detects users inactive for 7+ days and fires Firebase multicast messages. Unregistered/bad Fcm tokens are automatically cleaned up, marking the user profile as inactive.
  * *Target 4*: Prompts old free active users to start their trial.
  * *Incomplete Registration*: Detects registrations missing a name within 24 hours and triggers follow-up WhatsApp notifications.
* **Daily Reminder Job (`DailyReminderJob`)**:
  * Sends automated SendGrid reminder emails to booked participants 1 hour before their Zoom sessions.
* **Membership Trial Expiry (`MembershipJob`)**:
  * Automatically downgrades users with expired free trials. If the user was highly engaged (attended > 4 sessions), it pushes a sales lead to **Neodove CRM** for lead nurturing.
* **Daily budget rollover (`DailyBudgetJob`)**:
  * Rolls over unspent daily budget balances (Accumulated + Approved - Spent) to the next day.

## Challenges / What I'm proud of

**PhonePe Subscription Autopay:** Integrated PhonePe's UPI autopay subscription flow end-to-end — the most complex payment integration in the project. Includes VPA validation, penny-drop auth, mandate setup with device OS context, recurring payment notification, redemption execution with retry strategies, and cancellation with timeline logging. Handles 9 distinct PhonePe subscription API endpoints with environment-aware URL switching (sandbox/preprod/prod).

**Spin Wheel Weight Algorithm:** Designed a probabilistic prize selection system that balances player experience with business constraints. The two-tier algorithm first selects a slice group by cumulative weight, then picks within the group — with weights derived from a formula factoring expense rating (2^exponent), stock availability (log factor), and remaining daily budget (zero-weight gate). A pity timer guarantees a win after 2 consecutive losses, preventing player frustration.

**BigQuery Analytics from Firestore:** Built an analytics layer directly on Firestore's BigQuery streaming export — a non-trivial challenge given Firestore documents are stored as JSON strings. Wrote complex SQL with CTEs for deduplication (e.g., finding "first session booked" requires joining bookings in range against prior bookings) and IST timezone normalization using `TIMESTAMP_MILLIS` with `Asia/Kolkata` zone.

**Migration from Cron to Cloud Scheduler:** Migrated all 6+ background jobs from Spring's `@Scheduled` annotation to HTTP endpoints triggered by Google Cloud Scheduler — enabling independent scaling, better observability, and external orchestration without redeploys.

**Secrets Management Migration:** Migrated all secrets (API keys, passwords, tokens) from local dotenv files to GCP Secrets Manager with `sm://` references, eliminating the risk of secrets leaking in source code or build artifacts.

**Handling PhonePe Double-Callback:** PhonePe's payment gateway sometimes sends duplicate callbacks. Implemented idempotency via merchant transaction ID deduplication in the database layer to prevent double-crediting memberships, coins, or workshop bookings.

## Links

GitHub: https://github.com/GoHappy-Club/Go-Happy-Backend (private)
Live / Demo: none
