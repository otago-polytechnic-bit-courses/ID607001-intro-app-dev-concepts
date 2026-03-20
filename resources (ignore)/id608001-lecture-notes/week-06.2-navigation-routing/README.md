# Week 06.2 - Navigation and Routing

## Navigation

|              | Link                                                                          |
| ------------ | ----------------------------------------------------------------------------- |
| Previous     | [Week 06.1 - React Native and Expo](../week-06.1-react-native-expo/README.md) |
| Code Example | [Code Example](code-example)                                                  |
| Next         | [Week 07.1 - State Management](../week-07.1-state-management/README.md)       |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 06.2 branch:

```bash
git checkout -b w06.2-navigation-routing
```

---

## 1. Expo Router

**Expo Router** is the file-system-based routing framework for React Native and Expo, built on top of React Navigation. It uses the same mental model as Next.js — the file structure inside the `app/` directory defines the routes.

The current version is **Expo Router v4**, which ships with Expo SDK 52.

📖 Reference: [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

---

### 1.1 Why Expo Router?

| Feature           | Expo Router              | React Navigation (bare) |
| ----------------- | ------------------------ | ----------------------- |
| Route definition  | File system              | Code                    |
| Deep linking      | Automatic                | Manual configuration    |
| URL support (web) | Built-in                 | Requires extra setup    |
| Typed routes      | Built-in (`typedRoutes`) | Manual                  |
| Layouts           | File-based               | Defined in code         |

---

### 1.2 Installation

Expo Router is included in new projects created with `create-expo-app`. To add it to an existing project:

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

Set the entry point in `package.json`:

```json
{
  "main": "expo-router/entry"
}
```

Enable typed routes in `app.json`:

```json
{
  "expo": {
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

---

## 2. File System Routing

Every file inside `app/` that exports a React component becomes a route.

---

### 2.1 Route Conventions

| File                             | Route               | Notes                          |
| -------------------------------- | ------------------- | ------------------------------ |
| `app/index.tsx`                  | `/`                 | Home screen                    |
| `app/about.tsx`                  | `/about`            | Static route                   |
| `app/institutions/index.tsx`     | `/institutions`     | Index of a group               |
| `app/institutions/[id].tsx`      | `/institutions/:id` | Dynamic route                  |
| `app/institutions/[...slug].tsx` | `/institutions/*`   | Catch-all route                |
| `app/_layout.tsx`                | —                   | Layout for the current segment |
| `app/(tabs)/_layout.tsx`         | —                   | Tab group layout               |
| `app/+not-found.tsx`             | 404                 | Not-found screen               |

---

### 2.2 Root Layout

`app/_layout.tsx` is the root layout and wraps every screen in the app. It is where you configure the navigation stack, theme, and global providers:

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTintColor: "#111827",
          headerTitleStyle: { fontWeight: "700" },
          headerShadowVisible: false,
        }}
      />
    </>
  );
}
```

---

## 3. Stack Navigation

A **Stack** navigator presents screens as a stack — navigating forward pushes a new screen on top; the back button pops it off.

---

### 3.1 Basic Stack

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen
        name="institutions/index"
        options={{ title: "Institutions" }}
      />
      <Stack.Screen name="institutions/[id]" options={{ title: "Details" }} />
    </Stack>
  );
}
```

---

### 3.2 Navigating Between Screens

```tsx
// app/index.tsx
import { Link, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      {/* Declarative navigation */}
      <Link href="/institutions">
        <Text>View Institutions</Text>
      </Link>

      {/* Imperative navigation */}
      <Pressable onPress={() => router.push("/institutions")}>
        <Text>View Institutions</Text>
      </Pressable>

      {/* Replace instead of push (no back button) */}
      <Pressable onPress={() => router.replace("/login")}>
        <Text>Go to Login</Text>
      </Pressable>

      {/* Go back */}
      <Pressable onPress={() => router.back()}>
        <Text>Back</Text>
      </Pressable>
    </View>
  );
}
```

---

### 3.3 Dynamic Routes

```tsx
// app/institutions/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function InstitutionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <Text>Institution ID: {id}</Text>
    </View>
  );
}
```

Navigate to a dynamic route:

```tsx
import { useRouter } from "expo-router";

const router = useRouter();

// Type-safe navigation with typedRoutes enabled
router.push({ pathname: "/institutions/[id]", params: { id: institution.id } });
```

---

### 3.4 Passing Parameters

```tsx
// Navigating with query params
router.push({
  pathname: "/institutions/[id]",
  params: { id: "abc-123", from: "home" },
});

// Receiving params
const { id, from } = useLocalSearchParams<{ id: string; from?: string }>();
```

> All params are strings. Parse numbers and booleans explicitly: `parseInt(id, 10)`.

---

## 4. Tab Navigation

A **Tab** navigator renders a persistent tab bar at the bottom of the screen. In Expo Router, tabs are defined using a route group folder prefixed with `(tabs)`.

---

### 4.1 Tab Group Structure

```
app/
├── _layout.tsx          ← Root stack (wraps tabs)
├── (tabs)/
│   ├── _layout.tsx      ← Tab navigator layout
│   ├── index.tsx        ← Home tab (/)
│   ├── institutions.tsx ← Institutions tab
│   └── profile.tsx      ← Profile tab
└── institutions/
    └── [id].tsx         ← Detail screen (outside tabs)
```

---

### 4.2 Tab Layout

```tsx
// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#e5e7eb",
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          height: Platform.OS === "ios" ? 84 : 60,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="institutions"
        options={{
          title: "Institutions",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

Install the icons package:

```bash
npx expo install @expo/vector-icons
```

---

### 4.3 Root Layout with Tabs

```tsx
// app/_layout.tsx
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* The (tabs) group — headerShown false because each tab manages its own header */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Detail screens live outside the tab group so they cover the tab bar */}
      <Stack.Screen
        name="institutions/[id]"
        options={{ title: "Institution Details" }}
      />
    </Stack>
  );
}
```

---

## 5. Route Groups

Route groups use parentheses in their folder name. They do not add a URL segment — they exist only to organise files or share layouts:

```
app/
├── (auth)/
│   ├── _layout.tsx    ← Auth layout (no header, different background)
│   ├── login.tsx      ← /login
│   └── register.tsx   ← /register
├── (tabs)/
│   ├── _layout.tsx
│   └── index.tsx      ← /
```

---

### 5.1 Auth Group Layout

```tsx
// app/(auth)/_layout.tsx
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#f9fafb" },
      }}
    />
  );
}
```

---

## 6. Deep Linking

Expo Router configures deep links automatically. Define your scheme in `app.json`:

```json
{
  "expo": {
    "scheme": "myapp"
  }
}
```

This enables URLs like `myapp://institutions/abc-123` to open directly to the institution detail screen.

For web support, configure `expo-linking` in `app.json`:

```json
{
  "expo": {
    "web": {
      "bundler": "metro"
    }
  }
}
```

---

## 7. Custom Header Components

```tsx
// app/(tabs)/institutions.tsx
import { Stack } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function InstitutionsScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Institutions",
          headerRight: () => (
            <Pressable
              onPress={() => {}}
              style={{ marginRight: 8 }}
              accessibilityLabel="Add institution"
            >
              <Ionicons name="add" size={26} color="#3b82f6" />
            </Pressable>
          ),
        }}
      />
      {/* Screen content */}
    </>
  );
}
```

---

## 8. Modal Routes

Modals slide up from the bottom. Present them by setting `presentation: "modal"` on a `Stack.Screen`:

```tsx
// app/_layout.tsx
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen
    name="create-institution"
    options={{
      presentation: "modal",
      title: "New Institution",
    }}
  />
</Stack>
```

Navigate to the modal:

```tsx
router.push("/create-institution");
```

---

## 9. Not Found Screen

```tsx
// app/+not-found.tsx
import { Link, Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  link: { marginTop: 12 },
  linkText: { color: "#3b82f6", fontSize: 16 },
});
```

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

### Task 1 - Tab Navigator

Implement the three-tab structure from Section 4 (Home, Institutions, Profile). Each tab should render a placeholder screen with the tab name as a heading.

---

### Task 2 - Institution Detail Screen

Create `app/institutions/[id].tsx`. Navigate to it from the Institutions tab when a list item is pressed. Display the institution's `id` from the route params and a back button.

---

### Task 3 - Auth Route Group

Create the `(auth)` route group with `login.tsx` and `register.tsx` screens. Style the auth layout with a different background colour. Add a `Link` on the login screen to the register screen and vice versa.

---

### Task 4 - Modal Screen

Create `app/create-institution.tsx` presented as a modal. Add an "Add" button (using `headerRight`) on the Institutions tab that opens the modal. Include a "Cancel" button inside the modal that dismisses it with `router.back()`.

---

### Task 5 - Typed Routes

Enable `typedRoutes` in `app.json`. Update all `router.push()` calls in the project to use the typed `{ pathname, params }` form. Verify that TypeScript catches an incorrect route name.

---

### Task 6 - Not Found Screen

Implement `app/+not-found.tsx` with a user-friendly message and a link back to the home screen.

---

## README

Update the `README.md` to document the app's route structure as a tree diagram.
