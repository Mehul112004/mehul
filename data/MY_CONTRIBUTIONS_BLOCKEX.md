# Blockex
## What it is
A native Safari browser extension (macOS & iOS) that blocks specific websites and hides unwanted web elements like YouTube Shorts, using Manifest V3 APIs with a Swift-based container app.
## My Role
Sole developer — designed and built the entire product end-to-end: the iOS/macOS container app in Swift, the Safari Web Extension in JavaScript (content script, popup UI, background service worker), the native messaging bridge, and the comprehensive README documentation.
## Timeline
Feb 2026
## Tech Stack
- Swift 5.0, UIKit, WebKit, SafariServices, os.log
- JavaScript (ES modules, async/await, Promise wrappers)
- Manifest V3 (Web Extension APIs)
- HTML5, CSS3 (light/dark mode, Apple system design language)
- `browser.storage.local`, `declarativeNetRequest` (dynamic rules), `MutationObserver` API
- Xcode 26.2, iOS 17.0+ / macOS 14.0+
- No external dependencies (zero third-party packages or libraries)
## Key Features / What I built
- **Dual-layer URL blocking** — Primary blocking via `declarativeNetRequest` (network-level, blocks before page loads) with a content script fallback that replaces the DOM with a "Page Blocked" screen, pausing and removing all `<video>`/`<audio>` elements before DOM replacement to prevent lingering media playback.
- **YouTube Shorts element hiding** — Toggleable feature that hides Shorts across YouTube using targeted CSS selectors for YouTube's custom web components (`ytd-rich-section-renderer[is-shorts]`, `ytd-reel-shelf-renderer`, `[href*="/shorts/"]`, `yt-tab-shape[tab-title="Shorts"]`, `ytd-shorts`), with a `MutationObserver` continuously re-hiding elements as YouTube dynamically loads them.
- **SPA navigation detection** — `MutationObserver`-based URL change detection that re-triggers blocking and hiding checks on client-side navigations (e.g., React Router), since SPAs don't fire traditional page loads. Also hooks `popstate` events as an additional signal.
- **Popup UI with declarative rule management** — 320px popup with URL input, blocked sites list with remove buttons, accordion-based "Hide Elements" section with custom checkbox toggles, auto-hiding error messages, and batch `declarativeNetRequest.updateDynamicRules()` that removes all rules and re-adds them with stable IDs using domain-anchor (`||`) prefixing.
- **URL normalization** — Parses and normalizes various user input formats (bare domains, full URLs with/without protocol, paths) into consistent patterns for both storage and declarativeNetRequest matching, with deduplication checks.
- **Cross-platform Safari extension** — Full native iOS/macOS container app (`WKWebView` hosting a landing page), extension target embedded via `Foundation Extensions` build phase, and `SafariWebExtensionHandler` bridging native messages with `@available` checks for iOS 15/17 and macOS 11/14 API compatibility.
- **Cross-browser API compatibility** — `const api = typeof browser !== "undefined" ? browser : chrome;` shim enabling the same code to work in Safari (`browser` namespace) and Chrome-based browsers (`chrome` namespace).
- **Dark mode support** — Popup CSS uses `prefers-color-scheme: dark` media query with CSS custom properties for system-matching light/dark themes using Apple's semantic colors.
- **Persistent local storage** — All user data (`blockedSites`, `hiddenFeatures`) stored via `browser.storage.local` with Promise-based wrapper functions for the callback-based API.
## Challenges / What I'm proud of
- **Safari extension architecture is non-trivial** — Unlike Chrome extensions, Safari requires a native container app (Swift/UIKit) that embeds the extension. Built the full Xcode project with proper target dependencies, code signing, and `SafariWebExtensionHandler` for native messaging — all from scratch as a first-time Safari extension developer.
- **SPA blocking is inherently difficult** — Traditional URL blocking fails in SPAs because pages don't reload. Solved this with a `MutationObserver` on the entire document (subtree + childList) to detect URL changes, re-running the blocking check on every route transition. This alone handles React, Vue, Angular, and similar frameworks.
- **YouTube's dynamic DOM is a moving target** — YouTube renders Shorts content via custom web components that are injected asynchronously and can vary by page context (homepage shelf vs. watch page sidebar vs. channel page tab). Mapped 5 distinct selectors and used `MutationObserver` with continuous re-checks to keep up with YouTube's dynamic rendering, plus an exclusion for `/results` pages to avoid false matches.
- **Stopping media before DOM replacement** — A subtle but critical edge case: if a blocked page has playing video/audio, replacing `document.body.innerHTML` doesn't reliably stop it in all browsers. Added proactive `pause()`, `mute()`, `src = ""`, and `remove()` on all media elements before nuking the DOM — a bug fix driven by real testing.
- **Declarative Net Request API is restrictive** — DNR requires preset rules and doesn't support wildcard matching natively. Used domain-anchor (`||`) prefixing to match subdomains and path variations, and implemented a total-rule-rebuild strategy (remove all → add all with stable sequential IDs) to keep the rule set consistent with the stored sites list.
- **Promise wrappers for legacy browser APIs** — `browser.storage.local` in Safari uses callbacks rather than promises. Wrote `getStorage()`/`setStorage()` wrappers that return promises for clean `async/await` usage throughout the codebase.
- **Zero dependencies** — The entire product (Swift app + JS extension + UI) uses no third-party packages, CocoaPods, or npm modules. Every line is hand-written against native platform APIs.
## Links
GitHub: private
Live / Demo: none
