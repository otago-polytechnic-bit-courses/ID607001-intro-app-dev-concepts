# Week 10.1 - Performance Optimisation and Lazy Loading

## Navigation

|              | Link                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------- |
| Previous     | [Week 09.2 - Camera, Location and Device APIs](../week-09.2-camera-location-device-apis/README.md) |
| Code Example | [Code Example](code-example)                                                                       |
| Next         | [Week 10.2 - Testing for Mobile](../week-10.2-testing-for-mobile/README.md)          |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 10.1 branch:

```bash
git checkout -b w10.1-performance-optimisation-lazy-loading
```

---

## 1. Performance in React Native

A well-performing React Native app runs at a consistent 60fps (or 120fps on ProMotion displays) and responds to user interactions in under 100ms. Poor performance manifests as dropped frames, jank during scrolling, slow startup, and delayed responses to taps.

---

### 1.1 Key Metrics

| Metric                        | Target                      | How to Measure                      |
| ----------------------------- | --------------------------- | ----------------------------------- |
| **JS bundle size**            | As small as possible        | `npx expo export --dump-sourcemap`  |
| **Time to Interactive (TTI)** | < 3s on mid-range device    | Flipper, Perfetto                   |
| **Frame rate**                | 60fps sustained             | Flipper Performance Monitor         |
| **Memory usage**              | No growth over time (leaks) | Xcode Instruments, Android Profiler |
| **Re-render count**           | Minimal                     | React DevTools Profiler             |

---

### 1.2 Profiling Tools

| Tool                        | Platform | What it shows                         |
| --------------------------- | -------- | ------------------------------------- |
| **React DevTools**          | Both     | Component re-renders, props diffs     |
| **Flipper**                 | Both     | JS/native bridge calls, network, logs |
| **Xcode Instruments**       | iOS      | Memory, CPU, GPU                      |
| **Android Studio Profiler** | Android  | Memory, CPU, energy                   |
| **Expo Dev Tools**          | Both     | Bundle size, startup time             |

---

## 2. React Performance Patterns

---

### 2.1 memo

`React.memo` prevents a component from re-rendering when its props have not changed:

```tsx
import { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

interface InstitutionRowProps {
  id: string;
  name: string;
  region: string;
  country: string;
  onPress: (id: string) => void;
}

export const InstitutionRow = memo(function InstitutionRow({
  id,
  name,
  region,
  country,
  onPress,
}: InstitutionRowProps) {
  return (
    <Pressable onPress={() => onPress(id)} style={styles.row}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.meta}>
        {region}, {country}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: { padding: 16 },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 14, color: "#6b7280", marginTop: 2 },
});
```

> `memo` uses shallow equality. If you pass a new object or array on every render, `memo` won't help — use `useMemo` to stabilise the reference first.

---

### 2.2 useCallback

Stabilise function references passed as props to `memo` components:

```tsx
import { useCallback } from "react";

// Without useCallback - onPress is a new function every render
// This defeats memo on InstitutionRow
const handlePress = (id: string) => router.push(`/institutions/${id}`);

// With useCallback - same function reference between renders
const handlePress = useCallback(
  (id: string) =>
    router.push({ pathname: "/institutions/[id]", params: { id } }),
  [router],
);
```

---

### 2.3 useMemo

Cache expensive computations:

```tsx
import { useMemo } from "react";

// Re-runs only when institutions or searchQuery changes
const filteredInstitutions = useMemo(
  () =>
    institutions.filter(
      (inst) =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.country.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  [institutions, searchQuery],
);
```

> Don't over-optimise with `useMemo`. Only apply it when a computation is genuinely expensive or when referential equality matters for downstream `memo` components.

---

## 3. FlatList Optimisation

`FlatList` is already virtualised (only renders visible items), but there are several props that fine-tune its performance:

```tsx
<FlatList
  data={institutions}
  keyExtractor={(item) => item.id}
  renderItem={renderItem}
  // Avoid anonymous functions - stabilise with useCallback
  renderItem={renderItem}
  // Define item layout if all items have the same height
  // Eliminates layout measurement for each item
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  // How many items to render outside the visible area
  windowSize={5} // Default: 21
  maxToRenderPerBatch={8} // Default: 10
  initialNumToRender={10} // Items rendered on the first pass
  // Remove items from memory when far off screen
  removeClippedSubviews={true}
  // Avoid updating items unnecessarily
  // React will check this before calling renderItem
  extraData={selectedId}
/>
```

---

### 3.1 Stable renderItem with useCallback

```tsx
const ITEM_HEIGHT = 72;

const renderItem = useCallback(
  ({ item }: { item: Institution }) => (
    <InstitutionRow
      id={item.id}
      name={item.name}
      region={item.region}
      country={item.country}
      onPress={handlePress}
    />
  ),
  [handlePress],
);
```

---

## 4. Image Optimisation

---

### 4.1 Expo Image

Replace the built-in `<Image>` with **Expo Image** for automatic caching, progressive loading, and better performance:

```bash
npx expo install expo-image
```

```tsx
import { Image } from "expo-image";

const blurhash = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

<Image
  source={{ uri: avatarUrl }}
  style={{ width: 80, height: 80, borderRadius: 40 }}
  placeholder={{ blurhash }} // Show while loading
  contentFit="cover"
  transition={300} // Fade in over 300ms
  cachePolicy="memory-disk" // Cache in memory and on disk
/>;
```

---

### 4.2 Image Preloading

```typescript
import { Image } from "expo-image";

// Preload images that will be needed soon
await Image.prefetch([
  "https://example.com/avatar1.jpg",
  "https://example.com/avatar2.jpg",
]);

// Clear the cache when needed
await Image.clearDiskCache();
await Image.clearMemoryCache();
```

---

## 5. Lazy Loading and Code Splitting

---

### 5.1 Lazy Loading Screens

Use `React.lazy` with `Suspense` to split large screens into separate chunks that are only loaded when navigated to:

```tsx
import { Suspense, lazy } from "react";
import { ActivityIndicator, View } from "react-native";

const HeavyAnalyticsScreen = lazy(() => import("@/screens/Analytics"));

function AnalyticsScreen() {
  return (
    <Suspense
      fallback={
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      }
    >
      <HeavyAnalyticsScreen />
    </Suspense>
  );
}
```

---

### 5.2 Deferred Initialisation

Defer expensive setup that doesn't need to happen before the first frame:

```tsx
// app/_layout.tsx
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    // Defer non-critical setup to after the first render
    const timer = setTimeout(() => {
      registerBackgroundSync();
      runMigrations();
      initAnalytics();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return <Stack />;
}
```

---

### 5.3 InteractionManager

Defer work until after animations and interactions complete:

```typescript
import { InteractionManager } from "react-native";

// Run expensive work only after the navigation animation is complete
InteractionManager.runAfterInteractions(() => {
  loadHeavyData();
  processLargeDataset();
});
```

---

## 6. Reducing Re-renders

---

### 6.1 Zustand Selector Granularity

Select only the slice of state your component needs:

```tsx
// Bad - re-renders whenever anything in the store changes
const store = useInstitutionStore();

// Good - re-renders only when institutions changes
const institutions = useInstitutionStore((state) => state.institutions);

// Best for expensive derived values - use shallow equality
import { useShallow } from "zustand/react/shallow";

const { institutions, selectedId } = useInstitutionStore(
  useShallow((state) => ({
    institutions: state.institutions,
    selectedId: state.selectedId,
  })),
);
```

---

### 6.2 Context Splitting

Split a large context into smaller, purpose-specific contexts to prevent components re-rendering when unrelated data changes:

```tsx
// Bad - every consumer re-renders when any auth state changes
const AuthContext = createContext({ user, token, theme, preferences });

// Good - separate concerns into separate contexts
const UserContext = createContext({ user });
const TokenContext = createContext({ token });
const ThemeContext = createContext({ theme });
```

---

## 7. Bundle Size

---

### 7.1 Analysing the Bundle

```bash
npx expo export --dump-sourcemap
npx source-map-explorer dist/_expo/static/js/web/*.js
```

Or use the Metro bundle visualiser:

```bash
EXPO_PUBLIC_APP_ENV=production npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/bundle.js \
  --sourcemap-output /tmp/bundle.map
npx react-native-bundle-visualizer
```

---

### 7.2 Tree-Shaking Imports

Import only what you use from large libraries:

```tsx
// Bad - imports the entire library
import _ from "lodash";
const result = _.groupBy(institutions, "country");

// Good - imports only the function needed
import groupBy from "lodash/groupBy";
const result = groupBy(institutions, "country");

// Best - use native alternatives where possible
const result = institutions.reduce<Record<string, Institution[]>>(
  (acc, inst) => {
    (acc[inst.country] ??= []).push(inst);
    return acc;
  },
  {},
);
```

---

### 7.3 Dynamic Imports

Load heavy modules only when they are needed:

```typescript
const handleExport = async () => {
  // Only load the PDF library when the user requests an export
  const { generatePDF } = await import("@/utils/pdfExport");
  await generatePDF(institutions);
};
```

---

## 8. Memory Leaks

Common causes of memory leaks in React Native:

| Cause                       | Fix                                            |
| --------------------------- | ---------------------------------------------- |
| Event listeners not removed | Return cleanup function from `useEffect`       |
| Timers not cleared          | `clearTimeout` / `clearInterval` in cleanup    |
| Subscriptions not cancelled | Call `.remove()` or `unsubscribe()` in cleanup |
| State updates after unmount | Use `AbortController` to cancel fetches        |

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch("/api/institutions", { signal: controller.signal })
    .then((res) => res.json())
    .then(setInstitutions)
    .catch((err) => {
      if (err.name !== "AbortError") console.error(err);
    });

  return () => controller.abort();
}, []);
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

### Task 1 - Memo and useCallback

Wrap `InstitutionRow` with `React.memo`. Pass the `onPress` handler using `useCallback` in the parent. Use React DevTools Profiler to verify the row components no longer re-render when a sibling row is pressed.

---

### Task 2 - FlatList Tuning

Add `getItemLayout`, `windowSize={5}`, and `removeClippedSubviews={true}` to your main institutions `FlatList`. Set a fixed `ITEM_HEIGHT` constant and use it in both the `getItemLayout` function and the row component's style.

---

### Task 3 - Expo Image

Replace all `<Image>` components in the app with `expo-image`. Add a `blurhash` placeholder to avatar images. Verify images fade in smoothly on first load and appear instantly on subsequent loads.

---

### Task 4 - Zustand Shallow Selectors

Audit all `useInstitutionStore` and `useAuthStore` usages. Replace any component that subscribes to multiple fields with `useShallow` to prevent unnecessary re-renders.

---

### Task 5 - InteractionManager

Wrap any expensive computation that runs after navigation (e.g. syncing the local SQLite database) with `InteractionManager.runAfterInteractions`. Verify the navigation animation is smooth by toggling the wrapping on and off.

---

### Task 6 - Memory Leak Audit

Add `AbortController` to every `fetch` call inside a `useEffect`. Add cleanup functions to all `useEffect` hooks that register timers, event listeners, or subscriptions.

---

## README

Update the `README.md` with a performance section documenting the optimisations applied and the metrics measured before and after.
