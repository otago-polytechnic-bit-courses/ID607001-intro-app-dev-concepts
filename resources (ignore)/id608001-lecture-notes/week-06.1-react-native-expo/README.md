# Week 06.1 - React Native and Expo

## Navigation

|              | Link                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 05.2 - Microservices and Documentation as Code](../week-05.2-microservices-documentation-as-code/README.md) |
| Code Example | [Code Example](code-example)                                                                                      |
| Next         | [Week 06.2 - Navigation and Routing](../week-06.2-navigation-routing/README.md)                                   |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 06.1 branch:

```bash
git checkout -b w06.1-react-native-expo
```

---

## 1. React Native

**React Native** is an open-source framework developed by Meta that lets you build native mobile applications for iOS and Android using JavaScript and React. Unlike web-based hybrid frameworks that render HTML in a WebView, React Native renders genuine native UI components — a `<View>` becomes a `UIView` on iOS and an `android.view.View` on Android.

The current stable version is **React Native 0.76**, which ships with the **New Architecture** enabled by default. The New Architecture replaces the old Bridge with JSI (JavaScript Interface), Fabric (the new renderer), and TurboModules, delivering significantly better performance and interoperability with native code.

📖 Reference: [React Native Documentation](https://reactnative.dev/docs/getting-started)

---

### 1.1 React Native vs Other Approaches

| Approach           | Examples          | Rendering         | Performance |
| ------------------ | ----------------- | ----------------- | ----------- |
| **Native**         | Swift/Kotlin      | Native UI         | Best        |
| **React Native**   | React Native 0.76 | Native UI via JSI | Very good   |
| **Flutter**        | Flutter           | Custom engine     | Very good   |
| **Hybrid/WebView** | Ionic, Capacitor  | Web in WebView    | Good        |
| **PWA**            | Any web app       | Browser           | Moderate    |

---

## 2. Expo

**Expo** is the recommended way to build React Native applications. It is a framework and platform built on top of React Native that provides a managed workflow, a rich SDK of device APIs, over-the-air updates, and simplified build and deployment tooling.

The current stable version is **Expo SDK 52**, which targets React Native 0.76.

📖 Reference: [Expo Documentation](https://docs.expo.dev)

---

### 2.1 Expo Workflow Options

| Workflow    | Description                                          | When to Use                         |
| ----------- | ---------------------------------------------------- | ----------------------------------- |
| **Managed** | Expo handles native code; you write only JS/TS       | Most apps; fastest iteration        |
| **Bare**    | Full access to native code; Expo SDK still available | When you need custom native modules |

In this course we use the **managed workflow**.

---

### 2.2 Creating a New Project

```bash
npx create-expo-app@latest my-app --template blank-typescript
cd my-app
```

| Flag                          | Purpose                                              |
| ----------------------------- | ---------------------------------------------------- |
| `--template blank-typescript` | TypeScript starter with no navigation pre-configured |

---

### 2.3 Project Structure

```
my-app/
├── app/                  # Expo Router pages (Week 06.2)
├── assets/               # Images, fonts, and other static assets
├── components/           # Reusable components
├── constants/            # Colours, spacing, typography tokens
├── hooks/                # Custom React hooks
├── app.json              # Expo app configuration
├── babel.config.js       # Babel configuration
├── expo-env.d.ts         # Expo TypeScript environment declarations
├── package.json
└── tsconfig.json
```

---

### 2.4 Running the App

```bash
npx expo start
```

This starts the **Expo Dev Server**. From there you can:

- Press `i` to open in the iOS Simulator (macOS only)
- Press `a` to open in the Android Emulator
- Scan the QR code with the **Expo Go** app on a physical device

> **Expo Go** is a free app available on the App Store and Google Play that lets you run Expo apps without building a native binary.

---

### 2.5 Useful Development Scripts

```json
"scripts": {
  "start": "expo start",
  "android": "expo start --android",
  "ios": "expo start --ios",
  "web": "expo start --web",
  "lint": "expo lint",
  "test": "jest --watchAll"
}
```

---

## 3. Core Components

React Native provides a set of built-in components that map to native UI elements. All layout is done with Flexbox.

---

### 3.1 Fundamental Components

| Component             | iOS equivalent             | Android equivalent  | Purpose               |
| --------------------- | -------------------------- | ------------------- | --------------------- |
| `<View>`              | `UIView`                   | `android.view.View` | Container; layout     |
| `<Text>`              | `UILabel`                  | `TextView`          | Display text          |
| `<Image>`             | `UIImageView`              | `ImageView`         | Display images        |
| `<TextInput>`         | `UITextField`              | `EditText`          | Text entry            |
| `<ScrollView>`        | `UIScrollView`             | `ScrollView`        | Scrollable container  |
| `<FlatList>`          | `UITableView`              | `RecyclerView`      | Performant long lists |
| `<Pressable>`         | `UIButton`                 | `Button`            | Touchable element     |
| `<Modal>`             | `UIModalPresentationStyle` | `Dialog`            | Overlay               |
| `<ActivityIndicator>` | `UIActivityIndicatorView`  | `ProgressBar`       | Loading spinner       |

---

### 3.2 Hello World

```tsx
// app/index.tsx
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hello, React Native!</Text>
      <Text style={styles.body}>Welcome to the course.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: "#6b7280",
  },
});
```

---

### 3.3 StyleSheet

`StyleSheet.create()` validates styles at development time and optimises them at runtime. Styles are objects, not CSS strings. Property names use camelCase.

```tsx
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
});
```

> CSS properties that do not exist in native layouts (such as `display: grid`) are not available. React Native uses Flexbox for all layout.

---

## 4. Flexbox in React Native

React Native uses Flexbox for layout, with two differences from web Flexbox:

- The default `flexDirection` is `"column"` (not `"row"`)
- The default `alignContent` is `"flex-start"` (not `"stretch"`)

---

### 4.1 Common Flexbox Properties

```tsx
<View style={{
  flex: 1,                          // Take all available space
  flexDirection: "row",             // "row" | "column" | "row-reverse" | "column-reverse"
  justifyContent: "space-between",  // Main axis alignment
  alignItems: "center",             // Cross axis alignment
  flexWrap: "wrap",                 // Allow wrapping
  gap: 12,                          // Gap between children (RN 0.71+)
}}>
```

---

## 5. Pressable and Touch Handling

Use `<Pressable>` for touchable elements. It supports pressed state styling and is more flexible than the deprecated `<TouchableOpacity>`.

```tsx
import { Pressable, Text, StyleSheet } from "react-native";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        style={[styles.label, variant === "secondary" && styles.secondaryLabel]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  primary: {
    backgroundColor: "#3b82f6",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#3b82f6",
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryLabel: {
    color: "#3b82f6",
  },
});
```

---

## 6. FlatList

`<FlatList>` is the standard component for rendering long lists efficiently. It only renders the items currently visible on screen.

```tsx
import { FlatList, Text, View, StyleSheet } from "react-native";

interface Institution {
  id: string;
  name: string;
  region: string;
  country: string;
}

interface Props {
  institutions: Institution[];
  onPress: (institution: Institution) => void;
}

export function InstitutionList({ institutions, onPress }: Props) {
  return (
    <FlatList
      data={institutions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable onPress={() => onPress(item)} style={styles.item}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.meta}>
            {item.region}, {item.country}
          </Text>
        </Pressable>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No institutions found</Text>
        </View>
      }
      contentContainerStyle={institutions.length === 0 && styles.emptyContainer}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  meta: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e5e7eb",
    marginHorizontal: 16,
  },
  empty: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
  },
  emptyContainer: {
    flex: 1,
  },
});
```

---

## 7. Platform-Specific Code

React Native apps run on both iOS and Android. Use the `Platform` API when behaviour must differ between platforms.

```tsx
import { Platform, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  shadow: {
    // iOS uses shadow* properties
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    // Android uses elevation
    elevation: 4,
  },
  header: {
    paddingTop: Platform.select({
      ios: 56,
      android: 24,
      default: 24,
    }),
  },
});

// Platform-specific file resolution
// Button.ios.tsx   - used on iOS
// Button.android.tsx - used on Android
// Button.tsx       - fallback
```

---

## 8. app.json Configuration

`app.json` is Expo's configuration file. Key fields:

```json
{
  "expo": {
    "name": "My App",
    "slug": "my-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.example.myapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.example.myapp"
    },
    "plugins": [],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

---

## 9. TypeScript Configuration

Expo projects ship with TypeScript support out of the box. The `tsconfig.json` extends Expo's base config:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

The `@/` path alias lets you import from the project root without relative paths:

```tsx
import { Button } from "@/components/Button";
import { COLORS } from "@/constants/Colors";
```

---

## 10. Environment Variables

Expo uses a `.env` file for environment variables. Variables must be prefixed with `EXPO_PUBLIC_` to be accessible in JavaScript:

```bash
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_ENV=development
```

Access them in code:

```tsx
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

> Never put secrets (private API keys, passwords) in `EXPO_PUBLIC_` variables — they are bundled into the client app and visible to anyone who inspects the binary.

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

```tsx
/**
 * @fileoverview Brief description of what this file does
 * @ai-assisted This file was developed with assistance from [AI Tool Name]
 * @prompts
 * - "Your first prompt here"
 * - "Your second prompt here"
 * @usage Describe how you used the AI responses to help you with your work
 */
```

---

### Task 1 - Create and Run a New Expo App

Create a new Expo project using the TypeScript blank template. Run it in the iOS Simulator or Android Emulator (or Expo Go on a physical device). Take a screenshot of the running app.

---

### Task 2 - Profile Card Component

Create `components/ProfileCard.tsx` that accepts `name`, `role`, `department`, and `avatarUrl` props and renders a card with a circular image, name, role badge, and department label. Use `StyleSheet.create` for all styles.

---

### Task 3 - Reusable Button Component

Implement the `Button` component from Section 5 in `components/Button.tsx`. Extend it with a `loading` prop that replaces the label with an `<ActivityIndicator>` and disables the press handler while loading.

---

### Task 4 - Institutions FlatList

Create a screen at `app/index.tsx` that renders a static array of at least five institutions using the `InstitutionList` component from Section 6. Add a header above the list with the title "Institutions".

---

### Task 5 - Platform Shadow Utility

Create `constants/Shadows.ts` that exports pre-defined shadow styles for `sm`, `md`, and `lg` sizes, each using both `shadow*` (iOS) and `elevation` (Android) properties. Use these in your `ProfileCard` component.

---

### Task 6 - Design Tokens

Create `constants/Colors.ts`, `constants/Typography.ts`, and `constants/Spacing.ts` that export your design system tokens. Use them across all components created so far instead of raw values.

---

## README

Update the `README.md` to document how to set up and run the Expo project, including simulator/emulator prerequisites.
