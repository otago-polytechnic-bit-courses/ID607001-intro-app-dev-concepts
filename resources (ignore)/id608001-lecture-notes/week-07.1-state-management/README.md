# Week 07.1 - State Management

## Navigation

|              | Link                                                                                                      |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 06.2 - Navigation and Routing](../week-06.2-navigation-routing/README.md)                           |
| Code Example | [Code Example](code-example)                                                                              |
| Next         | [Week 07.2 - Networking and API Integration](../week-07.2-networking-api-integration/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 07.1 branch:

```bash
git checkout -b w07.1-state-management
```

---

## 1. State Management in React Native

React Native uses the same state management patterns as React on the web. Choosing the right approach depends on the scope of the state:

| Scope                    | Approach                    |
| ------------------------ | --------------------------- |
| Single component         | `useState`, `useReducer`    |
| Shared across a subtree  | `useContext` + `useReducer` |
| Global application state | Zustand                     |
| Server/async state       | TanStack Query              |
| Form state               | React Hook Form             |

In this course we use **Zustand** for global client state and **TanStack Query** for server state. These are the current industry-standard choices for React Native applications.

---

## 2. Local State - useState and useReducer

---

### 2.1 useState

```tsx
import { useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.count}>{count}</Text>
      <Pressable onPress={() => setCount((c) => c + 1)} style={styles.button}>
        <Text style={styles.buttonText}>Increment</Text>
      </Pressable>
      <Pressable onPress={() => setCount(0)} style={styles.button}>
        <Text style={styles.buttonText}>Reset</Text>
      </Pressable>
    </View>
  );
}
```

---

### 2.2 useReducer

Use `useReducer` when state transitions are complex or when the next state depends on the previous state in non-trivial ways:

```tsx
import { useReducer } from "react";

interface FormState {
  name: string;
  region: string;
  country: string;
  errors: Record<string, string>;
  isSubmitting: boolean;
}

type FormAction =
  | {
      type: "SET_FIELD";
      field: keyof Omit<FormState, "errors" | "isSubmitting">;
      value: string;
    }
  | { type: "SET_ERROR"; field: string; message: string }
  | { type: "CLEAR_ERRORS" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_END" };

const initialState: FormState = {
  name: "",
  region: "",
  country: "",
  errors: {},
  isSubmitting: false,
};

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.message },
      };
    case "CLEAR_ERRORS":
      return { ...state, errors: {} };
    case "SUBMIT_START":
      return { ...state, isSubmitting: true, errors: {} };
    case "SUBMIT_END":
      return { ...state, isSubmitting: false };
    default:
      return state;
  }
}

export function InstitutionForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = async () => {
    dispatch({ type: "SUBMIT_START" });
    try {
      // await api call
    } finally {
      dispatch({ type: "SUBMIT_END" });
    }
  };

  return null; // UI omitted for brevity
}
```

---

## 3. Context API

The Context API shares state across a component tree without prop drilling. It is well-suited for low-frequency updates like theme and auth state.

```tsx
// context/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
}

const lightColors = {
  background: "#ffffff",
  surface: "#f9fafb",
  text: "#111827",
  textMuted: "#6b7280",
  primary: "#3b82f6",
  border: "#e5e7eb",
};

const darkColors = {
  background: "#111827",
  surface: "#1f2937",
  text: "#f9fafb",
  textMuted: "#9ca3af",
  primary: "#60a5fa",
  border: "#374151",
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () =>
    setTheme((current) => (current === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors: theme === "light" ? lightColors : darkColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
```

Register the provider in the root layout:

```tsx
// app/_layout.tsx
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
```

---

## 4. Zustand

**Zustand** is a minimal, fast, and scalable state management library. It requires no providers and has excellent TypeScript support. It is the recommended global state solution for React Native in 2024–2025.

```bash
npx expo install zustand
```

📖 Reference: [Zustand documentation](https://zustand.docs.pmnd.rs)

---

### 4.1 Creating a Store

```tsx
// store/useInstitutionStore.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface Institution {
  id: string;
  name: string;
  region: string;
  country: string;
}

interface InstitutionState {
  institutions: Institution[];
  selectedId: string | null;
  // Actions
  setInstitutions: (institutions: Institution[]) => void;
  addInstitution: (institution: Institution) => void;
  updateInstitution: (id: string, updates: Partial<Institution>) => void;
  removeInstitution: (id: string) => void;
  setSelectedId: (id: string | null) => void;
}

export const useInstitutionStore = create<InstitutionState>()(
  immer((set) => ({
    institutions: [],
    selectedId: null,

    setInstitutions: (institutions) =>
      set((state) => {
        state.institutions = institutions;
      }),

    addInstitution: (institution) =>
      set((state) => {
        state.institutions.push(institution);
      }),

    updateInstitution: (id, updates) =>
      set((state) => {
        const index = state.institutions.findIndex((i) => i.id === id);
        if (index !== -1) {
          Object.assign(state.institutions[index], updates);
        }
      }),

    removeInstitution: (id) =>
      set((state) => {
        state.institutions = state.institutions.filter((i) => i.id !== id);
      }),

    setSelectedId: (id) =>
      set((state) => {
        state.selectedId = id;
      }),
  })),
);
```

Install the Immer middleware for ergonomic immutable updates:

```bash
npx expo install immer
```

---

### 4.2 Using the Store

```tsx
// components/InstitutionList.tsx
import { useInstitutionStore } from "@/store/useInstitutionStore";

export function InstitutionList() {
  // Select only the slice you need — prevents unnecessary re-renders
  const institutions = useInstitutionStore((state) => state.institutions);
  const removeInstitution = useInstitutionStore(
    (state) => state.removeInstitution,
  );

  return (
    <FlatList
      data={institutions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Pressable onPress={() => removeInstitution(item.id)}>
            <Text>Delete</Text>
          </Pressable>
        </View>
      )}
    />
  );
}
```

---

### 4.3 Computed Values with Selectors

Compute derived values outside the store with selector functions:

```tsx
// Inline selector - re-renders only when NZ count changes
const nzCount = useInstitutionStore(
  (state) =>
    state.institutions.filter((i) => i.country === "New Zealand").length,
);

// Reusable selector
const selectByCountry = (country: string) => (state: InstitutionState) =>
  state.institutions.filter((i) => i.country === country);

const nzInstitutions = useInstitutionStore(selectByCountry("New Zealand"));
```

---

### 4.4 Auth Store

```tsx
// store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the token and user — not derived state
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
```

```bash
npx expo install @react-native-async-storage/async-storage
```

---

## 5. TanStack Query

**TanStack Query** (formerly React Query) manages server state — data that lives on a remote server and needs to be fetched, cached, synchronised, and kept fresh. It handles loading states, error states, background refetching, and caching automatically.

```bash
npx expo install @tanstack/react-query
```

📖 Reference: [TanStack Query documentation](https://tanstack.com/query/latest)

---

### 5.1 Setup

Wrap the app with `QueryClientProvider` in the root layout:

```tsx
// app/_layout.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      retry: 2, // Retry failed requests twice
      refetchOnWindowFocus: false, // Don't refetch on app foreground (use AppState)
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

---

### 5.2 useQuery - Fetching Data

```tsx
// hooks/useInstitutions.ts
import { useQuery } from "@tanstack/react-query";

const fetchInstitutions = async (): Promise<Institution[]> => {
  const res = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/v2/institutions`,
  );
  if (!res.ok) throw new Error("Failed to fetch institutions");
  const data = await res.json();
  return data.data;
};

export function useInstitutions() {
  return useQuery({
    queryKey: ["institutions"],
    queryFn: fetchInstitutions,
  });
}
```

Use in a screen:

```tsx
// app/(tabs)/institutions.tsx
import { useInstitutions } from "@/hooks/useInstitutions";
import { FlatList, Text, View, ActivityIndicator } from "react-native";

export default function InstitutionsScreen() {
  const { data, isLoading, isError, error, refetch } = useInstitutions();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
        }}
      >
        <Text style={{ color: "#ef4444", textAlign: "center" }}>
          {error.message}
        </Text>
        <Pressable onPress={() => refetch()} style={{ marginTop: 16 }}>
          <Text style={{ color: "#3b82f6" }}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <Text>{item.name}</Text>}
      onRefresh={refetch}
      refreshing={isLoading}
    />
  );
}
```

---

### 5.3 useMutation - Creating and Updating Data

```tsx
// hooks/useCreateInstitution.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";

interface CreateInstitutionInput {
  name: string;
  region: string;
  country: string;
}

export function useCreateInstitution() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  return useMutation({
    mutationFn: async (input: CreateInstitutionInput) => {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/v2/institutions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(input),
        },
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Failed to create institution");
      }

      return res.json();
    },

    onSuccess: () => {
      // Invalidate and refetch the institutions list
      queryClient.invalidateQueries({ queryKey: ["institutions"] });
    },
  });
}
```

Use in a screen:

```tsx
const { mutate, isPending, error } = useCreateInstitution();

const handleSubmit = () => {
  mutate(
    { name, region, country },
    {
      onSuccess: () => router.back(),
      onError: (err) => console.error(err.message),
    },
  );
};
```

---

### 5.4 Query Keys

Query keys uniquely identify queries and control caching and invalidation:

```tsx
// Flat key - for global lists
["institutions"][
  // Nested key - for filtered or paginated data
  ("institutions", { country: "New Zealand" })
][
  // Entity key - for a single record
  ("institutions", id)
][
  // Hierarchical - for dependent data
  ("institutions", id, "departments")
];
```

Invalidate all institution queries at once:

```tsx
queryClient.invalidateQueries({ queryKey: ["institutions"] });
```

---

## 6. React Hook Form

**React Hook Form** manages form state with minimal re-renders and built-in validation.

```bash
npx expo install react-hook-form
```

```tsx
// components/CreateInstitutionForm.tsx
import { useForm, Controller } from "react-hook-form";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

interface FormValues {
  name: string;
  region: string;
  country: string;
}

interface Props {
  onSubmit: (values: FormValues) => void;
  isLoading?: boolean;
}

export function CreateInstitutionForm({ onSubmit, isLoading }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { name: "", region: "", country: "" },
  });

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="name"
        rules={{
          required: "Name is required",
          minLength: { value: 3, message: "Minimum 3 characters" },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Institution name"
              autoCapitalize="words"
            />
            {errors.name && (
              <Text style={styles.errorText}>{errors.name.message}</Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="region"
        rules={{ required: "Region is required" }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.field}>
            <Text style={styles.label}>Region</Text>
            <TextInput
              style={[styles.input, errors.region && styles.inputError]}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Region"
            />
            {errors.region && (
              <Text style={styles.errorText}>{errors.region.message}</Text>
            )}
          </View>
        )}
      />

      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={[styles.button, isLoading && styles.buttonDisabled]}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Creating..." : "Create Institution"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#ef4444" },
  errorText: { fontSize: 12, color: "#ef4444" },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
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

### Task 1 - Institution Store

Implement `useInstitutionStore` using Zustand with Immer. Add actions for `setInstitutions`, `addInstitution`, `updateInstitution`, and `removeInstitution`. Use the store in the Institutions tab to manage a static list.

---

### Task 2 - Auth Store with Persistence

Implement `useAuthStore` with Zustand `persist` middleware backed by AsyncStorage. Verify that the store survives an app reload by logging `isAuthenticated` on mount.

---

### Task 3 - Theme Context

Implement `ThemeContext` from Section 3. Add a toggle button to the Profile tab. Ensure all screens respond to the theme change by reading colours from `useTheme().colors`.

---

### Task 4 - TanStack Query Setup

Set up `QueryClientProvider` in the root layout. Create `useInstitutions` using `useQuery` that fetches from your deployed API. Display a loading spinner, error message, and pull-to-refresh on the Institutions screen.

---

### Task 5 - Create Institution with useMutation

Implement `useCreateInstitution` with `useMutation`. Connect it to the `CreateInstitutionForm`. On success, invalidate the institutions query and navigate back. On error, display the error message below the form.

---

### Task 6 - Optimistic Updates

Extend `useCreateInstitution` to use `onMutate` for optimistic updates: immediately add the new institution to the query cache before the server responds. Roll back on error using `onError` and the returned context.

---

## README

Update the `README.md` to document the state management architecture: which store handles which state and why.
