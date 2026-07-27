# Genesis Sync (formerly Loopin) — Phase-Wise Implementation Roadmap

**Project Vision:** A high-performance, Capacitor-powered native Android application & web PWA serving as the instant networking layer and community portal for Genesis hackathons and meetups.

---

## Roadmap Overview & Milestones

```
+-------------------------------------------------------------------------------------------------+
|                                     PHASE-WISE TIMELINE                                         |
+-------------------------------------------------------------------------------------------------+
| Phase 1 (W1-W3) | Core Web PWA Prototype & Local Testing Engine                                |
| Phase 2 (W4-W5) | Native Android Integration (Capacitor + Hardware Bridge)                       |
| Phase 3 (W6-W7) | Genesis Community Hub, Feed & Real-Time Push                                  |
| Phase 4 (W8-W9) | Security Hardening, Scale Testing & Android Production Build                  |
| Phase 5 (Post)  | Ecosystem Expansion & Advanced Analytics                                       |
+-------------------------------------------------------------------------------------------------+
```

---

## Phase 1: Core Web PWA Prototype & Local Testing Engine
**Duration:** Weeks 1 – 3  
**Objective:** Build the core React web application and validate the scan-and-connect loop in a local browser environment before touching native code.

### 1.1 Architecture & Setup
- [ ] Initialize React + TypeScript project using Vite (`vite@latest --template react-ts`).
- [ ] Set up Tailwind CSS, UI design token system, and icon library (Lucide React).
- [ ] Configure local state management (Zustand) with encrypted LocalStorage persistence.
- [ ] Set up API client layer (Axios/Fetch) with request interceptors for auth tokens.

### 1.2 Authentication & User Onboarding
- [ ] Implement passwordless Email/SMS OTP login screens with auto-focus inputs.
- [ ] Build global hacker profile creation flow (Name, Bio, Core Tech Stack, Avatar upload).
- [ ] Create event-scoped profile screen with single-line project pitch ("What I'm building/looking for").
- [ ] Implement granular social link visibility toggles (GitHub, LinkedIn, X, Discord, Portfolio, Instagram) defaulting to `OFF`.

### 1.3 Badge Generation & Web Scanning
- [ ] Build client-side cryptographic QR renderer for signed, time-bound, opaque tokens.
- [ ] Implement browser camera scanning using `@zxing/library` or `html5-qrcode` for web desktop/mobile testing.
- [ ] Create instant two-way profile exchange simulation.
- [ ] Implement post-scan private notes input screen and skill tag selector.

### 1.4 Connections Directory & Export
- [ ] Build searchable, cursor-paginated connections list with client-side text filtering.
- [ ] Build CSV and vCard (`.vcf`) export engines for local contact downloads.

---

## Phase 2: Native Android Integration & Hardware Bridge
**Duration:** Weeks 4 – 5  
**Objective:** Package the React application into a native Android app using Capacitor and replace browser APIs with high-performance native plugins.

### 2.1 Capacitor Initialization & Android Project Setup
- [ ] Install Capacitor CLI & Core (`@capacitor/core`, `@capacitor/cli`).
- [ ] Initialize Capacitor config (`capacitor.config.json`) with Android app ID (`com.genesis.sync`).
- [ ] Add Android platform target (`npx cap add android`) and configure Android Studio workspace.
- [ ] Set up `AndroidManifest.xml` with required hardware permissions (`CAMERA`, `VIBRATE`, `INTERNET`, `POST_NOTIFICATIONS`).

### 2.2 Platform Abstraction Layer (Bridge Hooks)
- [ ] Install `@capacitor-community/barcode-scanner` for native Android camera view.
- [ ] Build `useScanner()` abstract hook to route scanning logic through native camera on Android and WebRTC on web PWA.
- [ ] Integrate `@capacitor/haptics` for physical vibration feedback upon successful scan.
- [ ] Integrate `@capacitor/preferences` for native encrypted storage of auth tokens.

### 2.3 UI & Hardware Optimization
- [ ] Implement native Android splash screens, app icons, and dark-mode status bar styling.
- [ ] Add hardware back-button handling using `@capacitor/app`.
- [ ] Optimize camera view overlay rendering for zero latency during scanning.

---

## Phase 3: Genesis Community Hub, Feed & Real-Time Push
**Duration:** Weeks 6 – 7  
**Objective:** Transform the utility app into the official Genesis community portal with event updates, push announcements, and cross-event history.

### 3.1 Genesis Direct Updates Feed
- [ ] Design and implement the "Genesis Feed" tab for upcoming hackathons, meetups, and workshops.
- [ ] Build event details view with one-tap registration links and schedule timelines.
- [ ] Implement announcement card carousel for high-priority ecosystem updates.

### 3.2 Native Android Push Notifications
- [ ] Set up Firebase Cloud Messaging (FCM) project and download `google-services.json`.
- [ ] Integrate `@capacitor/push-notifications` into the Android container.
- [ ] Build backend notification dispatch service for targeted broadcasts (e.g., submission deadlines, meetup alerts).
- [ ] Implement deep-linking so tapping a push notification opens the corresponding event feed item.

### 3.3 Ecosystem Hacker Graph
- [ ] Create persistent cross-event connection aggregation in the backend schema.
- [ ] Add Genesis community badges (e.g., "3x Hackathon Builder", "Top Networker").

---

## Phase 4: Security Hardening, Scale Testing & Android Release
**Duration:** Weeks 8 – 9  
**Objective:** Harden platform security, stress-test high-concurrency scan loads, and generate production Android build packages.

### 4.1 Performance & Concurrency Testing
- [ ] Execute load testing on backend API to ensure `< 400ms` p95 scan round-trip under 10,000 concurrent requests.
- [ ] Verify cursor-based database pagination performance (`< 200ms` response SLA).
- [ ] Test offline caching behavior on slow event Wi-Fi networks.

### 4.2 Security & Data Privacy Review
- [ ] Verify AES-256 encryption at rest for database and private notes.
- [ ] Conduct audit of QR payload signatures to guarantee no raw personal contact data is exposed.
- [ ] Validate DPDP Act 2023 / GDPR compliance mechanisms (data export and account erasure API).

### 4.3 Android Production Build & Distribution
- [ ] Generate signed Android Release KeyStore (`.jks`).
- [ ] Compile Android App Bundle (`.aab`) and APK via Android Studio (`npm run build && npx cap sync android`).
- [ ] Upload `.aab` to Google Play Console (Internal Testing / Closed Beta Track).
- [ ] Deploy Web PWA fallback build to Vercel/Netlify for instant browser access.
- [ ] Conduct live beta run at 1 internal Genesis meetup.

---

## Phase 5: Post-Launch & Advanced Ecosystem Expansion
**Duration:** Post-Launch / Ongoing  
**Objective:** Introduce advanced builder tools and scale across 15–20 campus and city hackathons.

### 5.1 Advanced Features Backlog
- [ ] **Team Formation Mode:** Skill-based teammate finder with status flags ("Looking for Frontend Dev", "Rust Dev Available").
- [ ] **NFC Badge Integration:** Tap-to-connect support for physical wristbands and RFID passes using Capacitor NFC plugins.
- [ ] **Privacy-Preserving Organizer Dashboard:** Aggregated networking metrics, engagement heatmaps, and leaderboard stats.
- [ ] **AI Follow-Up Drafter:** AI-assisted follow-up message generation based on captured private notes.

---

## Key Milestone Checklist

| Milestone | Key Deliverable | Target Timeline | Status |
| :--- | :--- | :--- | :--- |
| **M1: Core Web Engine** | React PWA with QR generator, web camera scanner & notes | Week 3 | Planned |
| **M2: Native Android Shell** | Capacitor Android build with native camera & haptic feedback | Week 5 | Planned |
| **M3: Genesis Hub & Push** | Genesis Feed tab with FCM native push notifications | Week 7 | Planned |
| **M4: Production Beta** | Signed `.aab` uploaded to Google Play Internal Testing | Week 9 | Planned |
| **M5: Scaled Expansion** | Pilot across 15+ hackathons with 25,000+ active hackers | Month 6 | Future |
