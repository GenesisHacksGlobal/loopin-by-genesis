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
