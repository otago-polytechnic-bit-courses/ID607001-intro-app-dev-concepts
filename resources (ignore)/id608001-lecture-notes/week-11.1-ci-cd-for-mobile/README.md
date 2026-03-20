# Week 11.1 - CI/CD for Mobile

## Navigation

|              | Link                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 10.2 - Testing for Mobile](../week-10.2-testing-for-mobile/README.md)                                               |
| Code Example | [Code Example](code-example)                                                                                              |
| Next         | [Week 11.2 - App Store Deployment and Release Management](../week-11.2-app-store-deployment-release-management/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 11.1 branch:

```bash
git checkout -b w11-1-ci-cd-mobile
```

---

## 1. Mobile CI/CD Overview

CI/CD for mobile applications is more complex than for web applications because:

- Native builds require platform-specific toolchains (Xcode for iOS, Android Studio for Android)
- iOS builds can only be produced on macOS
- Signing and provisioning profiles must be managed securely
- Builds take 10–30 minutes even for small apps
- Distribution requires uploading to the App Store or Play Store, not just a web server

**Expo Application Services (EAS)** is the recommended CI/CD solution for Expo apps. It provides cloud build infrastructure, code signing management, and over-the-air update distribution.

📖 Reference: [EAS documentation](https://docs.expo.dev/eas/)

---

## 2. Expo Application Services (EAS)

EAS consists of three main services:

| Service        | Purpose                                                           |
| -------------- | ----------------------------------------------------------------- |
| **EAS Build**  | Cloud-based native binary builds for iOS and Android              |
| **EAS Submit** | Automated submission to App Store and Google Play                 |
| **EAS Update** | Over-the-air JavaScript bundle updates without a new native build |

---

### 2.1 Setup

```bash
npm install -g eas-cli
eas login
eas init
```

`eas init` creates a project on the Expo dashboard and adds an `extra.eas.projectId` to `app.json`.

---

### 2.2 `eas.json`

`eas.json` defines build profiles for different environments:

```json
{
  "cli": {
    "version": ">= 12.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_ENV": "development",
        "EXPO_PUBLIC_API_URL": "https://dev-api.example.com"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_APP_ENV": "staging",
        "EXPO_PUBLIC_API_URL": "https://staging-api.example.com"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true,
      "env": {
        "EXPO_PUBLIC_APP_ENV": "production",
        "EXPO_PUBLIC_API_URL": "https://api.example.com"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "developer@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCDE12345"
      },
      "android": {
        "serviceAccountKeyPath": "./google-play-key.json",
        "track": "internal"
      }
    }
  }
}
```

---

## 3. EAS Build

---

### 3.1 Running a Build

```bash
# Build for development (installs expo-dev-client)
eas build --profile development --platform all

# Build a preview APK/IPA for internal testing
eas build --profile preview --platform all

# Build a production binary for store submission
eas build --profile production --platform all

# Build for a single platform
eas build --profile production --platform ios
eas build --profile production --platform android
```

---

### 3.2 Development Build

A **development build** replaces Expo Go with a custom native binary that includes your app's native modules. This is required when you use any native module not included in Expo Go (MMKV, react-native-maps, etc.):

```bash
eas build --profile development --platform ios
```

Install on the simulator:

```bash
eas build --profile development --platform ios --local
```

---

### 3.3 Code Signing

EAS manages code signing automatically. On first build, it creates and manages:

- **iOS**: Distribution certificate, provisioning profiles
- **Android**: Keystore

```bash
# Configure signing interactively
eas credentials
```

Store sensitive signing materials as **EAS Secrets** rather than checking them into the repository.

---

## 4. EAS Update

**EAS Update** pushes JavaScript bundle changes to users without requiring a new App Store submission. The app checks for updates on launch and installs them silently.

```bash
npx expo install expo-updates
```

---

### 4.1 Configuration

Add to `app.json`:

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    },
    "runtimeVersion": {
      "policy": "appVersion"
    }
  }
}
```

The `runtimeVersion` controls which updates are compatible with which native binary. The `appVersion` policy means an update is only compatible with the exact app version it was built against.

---

### 4.2 Publishing an Update

```bash
# Publish an update to the production channel
eas update --channel production --message "Fix institution list pagination"

# Publish to a preview channel
eas update --channel preview --message "Test new feature"
```

---

### 4.3 Update Channels and Branches

EAS Update uses **channels** to control which updates reach which users:

| Channel       | Who receives it              |
| ------------- | ---------------------------- |
| `production`  | App Store / Play Store users |
| `preview`     | Internal testers             |
| `development` | Developers                   |

Map branches to channels in `eas.json`:

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "preview"
    }
  }
}
```

---

### 4.4 Checking for Updates in Code

```typescript
// hooks/useAppUpdate.ts
import { useEffect } from "react";
import * as Updates from "expo-updates";
import { Alert } from "react-native";

export function useAppUpdate() {
  useEffect(() => {
    if (__DEV__) return; // Don't check for updates in development

    const checkForUpdate = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            "Update available",
            "A new version has been downloaded. Restart to apply it.",
            [
              { text: "Later" },
              { text: "Restart", onPress: () => Updates.reloadAsync() },
            ],
          );
        }
      } catch (err) {
        console.error("Update check failed:", err);
      }
    };

    checkForUpdate();
  }, []);
}
```

---

## 5. GitHub Actions for Mobile

---

### 5.1 Lint and Test Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm run test:ci

      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with:
          name: coverage
          path: coverage/
```

---

### 5.2 EAS Build Workflow

```yaml
# .github/workflows/build.yml
name: EAS Build

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      profile:
        description: Build profile
        required: true
        type: choice
        options: [development, preview, production]
        default: preview
      platform:
        description: Platform
        required: true
        type: choice
        options: [all, ios, android]
        default: all

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - run: npm ci

      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Build on EAS
        run: |
          eas build \
            --profile ${{ github.event.inputs.profile || 'preview' }} \
            --platform ${{ github.event.inputs.platform || 'all' }} \
            --non-interactive \
            --no-wait
```

---

### 5.3 EAS Update Workflow

```yaml
# .github/workflows/update.yml
name: EAS Update

on:
  push:
    branches: [main]

jobs:
  update:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - run: npm ci

      - name: Setup Expo and EAS
        uses: expo/expo-github-action@v8
        with:
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Publish update
        run: |
          eas update \
            --channel production \
            --message "${{ github.event.head_commit.message }}" \
            --non-interactive
```

---

### 5.4 Full Pipeline

```yaml
# .github/workflows/pipeline.yml
name: Mobile CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint-and-test:
    name: Lint and Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run test:ci

  eas-update:
    name: Publish OTA Update
    runs-on: ubuntu-latest
    needs: lint-and-test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
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
      - run: eas update --channel production --message "${{ github.event.head_commit.message }}" --non-interactive
```

---

## 6. Environment Secrets

Store sensitive values as GitHub Secrets and EAS Secrets:

| Secret                    | Where to store  | Used in                                |
| ------------------------- | --------------- | -------------------------------------- |
| `EXPO_TOKEN`              | GitHub Secrets  | GitHub Actions authentication with EAS |
| `EXPO_PUBLIC_API_URL`     | EAS Secrets     | Embedded in the app bundle             |
| `JWT_SECRET`              | EAS Secrets     | Server-side only — do NOT embed in app |
| Apple signing credentials | EAS Credentials | Managed automatically by EAS           |
| Android keystore          | EAS Credentials | Managed automatically by EAS           |

Generate an Expo token:

```bash
eas whoami
# Then create a token at: https://expo.dev/settings/access-tokens
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

### Task 1 - EAS Setup

Install EAS CLI, create an Expo account if you don't have one, and run `eas init` to connect your project. Verify the project ID appears in `app.json`.

---

### Task 2 - `eas.json` Configuration

Create `eas.json` with `development`, `preview`, and `production` profiles. Set the correct `EXPO_PUBLIC_API_URL` for each profile.

---

### Task 3 - CI Lint and Test Workflow

Create `.github/workflows/ci.yml` that lints, type-checks, and runs the Jest test suite on every push and pull request. Verify it passes on the main branch.

---

### Task 4 - Preview Build

Trigger a preview build using either `eas build --profile preview --platform android` locally or via the manual `workflow_dispatch` trigger. Download and install the resulting APK.

---

### Task 5 - EAS Update Workflow

Create `.github/workflows/update.yml` that publishes an OTA update to the `preview` channel on every push to `main`. Make a trivial UI change, push it, and verify the update is delivered to the installed preview build.

---

### Task 6 - Full Pipeline

Combine lint/test, and EAS update into a single `pipeline.yml` file with chained jobs (update only runs if lint and test pass) and concurrency control.

---

## README

Update the `README.md` to document the CI/CD pipeline, how to trigger builds, and how OTA updates work.
