# Week 08.1 - Local Storage, Async Storage and SQLite

## Navigation

|              | Link                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------- |
| Previous     | [Week 07.2 - Networking and API Integration](../week-07.2-networking-api-integration/README.md) |
| Code Example | [Code Example](code-example)                                                                    |
| Next         | [Week 08.2 - Authentication Flows](../week-08.2-authentication-flows/README.md)                 |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 08.1 branch:

```bash
git checkout -b w08.1-local-storage-async-storage-sqlite
```

---

## 1. Local Storage Options in React Native

| Option               | Best For                                  | Persistence              | Encryption           |
| -------------------- | ----------------------------------------- | ------------------------ | -------------------- |
| **AsyncStorage**     | Simple key-value pairs, user preferences  | App reinstall wipes data | No                   |
| **Expo SecureStore** | Sensitive tokens, credentials             | App reinstall wipes data | Yes (OS Keychain)    |
| **Expo SQLite**      | Structured relational data, offline-first | App reinstall wipes data | Optional (SQLCipher) |
| **MMKV**             | High-frequency reads/writes, settings     | App reinstall wipes data | Optional             |
| **Expo FileSystem**  | Binary files, documents, media            | App reinstall wipes data | No                   |

---

## 2. AsyncStorage

**AsyncStorage** is an unencrypted, persistent key-value store. Use it for non-sensitive user preferences, settings, and cached data that does not need encryption.

```bash
npx expo install @react-native-async-storage/async-storage
```

---

### 2.1 Basic Usage

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Store a value
await AsyncStorage.setItem("theme", "dark");

// Read a value
const theme = await AsyncStorage.getItem("theme"); // "dark" | null

// Remove a value
await AsyncStorage.removeItem("theme");

// Store an object (must be serialised)
await AsyncStorage.setItem(
  "user-prefs",
  JSON.stringify({ fontSize: 16, notifications: true }),
);
const raw = await AsyncStorage.getItem("user-prefs");
const prefs = raw ? JSON.parse(raw) : null;

// Batch operations
await AsyncStorage.multiSet([
  ["key1", "value1"],
  ["key2", "value2"],
]);

const results = await AsyncStorage.multiGet(["key1", "key2"]);
// results: [["key1", "value1"], ["key2", "value2"]]

// Clear everything (use sparingly)
await AsyncStorage.clear();
```

---

### 2.2 Typed Storage Helper

Wrap AsyncStorage with a typed, JSON-aware interface:

```typescript
// lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  async set<T>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },

  async get<T>(key: string): Promise<T | null> {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },

  async clear(): Promise<void> {
    await AsyncStorage.clear();
  },
};
```

---

### 2.3 Preferences Store

```typescript
// store/usePreferencesStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FontSize = "small" | "medium" | "large";
type Theme = "light" | "dark" | "system";

interface PreferencesState {
  theme: Theme;
  fontSize: FontSize;
  notificationsEnabled: boolean;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "system",
      fontSize: "medium",
      notificationsEnabled: true,
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      setNotificationsEnabled: (notificationsEnabled) =>
        set({ notificationsEnabled }),
    }),
    {
      name: "user-preferences",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
```

---

## 3. Expo SQLite

**Expo SQLite** provides a full SQLite database on device. Use it for structured data, offline-first applications, and when you need to query, sort, or filter large datasets locally.

The current version is **expo-sqlite v14** (Expo SDK 52), which uses a modern async/await API with a React hook for reactive queries.

```bash
npx expo install expo-sqlite
```

📖 Reference: [Expo SQLite documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/)

---

### 3.1 Opening a Database

```typescript
// lib/database.ts
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("app.db");
```

`openDatabaseSync` opens or creates the database file synchronously. The file is stored in the app's document directory and persists across app restarts.

---

### 3.2 Running Migrations

Create and run migrations on app startup:

```typescript
// lib/migrations.ts
import { db } from "./database";

export const runMigrations = () => {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS institutions (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      region TEXT NOT NULL,
      country TEXT NOT NULL,
      synced_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      institution_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_departments_institution_id
      ON departments(institution_id);
  `);
};
```

Call migrations before the app renders:

```tsx
// app/_layout.tsx
import { runMigrations } from "@/lib/migrations";

runMigrations();

export default function RootLayout() {
  return <Stack />;
}
```

---

### 3.3 CRUD Operations

```typescript
// repositories/institutionRepository.ts
import { db } from "@/lib/database";
import type { Institution } from "@/types/api";

export const institutionRepository = {
  insert(institution: Institution): void {
    db.runSync(
      `INSERT OR REPLACE INTO institutions (id, name, region, country, synced_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [
        institution.id,
        institution.name,
        institution.region,
        institution.country,
      ],
    );
  },

  insertMany(institutions: Institution[]): void {
    db.withTransactionSync(() => {
      for (const inst of institutions) {
        institutionRepository.insert(inst);
      }
    });
  },

  findAll(): Institution[] {
    return db.getAllSync<Institution>(
      "SELECT id, name, region, country FROM institutions ORDER BY name ASC",
    );
  },

  findById(id: string): Institution | null {
    return (
      db.getFirstSync<Institution>(
        "SELECT id, name, region, country FROM institutions WHERE id = ?",
        [id],
      ) ?? null
    );
  },

  search(query: string): Institution[] {
    return db.getAllSync<Institution>(
      `SELECT id, name, region, country FROM institutions
       WHERE name LIKE ? OR region LIKE ? OR country LIKE ?
       ORDER BY name ASC`,
      [`%${query}%`, `%${query}%`, `%${query}%`],
    );
  },

  delete(id: string): void {
    db.runSync("DELETE FROM institutions WHERE id = ?", [id]);
  },

  deleteAll(): void {
    db.runSync("DELETE FROM institutions");
  },
};
```

---

### 3.4 Reactive Queries with useSQLiteContext and SQLiteProvider

Expo SQLite provides a React context and hook for reactive queries that re-run when the database changes:

```tsx
// app/_layout.tsx
import { SQLiteProvider } from "expo-sqlite";
import { runMigrations } from "@/lib/migrations";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="app.db" onInit={runMigrations}>
      <Stack />
    </SQLiteProvider>
  );
}
```

```tsx
// screens/LocalInstitutionsScreen.tsx
import { useSQLiteContext } from "expo-sqlite";
import { useState, useEffect } from "react";
import type { Institution } from "@/types/api";

export function LocalInstitutionsScreen() {
  const db = useSQLiteContext();
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const results = db.getAllSync<Institution>(
      query
        ? `SELECT * FROM institutions WHERE name LIKE ? ORDER BY name`
        : `SELECT * FROM institutions ORDER BY name`,
      query ? [`%${query}%`] : [],
    );
    setInstitutions(results);
  }, [query, db]);

  return null; // UI omitted for brevity
}
```

---

### 3.5 Offline-First Sync Pattern

A common pattern is to store API responses locally and serve local data immediately while syncing in the background:

```typescript
// hooks/useInstitutionsOffline.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { institutionRepository } from "@/repositories/institutionRepository";
import { institutionsApi } from "@/api/institutions";

export function useInstitutionsOffline() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["institutions", "offline"],
    queryFn: async () => {
      // 1. Return local data immediately
      const local = institutionRepository.findAll();

      // 2. Fetch fresh data from the API in the background
      try {
        const remote = await institutionsApi.getAll({ pageSize: 100 });

        // 3. Sync remote data into SQLite
        institutionRepository.insertMany(remote.data);

        // 4. Return the freshly synced local data
        return institutionRepository.findAll();
      } catch {
        // Network unavailable — return local data
        return local;
      }
    },
    staleTime: 1000 * 60 * 5,
  });
}
```

---

## 4. MMKV

**MMKV** is a high-performance key-value store based on the same library used by WeChat. It is significantly faster than AsyncStorage for synchronous reads and writes.

```bash
npx expo install react-native-mmkv
```

> MMKV requires a development build (not Expo Go). Use it for settings and preferences that are read on every render.

```typescript
// lib/mmkv.ts
import { MMKV } from "react-native-mmkv";

export const mmkv = new MMKV({ id: "app-storage" });

// Synchronous reads — no await needed
mmkv.set("onboarded", true);
const onboarded = mmkv.getBoolean("onboarded");

mmkv.set("count", 42);
const count = mmkv.getNumber("count");

mmkv.set("user", JSON.stringify({ id: "1", name: "Jane" }));
const raw = mmkv.getString("user");
const user = raw ? JSON.parse(raw) : null;
```

Use MMKV as the storage backend for Zustand:

```typescript
import { StateStorage } from "zustand/middleware";
import { mmkv } from "@/lib/mmkv";

const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => mmkv.delete(name),
};
```

---

## 5. Expo FileSystem

Use **Expo FileSystem** for reading and writing files — documents, images, cached downloads, and exports:

```bash
npx expo install expo-file-system
```

```typescript
// lib/fileCache.ts
import * as FileSystem from "expo-file-system";

const CACHE_DIR = `${FileSystem.cacheDirectory}api/`;

export const fileCache = {
  async ensureDir(): Promise<void> {
    const info = await FileSystem.getInfoAsync(CACHE_DIR);
    if (!info.exists) {
      await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true });
    }
  },

  async write(key: string, data: unknown): Promise<void> {
    await fileCache.ensureDir();
    const path = `${CACHE_DIR}${key}.json`;
    await FileSystem.writeAsStringAsync(path, JSON.stringify(data));
  },

  async read<T>(key: string): Promise<T | null> {
    const path = `${CACHE_DIR}${key}.json`;
    const info = await FileSystem.getInfoAsync(path);
    if (!info.exists) return null;
    const raw = await FileSystem.readAsStringAsync(path);
    return JSON.parse(raw) as T;
  },

  async downloadImage(url: string): Promise<string> {
    await fileCache.ensureDir();
    const filename = url.split("/").pop() ?? "image";
    const localPath = `${CACHE_DIR}${filename}`;
    const info = await FileSystem.getInfoAsync(localPath);
    if (info.exists) return localPath;
    const { uri } = await FileSystem.downloadAsync(url, localPath);
    return uri;
  },
};
```

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

```typescript
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

### Task 1 - Preferences Store

Implement `usePreferencesStore` with Zustand and AsyncStorage. Add a settings screen where the user can toggle `notificationsEnabled` and select a font size. Verify the preference persists after reloading the app.

---

### Task 2 - SQLite Migrations

Set up `SQLiteProvider` in the root layout with an `onInit` migration that creates the `institutions` and `departments` tables. Verify the database is created by inspecting it with a tool like DB Browser for SQLite.

---

### Task 3 - Institution Repository

Implement all five methods in `institutionRepository` (`insert`, `insertMany`, `findAll`, `findById`, `delete`). Write a simple test that inserts three institutions, reads them back, and asserts the count.

---

### Task 4 - Offline-First Screen

Implement `useInstitutionsOffline`. Create an offline Institutions screen that shows local data immediately, then shows a "Synced" timestamp after the background fetch completes.

---

### Task 5 - Local Search

Add a `TextInput` search bar to the offline Institutions screen. Use the `search` method from `institutionRepository` to filter results locally as the user types, with a 200ms debounce.

---

### Task 6 - File Cache

Implement `fileCache.downloadImage`. Use it in your `ProfileCard` to cache avatar images locally so they display even when offline.

---

## README

Update the `README.md` to document the local storage strategy: which store is used for what data and why.
