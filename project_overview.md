# Loopin by Genesis — Project Overview & Product Requirements

**Scan once, never lose a connection.**  
*A smart, privacy-first networking layer and community portal for hackathons and meetups.*

---

## 1. Executive Summary & Vision

### 1.1 Core Problem
Hackathon and meetup participants meet dozens of talented peers over 24–48 hours but lack a reliable, frictionless way to remember who they met, what projects were built, or how to follow up post-event. Business cards get misplaced, social handles get forgotten, and context is lost immediately after the event ends.

### 1.2 The Solution
**Loopin** is an event-scoped, QR-based digital badge platform built for live builder events. Every participant gets a unique, signed QR badge. A simple camera scan instantly exchanges profiles (names, chosen social links, and project focus) and allows users to record private, contextual notes. 

### 1.3 The Genesis Ecosystem Advantage
Beyond an event-level utility, **Loopin serves as the official community portal for Genesis**. It bridges individual offline hackathons and meetups into a unified digital network—enabling targeted announcement pushes, upcoming event discovery, and persistent networking across all Genesis-hosted events.

---

## 2. Product Architecture & Key Features

### 2.1 Core MVP Feature Set
* **Passwordless Authentication:** Quick email or phone OTP registration with no password storage overhead.
* **Dynamic Event-Scoped Badges:** Secure, signed, time-bound QR codes generated per user per event. QR payloads encode opaque references, never raw personal information.
* **Mutual Contact Exchange:** Dual-directional profile exchange triggered by a single scan.
* **Contextual Notes & Skill Tags:** Immediate post-scan private notes and skill tagging (e.g., "Frontend Lead", "RAG Pipeline Engineer").
* **Paginated Connections Directory:** Fast, searchable list of saved connections with real-time text filter.
* **Post-Event Recap & Export:** Automated summary emails sent post-event, with on-demand CSV and vCard downloads.

### 2.2 Genesis Community Hub Integration
* **Genesis Direct Feed:** Dedicated discovery tab for official Genesis hackathons, workshops, and local meetups.
* **Real-time Event Notifications:** Targeted push/in-app announcements for registration openings, submission deadlines, and demo days.
* **Ecosystem Hacker Profile:** Persistent identity across multiple Genesis events, aggregating total hackathon connections into a central network graph.

### 2.3 Post-MVP Roadmap
* **Organizer Dashboard:** Aggregated engagement metrics, networking heatmaps, and privacy-safe event analytics.
* **Team Formation Mode:** Skill-based teammate matching with status flags ("Looking for Designer", "Rust Dev Available").
* **NFC / Printed Badge Integration:** Seamless tap-to-connect support for physical wristbands or ID cards.

---

## 3. System Architecture & Tech Stack

```
   +-------------------------------------------------------+
   |                     CLIENT LAYER                      |
   |           React PWA / Mobile Web App                  |
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
   +---------------------------+---------------------------+
                               |
   +---------------------------v---------------------------+
   |                       DATA LAYER                      |
   | PostgreSQL (Primary Data)  |  Redis (Cache & Rate)     |
   | AWS S3 / Object Storage   |  Message Queue (SQS)      |
   +-------------------------------------------------------+
```

### 3.1 Technology Stack Selection
| Service Tier | Technology Choice | Key Rationale |
| :--- | :--- | :--- |
| **Frontend** | React (Progressive Web App) | Cross-platform, web camera API access, zero app-store friction during onboarding. |
| **Backend API** | Node.js (NestJS) / Python (FastAPI) | High-concurrency I/O performance, fast development cycles, modular architecture. |
| **Primary Database** | PostgreSQL | Strong relational integrity for user relationships, events, and access logs. |
| **Cache & Buffering** | Redis | Absorbs high-concurrency burst traffic during registration and scan peaks. |
| **Async Queue** | RabbitMQ / AWS SQS | Decouples recap processing, email delivery, and feed distribution from scan path. |

### 3.2 Key Performance Benchmarks
* **Scan Round-Trip:** `< 400ms` at p95 response time.
* **Peak Scalability:** Supports **10,000 concurrent scans** during peak event periods.
* **Pagination SLA:** Cursor-based pagination ensuring queries resolve in `< 200ms` regardless of record volume.

---

## 4. Privacy, Security & Data Protection

| Area | Security Standard & Practice |
| :--- | :--- |
| **Data Encryption** | TLS 1.3 in transit; AES-256 at rest for database and object storage. |
| **QR Code Security** | Cryptographically signed, short-lived tokens without raw personal data. |
| **Privacy Controls** | Social handles are hidden by default and require explicit user opt-in per link. |
| **Note Confidentiality** | Private notes are encrypted and accessible exclusively by the author. Organizers cannot view private notes. |
| **Regulatory Alignment** | Compliant with India's DPDP Act 2023, GDPR, and CCPA standards (right to access, export, and erase). |

---

## 5. Implementation Roadmap

### Phase 1: MVP Build & Beta (Weeks 1–6)
* Core PWA development: OTP login, QR generator & camera scanner.
* PostgreSQL database schema definition and NestJS API setup.
* Basic connection management, private notes, and CSV export.
* Pilot launch at 1 internal Genesis meetup.

### Phase 2: Genesis Hub Integration & Scaling (Weeks 7–12)
* Genesis announcement feed and event updates module.
* Cursor-based pagination, Redis caching layer, and async email recap queue.
* Pilot rollout across 5 Genesis hackathons.

### Phase 3: Ecosystem Expansion (Weeks 13–24)
* Cross-event profile history and organizer analytics dashboard.
* Team formation mode & skill-matching algorithms.
* Scale to 15–20 campus and city hackathons reaching 25,000+ hackers.
