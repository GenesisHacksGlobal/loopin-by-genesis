# Loopin by Genesis

> **Scan once, never lose a connection.**  
> *A smart, privacy-first networking layer and community portal for hackathons, builder meetups, and developer ecosystems.*

---

## Table of Contents

- [Overview & Vision](#overview--vision)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Technical Execution & Platform Strategy](#technical-execution--platform-strategy)
- [Directory Layout](#directory-layout)
- [Implementation Roadmap](#implementation-roadmap)
- [Development Quick Start](#development-quick-start)
- [Security, Privacy & Compliance](#security-privacy--compliance)
- [Documentation Index](#documentation-index)

---

## Overview & Vision

### The Problem
During 24–48 hour hackathons and developer meetups, builders meet dozens of talented peers. However, traditional networking breaks down immediately after events end:
- Business cards and contact numbers get misplaced.
- Social handles and project context are forgotten.
- Post-event follow-ups decay due to a lack of recorded interaction context.

### The Solution
**Loopin** (also referenced as **Genesis Sync**) is an event-scoped, QR-based digital badge platform designed specifically for live builder events. 
- **Instant Dual-Exchange:** A single camera scan instantly exchanges cryptographic digital badges between two participants.
- **Contextual Memory:** Immediately attach private notes and skill tags (e.g., `#Rust`, `#AI/ML`, `#FullStack`) to any contact.
- **Genesis Community Hub:** Serves as the official ecosystem portal for Genesis, bridging discrete offline hackathons into a persistent digital network with event discovery, announcement pushes, and unified hacker profiles.

---

## Key Features

### 1. Passwordless Authentication & Multi-Level Profiles
- **OTP Verification:** Instant login via SMS or Email OTP; no password overhead or credential leak risk.
- **Global Hacker Profile:** Aggregates cumulative connections, event badges, and tech stack across all Genesis events.
- **Event-Scoped Profile:** Includes name, role/title, and a single-line project pitch (*"What I'm building / looking for"*).
- **Granular Privacy Controls:** Social link visibility (GitHub, LinkedIn, X, Discord, Portfolio, Instagram) defaults to **OFF** until explicitly toggled per platform.

### 2. Dynamic QR Badge & Instant Mutual Scan
- **Cryptographic Opaque Payload:** QR codes encode short-lived, cryptographically signed tokens (`userId`, `eventId`, `timestamp`). No raw personal data is ever exposed in the QR code.
- **Two-Way Mutual Exchange:** A single scan by either party seamlessly unlocks profiles for **both** attendees simultaneously.
- **Low-Latency Feedback:** In-app scan recognition and haptic/visual confirmation within `< 400ms`.

### 3. Connection Management & Export
- **Private Encrypted Notes:** Write post-scan notes (e.g., *"Discussed building a Solana indexing agent together"*). Notes are encrypted and accessible **exclusively** by the author; event organizers have zero access.
- **Fast Search & Cursor Pagination:** Filter contacts instantly by name, role, skill tags, or private notes with sub-200ms query response SLAs.
- **Automated Summary & Export:** Receive post-event digest emails and download connections on-demand as `.CSV` or `.vCard` (`.vcf`) files for direct CRM/Google Contacts import.

### 4. Genesis Community Hub
- **Direct Event Feed:** Discover upcoming Genesis hackathons, workshops, and local meetups with one-tap registration.
- **Real-Time Push Notifications:** Instant targeted alerts for registration openings, submission deadlines, and demo days.
- **Cross-Event Hacker Graph:** Automatically links repeat connections across multiple Genesis events into a central network timeline.

---

## System Architecture

```
   +-------------------------------------------------------+
   |                     CLIENT LAYER                      |
   |   React Native Container (Capacitor) / Web PWA        |
   +---------------------------+---------------------------+
                               |
   +---------------------------v---------------------------+
   |                      EDGE LAYER                       |
   |          API Gateway / Cloudflare CDN                 |
   +---------------------------+---------------------------+
                               |
   +---------------------------v---------------------------+
   |                   APPLICATION LAYER                   |
   |  +--------------------+       +--------------------+  |
   |  | Auth & OTP Service |       | Profile Service    |  |
   |  +--------------------+       +--------------------+  |
   |  | QR/Badge Token Svc |       | Connection Service |  |
   |  +--------------------+       +--------------------+  |
   |  | Notification Svc   |       | Genesis Feed Svc   |  |
   |  +--------------------+       +--------------------+  |
   +---------------------------+---------------------------+
                               |
   +---------------------------v---------------------------+
   |                       DATA LAYER                      |
   | PostgreSQL (Primary Data)  |  Redis (Cache & Rate Limit)|
   | AWS S3 / Object Storage   |  Message Queue (SQS/Rabbit)|
   +-------------------------------------------------------+
```

### Key Performance SLAs
- **Scan Round-Trip:** `< 400ms` (p95 response time).
- **Concurrency SLA:** Supports **10,000+ concurrent scans** during peak registration and networking windows.
- **Directory Query SLA:** Cursor-based pagination ensuring queries resolve in `< 200ms`.

---

## Technology Stack

| Layer | Component | Technology Choice | Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | Core Web App | **React (TypeScript) + Vite** | High development speed, modular components, optimized build output. |
| **Styling & Tokens**| Design System | **Tailwind CSS + Lucide React** | Rapid design token customization, sleek dark mode, rich micro-interactions. |
| **Native Runtime** | Android Container | **Capacitor (`@capacitor/android`)** | Wraps React web app into a native Android `.aab`/`.apk` with native plugin bridges. |
| **Backend API** | Application Services | **Node.js (NestJS) / Python (FastAPI)** | High concurrency, modular service separation, fast I/O processing. |
| **Database** | Primary Storage | **PostgreSQL** | Relational integrity for user graphs, event scopes, and audit logging. |
| **Cache & Queue** | Performance & Async | **Redis + AWS SQS / RabbitMQ** | Burst traffic handling during events and decoupled email recap processing. |

---

## Technical Execution & Platform Strategy

Loopin utilizes a **Capacitor-first dual target architecture**:
1. **Primary Release Target:** Native Android Application (`com.genesis.loopin` / `com.genesis.sync`) compiled via Capacitor. Grants access to native camera bridges, native push notifications (FCM), native haptics, and background sync.
2. **Secondary / Testing Target:** Web Progressive Web App (PWA). Serves as an instant testing environment, fast development sandbox, and zero-install browser fallback for attendees.

```
                   +---------------------------------------+
                   |           REACT APPLICATION           |
                   |      (UI, Business Logic, State)      |
                   +-------------------+-------------------+
                                       |
                 +----------------------+----------------------+
                 |                                             |
    +------------v------------+                   +------------v------------+
    |   PRIMARY DISTRIBUTION  |                   |   SECONDARY / TESTING   |
    |   Capacitor Android     |                   |   Web Progressive App   |
    |                         |                   |                         |
    |  * Native Camera Bridge |                   |  * HTML5 MediaStream    |
    |  * Native Android Push  |                   |  * Web Push API         |
    |  * Google Play Store    |                   |  * Immediate Browser    |
    |    (.aab / .apk)        |                   |    Fallback             |
    +-------------------------+                   +-------------------------+
```

### Camera Scanner Platform Abstraction (`useScanner.ts`)
```typescript
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const useScanner = () => {
  const isNative = Capacitor.isNativePlatform();

  const startScan = async (): Promise<string | null> => {
    if (isNative) {
      // Native Android Camera Hardware Bridge
      await BarcodeScanner.hideBackground();
      document.body.classList.add('barcode-scanner-active');
      const result = await BarcodeScanner.startScan();
      document.body.classList.remove('barcode-scanner-active');
      return result.hasContent ? result.content : null;
    } else {
      // Web PWA Fallback (HTML5 MediaStream / ZXing)
      console.log('Running in Web/PWA testing mode...');
      return null;
    }
  };

  const stopScan = async () => {
    if (isNative) {
      await BarcodeScanner.showBackground();
      await BarcodeScanner.stopScan();
    }
  };

  return { startScan, stopScan, isNative };
};
```

---

## Directory Layout

```
loopin/
├── project_overview.md         # High-level architecture, problem/solution & product specs
├── execution.md                # Native Android & Capacitor technical execution plan
├── features.md                 # Detailed functional and system feature requirements
├── roadmap.md                  # Phase-wise 9-week engineering roadmap & milestone list
├── README.md                   # Repository master documentation
└── loopin-app/                 # React + Capacitor application codebase (Target layout)
    ├── android/                # Native Android Studio workspace
    ├── public/                 # Static assets & PWA manifest
    ├── src/
    │   ├── assets/             # Graphical assets & icons
    │   ├── components/         # Reusable UI components (Scanner, Badge, Cards)
    │   ├── hooks/              # Custom React hooks (useScanner, useAuth, useFeed)
    │   ├── native/             # Capacitor platform adapters & bridges
    │   ├── pages/              # Primary views (Dashboard, Connections, Feed)
    │   └── services/           # Axios/Fetch API integration layer
    ├── capacitor.config.json   # Capacitor Android app configuration
    ├── package.json            # Project dependencies and scripts
    └── vite.config.ts          # Vite build configuration
```

---

## Implementation Roadmap

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

### Key Milestones
| Milestone | Key Deliverable | Target Timeline | Status |
| :--- | :--- | :--- | :--- |
| **M1: Core Web Engine** | React PWA with QR generator, web camera scanner & notes | Weeks 1–3 | Planned |
| **M2: Native Android Shell** | Capacitor Android build with native camera & haptic feedback | Weeks 4–5 | Planned |
| **M3: Genesis Hub & Push** | Genesis Feed tab with FCM native push notifications | Weeks 6–7 | Planned |
| **M4: Production Beta** | Signed `.aab` uploaded to Google Play Internal Testing | Weeks 8–9 | Planned |
| **M5: Scaled Expansion** | Rollout across 15+ hackathons with 25,000+ active hackers | Month 6+ | Future |

---

## Development Quick Start

### 1. Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **Android Studio**: Installed with Android SDK (API level 33+) for native builds

### 2. Installation & Setup
```bash
# Clone the repository
git clone https://github.com/genesis/loopin.git
cd loopin/loopin-app

# Install project dependencies
npm install

# Initialize Capacitor and Android platform (if setup from scratch)
npx cap init "Loopin by Genesis" "com.genesis.loopin" --web-dir "dist"
npx cap add android
```

### 3. Command Reference

| Action | Command | Description |
| :--- | :--- | :--- |
| **Web Development** | `npm run dev` | Launches Vite local development server for fast browser testing. |
| **Web Compile** | `npm run build` | Compiles TypeScript and packages production web assets in `/dist`. |
| **Sync to Android** | `npx cap sync android` | Copies `/dist` web bundle into the native Android platform folder. |
| **Open Android Studio** | `npx cap open android` | Opens the native Android project in Android Studio for debugging & APK/AAB generation. |
| **One-Step Build & Sync** | `npm run build && npx cap sync android` | Full compile & sync command before compiling Android release builds. |

---

## Security, Privacy & Compliance

- **Opaque Cryptographic QR Codes:** Payload contains short-lived signed tokens; zero personal data exposed in raw QR codes.
- **Private Notes Confidentiality:** Private post-scan notes are encrypted with author-level keys. Organizers or third parties cannot read private notes under any circumstances.
- **Opt-In Social Link Sharing:** All social handles (LinkedIn, GitHub, X, Discord) are toggled **OFF** by default and require explicit user opt-in.
- **Regulatory Alignment:** Built in full compliance with **India's DPDP Act 2023**, **GDPR**, and **CCPA** standards, supporting one-click data exports (`.CSV`/`.vCard`) and full account deletion within 30 days.

---

## Documentation Index

For detailed deep-dives into specific aspects of the Loopin platform, refer to the individual documentation files:

- [project_overview.md](file:///mnt/Garvit%20Prakash/Projects/Loopin/loopin/project_overview.md) — Executive summary, system architecture diagram, and core product positioning.
- [execution.md](file:///mnt/Garvit%20Prakash/Projects/Loopin/loopin/execution.md) — Technical execution strategy for React + Capacitor Android development, native hooks, and AndroidManifest configuration.
- [features.md](file:///mnt/Garvit%20Prakash/Projects/Loopin/loopin/features.md) — Granular feature specification for authentication, mutual QR scanning, notes, feed, and organizer dashboard.
- [roadmap.md](file:///mnt/Garvit%20Prakash/Projects/Loopin/loopin/roadmap.md) — 9-week milestone roadmap breakdown covering Phase 1 through Phase 5.

---

*Loopin by Genesis — Connecting Builders, Hackathon by Hackathon.*
