# Loopin by Genesis — Product Features & Requirements Specification

A comprehensive list of functional, system, and platform features for the **Loopin by Genesis** platform.

---

## 1. Authentication & Identity Management

### 1.1 Passwordless Registration & Auth
* **OTP Verification:** Registration and login via SMS or Email OTP (One-Time Password) to eliminate password storage risks.
* **Session Management:** Secure JWT-based session tokens stored in HTTP-only, secure cookies with automatic session refresh.
* **Account Deletion (Right to be Forgotten):** One-click account deletion mechanism purging user personal data from active databases within 30 days.

### 1.2 Multi-Level User Profiles
* **Global Hacker Profile:** Persistent across all Genesis events, storing user avatar, core tech stack, and cumulative networking statistics.
* **Event-Scoped Profile:** Specific to each hackathon or meetup, including:
  * Name & Title / Role (e.g., "Full-Stack Dev", "UI/UX Designer")
  * Event Bio / "What I'm Building or Looking For" single-line pitch
  * Granular social profile toggles
* **Granular Social Link Privacy:** Toggleable visibility for each connected social profile (GitHub, LinkedIn, X/Twitter, Portfolio, Discord, Instagram). All links default to **OFF** until explicitly enabled by the user.

---

## 2. Dynamic QR Badge & Contact Exchange

### 2.1 Cryptographic QR Code Generation
* **Opaque Payload:** QR codes encode a short-lived, cryptographically signed token containing an internal user reference ID, event ID, and timestamp—**no raw personal contact information**.
* **Time-Bound Validity:** Badges refresh periodically to prevent badge screenshot harvesting and unauthorized duplication.
* **Offline Rendering:** QR badge rendered locally on client devices via PWA offline caching once fetched.

### 2.2 Instant Mutual Scanning Flow
* **In-App Camera Scanner:** High-speed WebRTC camera integration built into the PWA (no mobile app store download required).
* **Two-Way Mutual Exchange:** Single scan unlocks profiles for **both** the scanner and the scanned individual simultaneously.
* **Low-Latency Feedback:** Visual and haptic confirmation within `< 400ms` upon successful scan.

---

## 3. Connection Management & Context Memory

### 3.1 Contextual Notes & Skill Tagging
* **Private Post-Scan Notes:** Immediate text field popup following a scan enabling users to log context (e.g., "Discussed building a Solana indexing agent together"). Notes are encrypted and visible **only** to the author.
* **Auto-Tagging & Manual Skills:** Selectable tags (e.g., `#Rust`, `#AI/ML`, `#Frontend`, `#Solidity`) attached to connection cards.

### 3.2 Paginated & Searchable Connections List
* **Cursor-Based Pagination:** Backend and UI designed with cursor-based pagination (default 20 records per batch) to ensure sub-200ms query performance regardless of connection count.
* **Real-time Client-Side & Server Search:** Instant filtering across contact names, roles, custom tags, and private notes.

### 3.3 Post-Event Recap & Data Export
* **Automated Email Summary:** Automated post-event digest sent within 24 hours containing full contact cards and private notes.
* **Multi-Format Export:** On-demand export of all user connections in `.CSV` and `.vCard` formats for direct import into Google Contacts or CRM tools.

---

## 4. Genesis Community Hub & Engagement

### 4.1 Genesis Direct Updates Feed
* **Official Event Calendar:** In-app discovery tab showcasing upcoming Genesis-organized hackathons, workshops, and meetups.
* **Real-Time Push Notifications:** Instant broadcast alerts for registration openings, hackathon project submission deadlines, and demo day agendas.

### 4.2 Cross-Event Network Graph
* **Persistent Connection History:** Automatically links repeat connections across multiple Genesis events into a single timeline.
* **Genesis Community Badges:** Earnable ecosystem badges based on participation (e.g., "5x Genesis Builder", "Top Networker").

---

## 5. Organizer & Event Ops Features

### 5.1 Privacy-Safe Analytics Dashboard
* **Aggregate Real-Time Metrics:** Live stats on total badge scans, unique participant interactions, and overall networking engagement rates.
* **Anonymized Activity Heatmaps:** Visualization of peak networking hours (e.g., check-in, lunch, pre-submission pitch hours).
* **Strict Privacy Isolation:** Organizers have **zero visibility** into private notes, individual social link interactions, or private messages between hackers.

---

## 6. Post-MVP Feature Backlog

| Feature | Description | Target Phase |
| :--- | :--- | :--- |
| **Team Formation Mode** | Toggle status flags ("Looking for Teammates", "Need Frontend Dev") with automated skill-matching. | Phase 2 |
| **NFC Wristband Sync** | Tap-to-connect hardware support for physical NFC wristbands and RFID event passes. | Phase 2 |
| **Leaderboards** | Gamified "Most Active Networker" leaderboards for opt-in hackathon participants. | Phase 3 |
| **AI Follow-Up Assistant** | AI-generated follow-up draft emails based on captured private notes. | Phase 3 |
