# Wallulu
## What it is
A mobile wallpaper browsing app built with React Native (Expo) that lets users discover, search, and filter high-quality wallpapers from the Pixabay API. Built for users who want a beautiful, fast experience to find wallpapers by category, color, orientation, and more.
## My Role
Sole developer — designed and built the entire application from scratch, including architecture, UI/UX, API integration, animations, and all feature development.
## Timeline
April 2024 – May 2024
## Tech Stack
- **Framework**: React Native (0.73.6), Expo (SDK 50), Expo Router (file-based routing)
- **Language**: JavaScript (ES6+)
- **State Management**: React hooks, local component state
- **API Client**: Axios
- **Backend/Data**: Pixabay API
- **UI Components**: @shopify/flash-list (MasonryFlashList), @gorhom/bottom-sheet, expo-blur, expo-image, expo-linear-gradient, react-native-indicators, react-native-intersection-observer
- **Animations**: react-native-reanimated, Animated API
- **Gestures**: react-native-gesture-handler
- **Navigation**: expo-router, @react-navigation/native
- **Utilities**: lodash (debounce), moment, @expo/vector-icons
- **Device APIs**: expo-file-system, expo-linking, expo-web-browser, react-native-safe-area-context, react-native-screens
- **Build & Deployment**: EAS Build (Expo Application Services), expo-splash-screen
- **Testing**: Jest, jest-expo, react-test-renderer
- **Platform Support**: iOS, Android, Web
## Key Features / What I built
- **Welcome/Onboarding Screen**: Full-screen branded welcome page with background image, gradient overlay, and staggered fade-in/slide-up entry animations using react-native-reanimated.
- **Masonry Image Grid**: Built a responsive masonry layout using `@shopify/flash-list` with dynamic column counts based on device width — 2 columns on mobile, 3 on tablet, 4 on desktop.
- **Dynamic Image Sizing**: Images auto-size based on their aspect ratio to maintain proportions in the grid, preventing uniform-height distortions.
- **Search with Debounce**: Implemented a search bar with 400ms debounced text input that queries the Pixabay API, resets filters and pagination on new searches, and includes a clear button.
- **Category Browsing**: Horizontal scrollable category bar with 21 predefined categories (backgrounds, nature, animals, sports, etc.) — selecting a category filters the image feed.
- **Advanced Filter Modal**: Custom bottom sheet modal (using `@gorhom/bottom-sheet`) with blurred backdrop. Filters include sort order (popular/latest), orientation (horizontal/vertical), image type (photo/illustration/vector), and 11 color filters with colored swatch UI.
- **Active Filter Pills**: When filters are applied, they appear as dismissible pills below the search bar — color filters show the actual color swatch, text filters show the value, each with an individual dismiss button.
- **Infinite Scroll / Pagination**: Intersection observer-based infinite scroll that loads 25 images per page from the Pixabay API, appending or replacing results based on context.
- **Full-Screen Image Modal**: Tapping an image opens a full-screen preview with a blurred dark background, loading spinner, and Back/Download buttons, presented as a transparent modal route.
- **Empty State Handling**: Graceful "No images found" display when API returns no results.
- **Platform-Specific Styling**: Search bar uses `Platform.select` for iOS/Android padding differences.
- **Staggered Entrances**: Category items and image cards animate in with staggered delays for a polished scrolling experience.
## Challenges / What I'm proud of
- **React Hooks Error (Module-Level Hook Bug)**: `helpers/common.js` originally used `useWindowDimensions()` at the module scope (outside a React component), causing a runtime crash. Debugged and fixed by replacing it with the `Dimensions.get('window')` API, which works at the module level — understanding the difference between React hooks and imperative APIs was key.
- **TypeScript to JavaScript Migration**: The project started as the default Expo TypeScript template with `.tsx` files and `tsconfig.json`. Fully migrated to JavaScript, removed TypeScript dependencies, and stripped all TS-related configs to simplify the build pipeline.
- **Environment Variable / API Key Security**: Accidentally committed the Pixabay API key to git history. Removed and cleaned up across multiple commits, then rebuilt using `EXPO_PUBLIC_API_KEY` environment variables and EAS Build secrets.
- **Bottom Sheet with Filters**: Building the filter modal with `@gorhom/bottom-sheet` required careful state management — filters reset pagination, clear results, and re-fetch data seamlessly. The animated blur backdrop with `expo-blur` tied to the sheet's animated index for smooth transitions was a challenging integration.
- **Multiple Data Sources Coexisting**: The app supports simultaneous search queries, category filters, and advanced filters — any combination triggers a pagination reset and fresh API call. Managing the interplay between `search`, `activeCategory`, `filters`, and pagination state without race conditions was nontrivial.
- **Download Functionality Attempt**: Attempted to implement wallpaper download using `expo-file-system` and `expo-media-library`, navigating permissions and file storage — a work-in-progress feature at the end of the timeline.
## Links
GitHub: https://github.com/Mehul112004/Wallulu
Live / Demo: (none)
