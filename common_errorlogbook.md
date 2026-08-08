# Genesis Sync / Loopin — Common Error Logbook

Central logbook for documenting non-trivial errors, build failures, configuration bugs, and their solutions across development iterations.

---

### [2026-08-02] - Initial Repository Setup & Logbook Initialization

- **Module / Component:** Repository Setup
- **Error Description / Stack Trace:**
  ```text
  N/A - Mandatory logbook initialization according to project guidelines.
  ```
- **Root Cause:** Initial setup of Loopin by Genesis codebase.
- **Solution / Fix:** Created `common_errorlogbook.md` at repository root.
- **Logged By:** Antigravity AI

---

### [2026-08-02] - TypeScript verbatimModuleSyntax & Unused Imports Build Errors

- **Module / Component:** React TypeScript Build (`npm run build`)
- **Error Description / Stack Trace:**
  ```text
  error TS1484: 'UserProfile' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.
  error TS6133: 'Download' is declared but its value is never read.
  ```
- **Root Cause:** Vite's default `tsconfig.app.json` enforces strict type-only imports (`import type { ... }`) and `noUnusedLocals`.
- **Solution / Fix:** Updated type imports to use `import type { ... }` syntax across all files and cleaned up unused icon imports.
- **Logged By:** Antigravity AI

---

### [2026-08-02] - Lucide Brand Icons Export Names

- **Module / Component:** SocialToggleGroup (`lucide-react`)
- **Error Description / Stack Trace:**
  ```text
  error TS2305: Module '"lucide-react"' has no exported member 'Github'.
  ```
- **Root Cause:** Brand icons (`Github`, `Linkedin`, `Twitter`) are deprecated or named differently in modern `lucide-react` releases.
- **Solution / Fix:** Built dedicated, sleek SVG social brand icons in `SocialToggleGroup.tsx` for GitHub, LinkedIn, X/Twitter, Discord, Globe, and Instagram.
- **Logged By:** Antigravity AI

---

### [2026-08-02] - ConnectionCard Type Property Mismatch

- **Module / Component:** `ConnectionCard.tsx` & `QRScannerModal.tsx`
- **Error Description / Stack Trace:**
  ```text
  error TS2339: Property 'scannedEventName' does not exist on type 'ConnectionCard'.
  error TS2339: Property 'socials' does not exist on type 'ConnectionCard'.
  error TS2322: Type 'number' is not assignable to type 'string' for timestamp.
  ```
- **Root Cause:** Property name mismatch between `ConnectionCard` type interface (`eventName`, `socialLinks`, string `timestamp`) and component references.
- **Solution / Fix:** Aligned `ConnectionCard.tsx` and `QRScannerModal.tsx` to use `connection.eventName`, `connection.socialLinks`, and `new Date().toISOString()`.
- **Logged By:** Antigravity AI

---

### [2026-08-02] - Linter Audit & Light Theme Alignment Verification

- **Module / Component:** `oxlint` & TypeScript Build Pipeline (`tsc -b`)
- **Error Description / Stack Trace:**
  ```text
  Found 0 warnings and 0 errors across 21 source files with 104 rules.
  ```
- **Root Cause:** Audit request to ensure all linters, TypeScript checks, and light-theme design tokens compile cleanly.
- **Solution / Fix:** Updated outer App wrapper to `#f6f9fc`, ran `oxlint` (0 warnings, 0 errors), and confirmed production build (`built in 406ms`).
- **Logged By:** Antigravity AI

---

### [2026-08-07] - Stale `@types/qrcode.react` Conflicting With v4 Bundled Types

- **Module / Component:** `QRBadge.tsx` / `qrcode.react` v4.2.0
- **Error Description / Stack Trace:**
  ```text
  Potential type resolution conflict: @types/qrcode.react@1.0.5 (DefinitelyTyped, for v1 API)
  co-exists with qrcode.react@4.2.0 which ships its own types (lib/index.d.ts).
  The v1 DT types export a default ComponentClass; v4 exports named QRCodeSVG / QRCodeCanvas.
  ```
- **Root Cause:** `@types/qrcode.react` v1.0.5 was declared in `package.json` dependencies but is designed for the old v1 single-default-export API. `qrcode.react` v4 ships its own bundled TypeScript declarations via the `exports.types` field. TypeScript `moduleResolution: "bundler"` correctly resolves to the package's own types, but the stale `@types` package adds noise and could mislead future contributors.
- **Solution / Fix:** Removed `"@types/qrcode.react": "^1.0.5"` from `package.json` dependencies. Confirmed `qrcode.react` v4.2.0 resolves `QRCodeSVG` from its bundled `lib/index.d.mts` correctly via the ESM `exports` field. `skipLibCheck: true` in `tsconfig.app.json` prevented build failures, but the removal is still best practice.
- **Logged By:** Antigravity AI

---

### [2026-08-07] - QRBadge QR Payload Alignment With Opaque Payload Design (features.md §2.1)

- **Module / Component:** `QRBadge.tsx` / `qrcode.react`
- **Error Description / Stack Trace:**
  ```text
  N/A — Design compliance improvement, no runtime error.
  ```
- **Root Cause:** The `QRCodeSVG` was encoding the full `QRPayload` (including `displayName`, `roleTitle`, `pitch`, `avatar`, `socials`) directly into the QR modules. Per `features.md` §2.1, the QR code must encode an **opaque payload** — no raw personal contact information. The full profile data should be fetched server-side after the userId resolves.
- **Solution / Fix:**
  1. Introduced a lean `qrPayload` object with only `{ userId, eventId, timestamp, sig }` — the `sig` field is a placeholder for the future HMAC/JWT cryptographic signature (Phase 2).
  2. Updated `QRCodeSVG value` to use `JSON.stringify(qrPayload)` (opaque, scannable).
  3. Retained the full `QRPayload` object for the existing "Copy Pass Token" share button (in-memory only, never in QR modules).
  4. Removed `imageSettings` with external `iconify.design` URL (breaks PWA offline caching, features.md §2.1).
  5. Replaced deprecated `includeMargin` prop with `marginSize={0}`; added `title` prop for accessibility.
- **Logged By:** Antigravity AI

---

### [2026-08-07] - QRScannerModal: Html5Qrcode Lifecycle & Camera Permission Flow

- **Module / Component:** `QRScannerModal.tsx`, `useScanner.ts`, `html5-qrcode` v2.3.8
- **Error Description / Stack Trace:**
  ```text
  Design issue (not a runtime error): The original camera tab was a static animated
  placeholder. html5-qrcode's Html5Qrcode class requires careful DOM lifecycle
  management — calling start() before the mount div exists, or calling stop()
  twice, throws uncaught promise rejections.
  ```
- **Root Cause:**
  1. `Html5Qrcode` is imperative and DOM-coupled: it requires the element with the given `elementId` to be present at the time `new Html5Qrcode(id)` is instantiated AND at the time `start()` is called.
  2. React conditionally renders the `<div id="loopin-qr-reader">` only when the camera tab is active, so `startCameraScanner()` must be called via `requestAnimationFrame()` after the tab render commits to the DOM.
  3. Camera permission must be acquired via `getUserMedia` before handing control to `html5-qrcode`, otherwise the internal stream starts without the browser permission prompt being resolved first.
  4. The old `useScanner.ts` `parseQRPayload` required `data.signature` (the old full QRPayload field); the new lean QR token uses `sig`. Updated to accept both for backwards compatibility.
- **Solution / Fix:**
  1. **`useScanner.ts`** — Added `ScannedQRToken` interface (`{ userId, eventId, timestamp, sig? }`), `parseQRToken()` (validates minimum fields, accepts both `sig` and `signature`), `buildConnectionCardFromToken()` (builds a minimal `ConnectionCard` with UI-Avatars placeholder until Phase 2 server lookup), `requestCameraPermission()` (probes getUserMedia, updates `cameraPermission` state), and `CameraPermission` union type.
  2. **`QRScannerModal.tsx`** — Holds `Html5Qrcode` instance in `useRef` (not state, to avoid re-renders). Camera starts in a `useEffect` triggered by `isOpen && activeTab === 'camera'`; `requestAnimationFrame` ensures the div is in the DOM. `stopCameraScanner` guards against double-stop with `isScannerRunning` ref. Permission-denied shows a clear error UI with a "Use Simulator Instead" fallback button. Success callback calls `stopCameraScanner()` immediately to prevent multiple firings, then triggers haptics + 600ms success overlay before calling `onScanSuccess` and `onClose`. Sandbox tab is preserved untouched.
- **Logged By:** Antigravity AI

---

### [2026-08-07] - getUserMedia Blocked on HTTP: Secure Context Required for Camera API

- **Module / Component:** `vite.config.ts`, `QRScannerModal.tsx` camera tab
- **Error Description / Stack Trace:**
  ```text
  DOMException: getUserMedia is not implemented in an insecure context.
  Camera API (navigator.mediaDevices.getUserMedia) requires HTTPS on all
  mobile browsers (Chrome Android, Safari iOS, Firefox Android).
  ```
- **Root Cause:** Vite's default dev server serves over plain HTTP (`http://localhost`). The browser Secure Context requirement blocks `getUserMedia` on any non-localhost origin (i.e. the phone's LAN IP `192.168.x.x`) unless TLS is active. Since the QR scanner needs to run on mobile devices pointed at the `--host` network URL, plain HTTP is insufficient.
- **Solution / Fix:**
  1. Installed `@vitejs/plugin-basic-ssl` as a devDependency.
  2. Added `basicSsl()` to the Vite plugins array in `vite.config.ts` — it auto-generates a self-signed certificate on first run and serves all requests over TLS.
  3. Added `server: { host: true, port: 5173 }` to the Vite config so `--host` behavior is always enabled without needing to pass it on the CLI.
  4. Result: dev server now starts on `https://localhost:5174/` (port increments from 5173 if in use) and also exposes `https://192.168.1.8:5174/` on the LAN Wi-Fi interface — mobile browsers will accept this for `getUserMedia` after accepting the self-signed certificate warning.
- **Note:** Mobile users must accept the "Your connection is not private" warning once before the camera API becomes available. For production, a real TLS certificate (Let's Encrypt or similar) must replace the self-signed one.
- **Logged By:** Antigravity AI

---

### [2026-08-07] - html5-qrcode: "Cannot clear while scan is ongoing" Unhandled Rejection

- **Module / Component:** `QRScannerModal.tsx`, `stopCameraScanner()`
- **Error Description / Stack Trace:**
  ```text
  [vite] (client) [Unhandled rejection] Unknown Error: Cannot clear while scan is ongoing, close it first.
  ```
- **Root Cause:** `html5QrRef.current.clear()` was called unconditionally after the `try/catch` block, meaning it would execute even if `stop()` threw an exception (e.g. when the scanner was already in the process of stopping from a previous call). The `Html5Qrcode` library enforces that `clear()` can only be called once the internal state has fully transitioned to stopped.
- **Solution / Fix:** Moved `html5QrRef.current.clear()` inside the `try` block, immediately after the `await stop()` call. This guarantees `clear()` only executes when `stop()` has fully resolved, eliminating the race condition.
- **Logged By:** Antigravity AI

---

### [2026-08-07] - Missing Visual/Haptic Feedback on Sandbox Tab Scans

- **Module / Component:** `QRScannerModal.tsx`, `useHaptics.ts`
- **Error Description / Stack Trace:**
  ```text
  Design issue: The sandbox tab's "Scan Badge" buttons triggered onScanSuccess(builder)
  directly, bypassing the haptic feedback and the "Badge Scanned!" visual confirmation
  overlay that were implemented solely in the Native Camera Feed's success callback.
  Additionally, the visual overlay was nested within the camera tab rendering function,
  making it invisible to the sandbox tab even if the state was updated.
  ```
- **Root Cause:** The `triggerSuccessHaptic` call, `setScanSuccess(true)` state change, and the `setTimeout` delay were hardcoded into the `html5-qrcode` success callback. The `scanSuccess` boolean conditionally rendered the success UI *inside* the `renderCameraTab` function, which is not called when the sandbox tab is active.
- **Solution / Fix:**
  1. Extracted the success sequence (stopping camera, haptics, state update, and 500ms timeout) into a shared `handleScanSuccess` callback.
  2. Updated both the camera's `html5-qrcode` callback and the sandbox's `onClick` handlers to use `handleScanSuccess`.
  3. Hoisted the conditional rendering of the "Badge Scanned!" overlay to the top level of the modal body (replacing the tab switcher and tab content completely when active), ensuring it renders globally for both tabs.
- **Logged By:** Antigravity AI

---

### [2026-08-07] - Empty Notifications Dropdown / LocalStorage Truthiness Bug

- **Module / Component:** `Navbar.tsx`, `useAppStore.ts`
- **Error Description / Stack Trace:**
  ```text
  The Genesis Feed Notifications dropdown (bell icon) in the Navbar was rendering
  "No notifications yet" and "0 NEW" instead of populating with the mock data from 
  initialData.ts via the getNotifications API mock.
  ```
- **Root Cause:** In the previous update to `useAppStore.ts`, `notifications` state was initialized by parsing `localStorage`. If empty, it fell back to `[]`. The `useEffect` hook synchronized `notifications` back to `localStorage`, writing the string `"[]"`. During the data-fetching `useEffect`, the code checked `if (!savedNotifs)` to decide whether to fetch mock data. Because `"[]"` is a truthy string in JavaScript, the condition evaluated to false. The store never fetched the mock data, effectively getting permanently stuck on an empty array.
- **Solution / Fix:** Updated the data-fetching condition in `useAppStore.ts` to explicitly check for the serialized empty array string: `if (!savedNotifs || savedNotifs === '[]')`. This ensures that if the store only has the default empty array, it will properly fetch the mock notifications data and hydrate the dropdown UI.
- **Logged By:** Antigravity AI



