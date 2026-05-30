# MayaX — AI Interior Design Platform

## What it is
A React Native mobile app that lets users upload photos of their rooms, describe a desired style with a prompt, and receive AI-generated interior design transformations. Designed for homeowners, renters, and design enthusiasts looking to visualize room makeovers before committing.

## My Role
Sole developer — architected the monorepo, built the full Flask backend with Supabase integration, developed the entire React Native (Expo) client from scratch, implemented a custom AI inference pipeline, and added on-device machine learning capabilities.

## Timeline
Jan 2026 – Apr 2026

## Tech Stack
- **Frontend:** React Native, Expo SDK 54, React Navigation (native-stack + bottom-tabs), React Context API, react-native-executorch, react-native-reanimated, react-native-paper, react-native-svg, @rneui/themed, @rneui/base, expo-linear-gradient, expo-blur, expo-camera, expo-image-picker, expo-file-system, expo-secure-store, expo-crypto, expo-web-browser, expo-auth-session, expo-asset, expo-status-bar, lucide-react-native, Ionicons, axios, AsyncStorage, @react-native-community/netinfo, react-native-reanimated-carousel, react-native-gesture-handler, react-native-safe-area-context, react-native-screens, react-native-worklets
- **Backend:** Flask, Flask-CORS, PyJWT, bcrypt, python-dotenv, HuggingFace ecosystem (transformers, diffusers, accelerate, safetensors), opencv-python, numpy, Pillow, scipy, tqdm, Supabase Python client
- **Database & Storage:** Supabase (PostgreSQL + Storage buckets)
- **AI/ML:** react-native-executorch + Llama 3.2 1B (on-device prompt refinement), Ollama + llava:13b (image captioning), LoRA models (.safetensors), Stable Diffusion inference engine
- **Data Pipeline:** Pexels API, Unsplash API, Ollama local server
- **DevOps:** Git, conda, ngrok

## Key Features / What I Built

### Backend (Flask + Supabase)
- Full REST API with 6 route blueprints: auth, user, design, preferences, feed, and projects
- JWT-based authentication with bcrypt password hashing and a custom `@require_auth` decorator middleware
- Signup/login endpoints with email uniqueness validation, 30-day session tokens
- Profile completion flow supporting both JSON and multipart/form-data, including Base64 image decoding
- Deterministic initials-based avatar generator using Pillow — extracts initials from name, picks from a curated color palette, draws centered text, and uploads to Supabase Storage
- CRUD operations for projects: create (image upload + inference), edit (prompt + mode variations), update title/description, delete with ownership verification
- Design generation endpoint: uploads original image to Supabase, inserts project record, calls remote Stable Diffusion inference API, uploads generated result back to storage
- Design editing endpoint: supports "flexible" and "preserve" modes for different transformation behaviors, saves each edit as a variation in `project_variations` table
- "For You" feed endpoint: joins projects with user info, sorts by likes then recency
- User profile endpoint with computed stats (project count, inspiration count) via Supabase count queries
- Inspirations system: like/unlike projects with duplicate prevention, self-like blocking, and join queries to return project data
- Preferences API: serves dynamic camera preference categories (colors, aesthetics, space types) from database with seed functionality
- Designs API: serves design catalog with auto-seeding for empty databases
- Supabase Storage integration for two buckets (avatars, projects) with structured path naming (`avatars/{user_id}/{uuid}.png`)
- Error handling with full tracebacks in development

### Frontend (React Native / Expo)
- Complete auth flow: Stack Navigator with conditional rendering (auth screens → onboarding → main app tabs) based on context state
- 16 screens including: Start, Onboard, Login, SignUp, CompleteProfile, EditProfile, Home, Create, Details, Edit, SaveImage, SimilarDesign, ProjectDetails, Profile, Activity, AICapabilities
- Create Screen (1154 lines): multi-step form with camera capture, image picker from gallery, 3-section preferences accordion (colors, aesthetics, space type), prompt text input, and full generation pipeline with loading states
- Edit Screen (523 lines): image transformation with variation history, mode toggle (flexible/preserve), prompt refinement, and save functionality that updates project image
- Project Details Screen (782 lines): full project view with original/generated image toggle, variation carousel, like/unlike, edit/delete owner controls with modal editing
- Home Screen: "For You" feed with trending projects, design inspiration grid
- Profile Screen with nested scrolling, profile stats, image grids for projects and saved inspirations, logout, and profile editing
- AI Capabilities Screen: toggle UI for on-device LLM with status indicator (idle/downloading/ready/failed) and download progress bar
- Bottom tab navigator with custom floating center camera button (elevated circle with shadow)
- All forms support keyboard-avoiding behavior on iOS

### On-Device AI (Edge AI)
- Integrated react-native-executorch with Expo Resource Fetcher to run Llama 3.2 1B entirely on-device for prompt refinement
- Custom EdgeAIContext provider managing model lifecycle: download state, progress tracking, error handling, and readiness
- Queue system: if a user submits a prompt while the model is still downloading, the request is queued and resolved automatically once the model is ready
- No-UI-interrupt patterns — handles concurrent prompt refinement requests without dropping any
- Network connectivity check before initiating model download
- System prompt engineering for interior design: transforms rough user ideas into detailed, generator-optimized descriptions covering room type, materials, textures, lighting, color palette, and camera framing

### Loading & UX Polish
- Custom DesignLoadingOverlay with animated skeleton card placeholders (using @rneui/themed Skeleton components)
- Smooth fade-out + scale animation when generation completes, triggered by `isBackendDone` flag
- Loading state management across async operations (image upload, inference, storage upload)
- StatusBar style management via `useFocusEffect` to adapt between light and dark content bars per screen
- Debounced camera preference loading with auto-seeding fallback

### Data Pipeline & Training Infrastructure
- Pexels image scraper: queries 5 interior design styles (Modern Indian, Scandinavian, Industrial, Bohemian, Luxury), downloads up to 100 per style with pagination and rate limiting
- Unsplash image scraper: supplementary image collection from Unsplash API
- Preprocessing script: smart crops images to 512x512 while preserving aspect ratio, converts to standard formats
- Auto-captioning with Ollama + llava:13b: generates detailed room descriptions covering style, furniture, textures, and lighting, prefixed with trigger tokens for fine-tuning
- LoRA model file (`mayax_style_pack.safetensors`) for style transfer fine-tuning

### Bug Fixes & Refinements
- Fixed tab bar icons not rendering visible — resolved icon rendering issues and restyled tab bar layout across BottomTabs, ProfileHeader, ProfileStats, ProfileScreen, and ImageGrid
- Fixed loading overlay animation problems — refactored 50 lines in DesignLoadingOverlay.js to handle edge cases in fade-out timing and visibility state management
- Refactored profile loading to differentiate initial profile load from silent background refreshes, preventing UI flicker on re-mount
- Enabled nested scrolling on profile screen for smooth tab-based content browsing

## Challenges / What I'm Proud Of
- **On-Device AI Pipeline:** Running a full Llama 3.2 1B model on a mobile device via ExecuTorch was non-trivial — involved managing download state, memory constraints, and queuing prompts during model initialization. The model rewrites user prompts into highly detailed interior design specifications entirely offline.
- **Complex Async State Orchestration:** The design generation flow chains multiple async operations (image upload → DB insert → remote inference → result upload) with proper loading states, error handling, and user feedback at each stage. The loading overlay needed precise coordination with the backend completion signal to trigger smooth exit animations.
- **Full-Stack Ownership:** From scraping training data and auto-captioning images with LLaVA, to deploying a Flask API with JWT auth, to building a polished React Native UI with 16 screens — every layer of this product was built independently.
- **Polished Design Loading Experience:** The skeleton card overlay with animated fade-out provides meaningful feedback during what would otherwise be a long blank wait for AI inference (which can take 60–120 seconds).

## Links
GitHub: private
Live / Demo: none
