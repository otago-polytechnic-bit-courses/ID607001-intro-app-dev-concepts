# Week 11.2 - App Store Deployment and Release Management

## Navigation

|              | Link                                                                    |
| ------------ | ----------------------------------------------------------------------- |
| Previous     | [Week 11.1 - CI/CD for Mobile](../week-11.1-ci-cd-for-mobile/README.md) |
| Code Example | [Code Example](code-example)                                            |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 11.2 branch:

```bash
git checkout -b w11.2-app-store-deployment-release-management
```

---

## 1. Release Strategy

A mobile release strategy determines how new versions reach users. Unlike web deployments (where all users immediately get the new version), mobile releases go through a multi-stage process:

```
Development build
    │
    ▼
Internal testing (EAS Preview / TestFlight Internal / Internal Testing Track)
    │
    ▼
Beta testing (TestFlight External / Open Testing Track)
    │
    ▼
Staged rollout (5% → 20% → 50% → 100%)
    │
    ▼
Full release
```

---

### 1.1 Over-the-Air Updates vs Store Updates

|                        | OTA Update (EAS Update)              | Store Update                                    |
| ---------------------- | ------------------------------------ | ----------------------------------------------- |
| **What can change**    | JS bundle only                       | Everything, including native code               |
| **Review required**    | No                                   | Yes (Apple ~1–2 days, Google ~1–3 days)         |
| **Time to users**      | Minutes                              | Days                                            |
| **User action needed** | No                                   | Yes (users must update the app)                 |
| **Use for**            | Bug fixes, UI changes, logic updates | New native modules, permissions, major features |

---

## 2. iOS App Store Deployment

---

### 2.1 Prerequisites

- Apple Developer Program membership ($99/year)
- An app created in [App Store Connect](https://appstoreconnect.apple.com)
- A bundle identifier matching `ios.bundleIdentifier` in `app.json`

---

### 2.2 Preparing `app.json`

```json
{
  "expo": {
    "name": "My App",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.example.myapp",
      "buildNumber": "1",
      "supportsTablet": false,
      "requireFullScreen": false,
      "infoPlist": {
        "NSCameraUsageDescription": "Used to take profile photos.",
        "NSPhotoLibraryUsageDescription": "Used to select profile photos.",
        "NSLocationWhenInUseUsageDescription": "Used to show nearby institutions.",
        "NSFaceIDUsageDescription": "Used to sign in quickly and securely."
      }
    }
  }
}
```

---

### 2.3 Building and Submitting

```bash
# Build a production binary
eas build --profile production --platform ios

# Submit the latest build to App Store Connect
eas submit --platform ios --profile production

# Build and submit in one command
eas build --profile production --platform ios --auto-submit
```

EAS Submit uses the Apple API to upload the IPA. After upload, the build appears in App Store Connect under **TestFlight** within a few minutes.

---

### 2.4 TestFlight

TestFlight is Apple's beta testing platform. After uploading a build:

1. Go to App Store Connect → TestFlight
2. Add internal testers (up to 100 Apple IDs on the team)
3. Create external test groups (up to 10,000 users) — requires Apple review (~1 day)
4. Share the public TestFlight link with testers

---

### 2.5 App Store Review

Before submitting for review, complete the following in App Store Connect:

**App Information:**

- App name and subtitle
- Category
- Age rating
- Privacy policy URL

**App Store Listing (per localisation):**

- Description (up to 4,000 characters)
- Keywords (up to 100 characters)
- Screenshots (required sizes: 6.7", 6.5", 5.5", 12.9" iPad)
- App preview videos (optional)
- Promotional text

**Review Information:**

- Contact information
- Notes for the reviewer
- Demo account credentials (if the app requires login)

Submit for review:

1. App Store Connect → My Apps → your app
2. Select the build
3. Complete all required fields
4. Click **Submit for Review**

---

## 3. Google Play Store Deployment

---

### 3.1 Prerequisites

- Google Play Developer account ($25 one-time fee)
- An app created in [Google Play Console](https://play.google.com/console)
- A package name matching `android.package` in `app.json`

---

### 3.2 Preparing `app.json`

```json
{
  "expo": {
    "android": {
      "package": "com.example.myapp",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3b82f6"
      },
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_MEDIA_IMAGES",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

---

### 3.3 Building and Submitting

```bash
# Build an AAB (required for Play Store)
eas build --profile production --platform android

# Submit to Play Store
eas submit --platform android --profile production
```

EAS Submit requires a Google Play service account key. Configure it in `eas.json`:

```json
{
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json",
        "track": "internal"
      }
    }
  }
}
```

**Tracks in order of audience:**

| Track        | Audience                            |
| ------------ | ----------------------------------- |
| `internal`   | Up to 100 nominated Google accounts |
| `alpha`      | Closed testing group                |
| `beta`       | Open testing (anyone can opt in)    |
| `production` | All users; supports staged rollout  |

---

### 3.4 Play Store Listing Requirements

- Title (up to 30 characters)
- Short description (up to 80 characters)
- Full description (up to 4,000 characters)
- At least 2 screenshots per device type
- Feature graphic (1024×500 pixels)
- Privacy policy URL
- Data safety section (what data you collect and why)

---

## 4. Semantic Versioning and Build Numbers

---

### 4.1 Version Strategy

```
app.json version:     1.2.3   (shown to users in the app stores)
ios buildNumber:      45      (must increment with every submission)
android versionCode:  45      (must increment with every submission)
```

With `"appVersionSource": "remote"` in `eas.json`, EAS manages build numbers automatically.

---

### 4.2 Automating Version Bumps

Use `eas build:version:set` to update version codes remotely:

```bash
# Set a specific version
eas build:version:set --platform ios --version-code 46

# Auto-increment on every build (eas.json)
{
  "build": {
    "production": {
      "autoIncrement": true
    }
  }
}
```

---

### 4.3 Semantic Versioning for User-Facing Version

Follow SemVer for the user-facing version string:

| Bump      | When                                   | Example       |
| --------- | -------------------------------------- | ------------- |
| **MAJOR** | Breaking changes, significant redesign | 1.0.0 → 2.0.0 |
| **MINOR** | New features, backwards compatible     | 1.2.0 → 1.3.0 |
| **PATCH** | Bug fixes                              | 1.2.0 → 1.2.1 |

---

## 5. Staged Rollouts

The Play Store supports staged rollouts — you can release a new version to a percentage of users and monitor crash rates and reviews before expanding:

```bash
# Submit with a staged rollout to 10% of users
eas submit --platform android --profile production
# Then in Google Play Console:
# Release → Production → Create new release → Rollout percentage: 10%
```

Apple does not support percentage rollouts via the API, but you can use **Phased Release** in App Store Connect:

App Store Connect → My Apps → App Store → Version information → Phased Release

---

## 6. Monitoring and Crash Reporting

---

### 6.1 Sentry

**Sentry** captures uncaught errors and provides stack traces with source maps, allowing you to debug production crashes:

```bash
npx expo install @sentry/react-native sentry-expo
```

```typescript
// app/_layout.tsx
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: process.env.EXPO_PUBLIC_APP_ENV,
  tracesSampleRate: 0.2, // Sample 20% of transactions for performance monitoring
  enableNative: true,
  attachStacktrace: true,
});
```

Wrap the root component:

```tsx
export default Sentry.wrap(RootLayout);
```

Add to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "@sentry/react-native/expo",
        {
          "organization": "your-org",
          "project": "your-project"
        }
      ]
    ]
  }
}
```

---

### 6.2 Uploading Source Maps

Upload source maps automatically during the EAS build by adding Sentry to the build process. With the Sentry Expo plugin, this is automatic.

---

### 6.3 Capturing Custom Errors

```typescript
import * as Sentry from "@sentry/react-native";

// Capture an exception manually
try {
  await riskyOperation();
} catch (err) {
  Sentry.captureException(err, {
    tags: { feature: "institution-creation" },
    user: { id: userId },
  });
}

// Add breadcrumbs for context
Sentry.addBreadcrumb({
  category: "navigation",
  message: "User navigated to Institutions",
  level: "info",
});
```

---

## 7. Release Notes and Changelog

Maintain a `CHANGELOG.md` following the **Keep a Changelog** format:

```markdown
# Changelog

## [Unreleased]

## [1.2.0] - 2025-03-15

### Added

- Infinite scroll on the Institutions screen
- Biometric login support
- Dark mode

### Fixed

- Pull-to-refresh not working on Android
- Avatar upload failing on slow connections

### Changed

- Institution list now sorted alphabetically by default

## [1.1.0] - 2025-02-01

### Added

- Push notifications for new institutions
- Offline mode with SQLite caching
```

---

## 8. App Store Optimisation (ASO)

ASO is the process of improving an app's visibility in the stores.

---

### 8.1 Key ASO Factors

| Factor                  | iOS                  | Android                 |
| ----------------------- | -------------------- | ----------------------- |
| **Title**               | High impact          | High impact             |
| **Keywords**            | 100 char field       | Embedded in description |
| **Description**         | Low keyword impact   | High keyword impact     |
| **Ratings and reviews** | High impact          | High impact             |
| **Screenshots**         | Conversion           | Conversion              |
| **Update frequency**    | Signals to algorithm | Signals to algorithm    |

---

### 8.2 Screenshots

Screenshots are the single biggest driver of conversion. Use a tool like **Fastlane Frameit** or **Screenshot Designer** to add device frames and text overlays:

```bash
# Generate screenshots automatically with Fastlane
gem install fastlane
fastlane snapshot
fastlane frameit
```

Required screenshot sizes for iOS:

| Device      | Size        |
| ----------- | ----------- |
| iPhone 6.7" | 1290 × 2796 |
| iPhone 6.5" | 1242 × 2688 |
| iPhone 5.5" | 1242 × 2208 |
| iPad 12.9"  | 2048 × 2732 |

---

## 9. EAS Submit Automation in CI

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - "v*" # Trigger on version tags like v1.2.0

jobs:
  build-and-submit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - run: npm ci

      - uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build production binaries
        run: eas build --profile production --platform all --non-interactive

      - name: Submit to stores
        run: eas submit --profile production --platform all --non-interactive
```

Trigger a release by creating and pushing a version tag:

```bash
git tag v1.2.0
git push origin v1.2.0
```

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

```yaml
# @ai-assisted This file was developed with assistance from [AI Tool Name]
# @prompts
#   - "Your first prompt here"
#   - "Your second prompt here"
# @usage Describe how you used the AI responses to help you with your work
```

---

### Task 1 - App Store Connect Setup

Create your app in App Store Connect (or Google Play Console). Set the bundle identifier in `app.json` to match. Document the required fields and what you filled in.

---

### Task 2 - Production Build

Run `eas build --profile production --platform android`. Download the AAB artifact from the EAS dashboard. Verify it installs on an Android device.

---

### Task 3 - TestFlight / Internal Testing

Submit a preview build to TestFlight (iOS) or the Internal Testing track (Android). Install it on a real device and verify it connects to the production API.

---

### Task 4 - Sentry Integration

Set up Sentry in the app. Deliberately throw an error and verify it appears in the Sentry dashboard with a readable stack trace and source map.

---

### Task 5 - Changelog

Create `CHANGELOG.md` for your project. Document every feature added across the weeks of this course in the appropriate version sections. Follow the Keep a Changelog format.

---

### Task 6 - Release Workflow

Create `.github/workflows/release.yml` that builds and submits on version tag push. Create a test tag (`v0.1.0-test`) and verify the workflow runs (you do not need to complete the actual submission).

---

### Task 7 - ASO Research

In `week-11-2-aso-analysis.md`, analyse two competing apps in the same category on the App Store or Play Store. Compare their title, keywords, screenshots, and ratings. Write two paragraphs on what you would do differently for your own app listing.

---

## README

Update the `README.md` to document the full release pipeline, version numbering strategy, how to submit a new version, and how OTA updates reach users without a store submission.
