# Loopin by Genesis — Technical Execution Plan

**Primary Target:** Native-Grade Android Application (built with React + Capacitor)  
**Secondary/Testing Target:** Web PWA (used for rapid feature validation, local testing, and instant browser fallback)

---

## 1. Architectural Strategy & Philosophy

Our primary release vehicle is a high-performance **Android Application** packaged using **Capacitor**. 

* **Why Capacitor First:** Capacitor wraps a React web application into a native Android container, granting full access to native Android APIs (Camera, Push Notifications, Storage, Haptics) while retaining web development speed.
* **Role of Web PWA:** The Web PWA version serves as an immediate development sandbox, fast-feedback testing environment, and no-install backup option for event attendees who choose not to download the app.

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

---

## 2. Project Setup & Configuration Blueprint

### 2.1 Initialization
Initialize the project using **Vite + React (TypeScript)**:

```bash
# 1. Create React TypeScript project
npm create vite@latest loopin-app -- --template react-ts
cd loopin-app

# 2. Install Capacitor Core & CLI
npm install @capacitor/core
npm install -D @capacitor/cli

# 3. Initialize Capacitor
npx cap init "Loopin by Genesis" "com.genesis.loopin" --web-dir "dist"

# 4. Add Android Platform
npm install @capacitor/android
npx cap add android
```

### 2.2 Directory Structure
```
loopin-app/
├── android/                    # Native Android Studio Project
├── public/                     # Static icons & assets
├── src/
│   ├── assets/                 # SVGs and images
│   ├── components/             # UI components (Scanner, Badge, Cards)
│   ├── hooks/                  # Custom hooks (useScanner, useAuth, useFeed)
│   ├── native/                 # Capacitor Native API Adapters
│   ├── pages/                  # Views (Dashboard, GenesisFeed, Connections)
│   ├── services/               # API clients (Axios/Fetch)
│   ├── App.tsx
│   └── main.tsx
├── capacitor.config.json       # Capacitor configuration
├── package.json
└── vite.config.ts
```

### 2.3 Capacitor Configuration (`capacitor.config.json`)
```json
{
  "appId": "com.genesis.loopin",
  "appName": "Loopin",
  "webDir": "dist",
  "server": {
    "androidScheme": "https",
    "cleartext": true
  },
  "plugins": {
    "LocalNotifications": {
      "smallIcon": "ic_stat_icon_config_sample",
      "iconColor": "#4F46E5"
    },
    "PushNotifications": {
      "presentationOptions": ["badge", "sound", "alert"]
    }
  }
}
```

---

## 3. Platform Abstraction Layer (Native vs. Web Bridge)

To ensure smooth switching between native Android execution and web testing, build abstract hooks for platform-dependent features.

### 3.1 Dual Camera Scanner Hook (`src/hooks/useScanner.ts`)
```typescript
import { Capacitor } from '@capacitor/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

export const useScanner = () => {
  const isNative = Capacitor.isNativePlatform();

  const startScan = async (): Promise<string | null> => {
    if (isNative) {
      // NATIVE ANDROID execution
      await BarcodeScanner.hideBackground();
      document.body.classList.add('barcode-scanner-active');
      const result = await BarcodeScanner.startScan();
      document.body.classList.remove('barcode-scanner-active');
      
      if (result.hasContent) {
        return result.content;
      }
      return null;
    } else {
      // WEB PWA / TESTING execution (Fallback to HTML5 / ZXing)
      console.log('Running in Web/PWA testing mode...');
      // Invoke HTML5 camera scanner logic here
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

### 3.2 Native Android Manifest Configuration (`android/app/src/main/AndroidManifest.xml`)
Include hardware and network permissions for Android:
```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" />
    <uses-feature android:name="android.hardware.camera.autofocus" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        
        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBar"
            android:launchMode="singleTask"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 4. Phase-by-Phase Execution Roadmap

### Phase 1: Core React UI & Web Testing Engine (Weeks 1–3)
* Set up Vite + React + TailwindCSS framework.
* Implement state management (Zustand / Redux Toolkit) for offline storage.
* Build Auth flow (OTP verification screen, Profile builder).
* Build signed QR Generator module and HTML5 Web Camera scanner for local desktop/mobile browser testing.

### Phase 2: Native Android Capacitor Integration (Weeks 4–5)
* Initialize Capacitor and link Android native target.
* Install `@capacitor-community/barcode-scanner`, `@capacitor/haptics`, `@capacitor/push-notifications`, and `@capacitor/preferences`.
* Abstract camera and storage APIs into platform-aware hooks.
* Configure Android Studio project, splash screens, and application icons.

### Phase 3: Genesis Hub Feed & Real-Time Android Push (Weeks 6–7)
* Integrate Genesis Direct Updates feed (hackathon listings, meetup announcements).
* Configure Firebase Cloud Messaging (FCM) integration with Capacitor Push Notifications for targeted Android pushes.
* Test offline connection persistence and background syncing.

### Phase 4: Android Release & Production Deploy (Weeks 8–9)
* Build Android Release `.aab` (Android App Bundle) via Android Studio.
* Run internal Android beta testing via Firebase App Distribution / Google Play Internal Testing.
* Host Web PWA build on Vercel/Netlify for immediate browser fallback testing.

---

## 5. Development Command Reference

| Action | Command | Purpose |
| :--- | :--- | :--- |
| **Web Dev / Testing** | `npm run dev` | Runs local web server for quick browser feature testing. |
| **Web Build** | `npm run build` | Compiles React TS code into optimized production assets in `/dist`. |
| **Sync to Android** | `npx cap sync android` | Copies `/dist` web bundle into the native Android platform project. |
| **Open Android Studio** | `npx cap open android` | Opens the native project in Android Studio for native debugging and APK generation. |
| **One-Step Build & Sync** | `npm run build && npx cap sync android` | Complete workflow command before running native Android builds. |
