# Week 08.2 - Authentication Flows

## Navigation

|              | Link                                                                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 08.1 - Local Storage, Async Storage and SQLite](../week-08.1-local-storage-async-storage-sqlite/README.md)  |
| Code Example | [Code Example](code-example)                                                                                      |
| Next         | [Week 09.1 - Push Notifications and Background Tasks](../week-09.1-push-notifications-background-tasks/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 08.2 branch:

```bash
git checkout -b w08.2-authentication-flows
```

---

## 1. Authentication Architecture

A mobile authentication flow must handle several concerns that do not exist in web applications:

- Tokens must be stored securely (Keychain/Keystore, not AsyncStorage)
- The app must redirect to login when a token expires, from any screen
- The auth state must be available before the first screen renders to avoid a flash of the wrong UI
- Biometric authentication can replace the PIN/password on returning users

---

### 1.1 Auth State Machine

```
App start
    │
    ▼
Load token from SecureStore
    │
    ├── No token ──────────────────→ (auth) group → Login screen
    │
    └── Token found
            │
            ▼
        Validate token (call /api/auth/me)
            │
            ├── Valid ─────────────→ (tabs) group → Home screen
            │
            └── Invalid/Expired
                    │
                    ▼
                Attempt refresh
                    │
                    ├── Success ──→ (tabs) group → Home screen
                    └── Failure ──→ (auth) group → Login screen
```

---

## 2. Protected Routes with Expo Router

Use Expo Router's layout files to guard routes. The auth guard lives in a single `_layout.tsx` file and redirects unauthenticated users before any screen renders:

```tsx
// app/(tabs)/_layout.tsx
import { Redirect, Tabs } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {
  const { isAuthenticated, isHydrated } = useAuthStore();

  // Wait for the persisted store to rehydrate from SecureStore
  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <Tabs>{/* tab screens */}</Tabs>;
}
```

Update the auth store to expose `isHydrated`:

```typescript
// store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { secureStorage } from "@/lib/secureStorage";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,
      setAuth: (user, accessToken) =>
        set({ user, accessToken, isAuthenticated: true }),
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => secureStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
```

---

## 3. Login and Register Screens

---

### 3.1 Login Screen

```tsx
// app/(auth)/login.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/apiClient";

interface LoginFormValues {
  emailAddress: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: { emailAddress: "", password: "" },
  });

  const {
    mutate: login,
    isPending,
    error,
  } = useMutation({
    mutationFn: (values: LoginFormValues) =>
      apiClient.post<{ token: string; user: User }>("/api/auth/login", values, {
        requiresAuth: false,
      }),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      router.replace("/(tabs)");
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error.message}</Text>
          </View>
        )}

        <Controller
          control={control}
          name="emailAddress"
          rules={{
            required: "Email is required",
            pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.emailAddress && styles.inputError]}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
              />
              {errors.emailAddress && (
                <Text style={styles.fieldError}>
                  {errors.emailAddress.message}
                </Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="password"
          rules={{ required: "Password is required" }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={[styles.input, errors.password && styles.inputError]}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder="••••••••"
                secureTextEntry
                autoComplete="current-password"
                textContentType="password"
              />
              {errors.password && (
                <Text style={styles.fieldError}>{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <Pressable
          onPress={handleSubmit((v) => login(v))}
          style={[styles.button, isPending && styles.buttonLoading]}
          disabled={isPending}
        >
          <Text style={styles.buttonText}>
            {isPending ? "Signing in..." : "Sign In"}
          </Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/register" style={styles.footerLink}>
            <Text style={styles.footerLinkText}>Register</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 28, fontWeight: "700", color: "#111827", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6b7280", marginBottom: 32 },
  errorBanner: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorBannerText: { color: "#dc2626", fontSize: 14 },
  field: { marginBottom: 16, gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#fff",
  },
  inputError: { borderColor: "#ef4444" },
  fieldError: { fontSize: 12, color: "#ef4444" },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonLoading: { opacity: 0.7 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#6b7280", fontSize: 14 },
  footerLink: {},
  footerLinkText: { color: "#3b82f6", fontSize: 14, fontWeight: "600" },
});
```

---

### 3.2 KeyboardAvoidingView

Always wrap forms in `KeyboardAvoidingView` to prevent the keyboard from obscuring input fields:

```tsx
<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    {/* form fields */}
  </ScrollView>
</KeyboardAvoidingView>
```

> Use `keyboardShouldPersistTaps="handled"` so tapping outside a focused input on the scroll view doesn't dismiss the keyboard before the tap is handled.

---

## 4. Biometric Authentication

**Expo LocalAuthentication** enables Face ID, Touch ID, and fingerprint authentication:

```bash
npx expo install expo-local-authentication
```

Add to `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSFaceIDUsageDescription": "Use Face ID to sign in quickly and securely."
      }
    }
  }
}
```

```typescript
// hooks/useBiometricAuth.ts
import * as LocalAuthentication from "expo-local-authentication";

export function useBiometricAuth() {
  const isAvailable = async (): Promise<boolean> => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  };

  const authenticate = async (): Promise<boolean> => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Sign in with biometrics",
      fallbackLabel: "Use password",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    return result.success;
  };

  const getSupportedTypes = async () => {
    return LocalAuthentication.supportedAuthenticationTypesAsync();
  };

  return { isAvailable, authenticate, getSupportedTypes };
}
```

Usage in the login screen:

```tsx
const { isAvailable, authenticate } = useBiometricAuth();
const setAuth = useAuthStore((state) => state.setAuth);

const handleBiometricLogin = async () => {
  const available = await isAvailable();
  if (!available) {
    Alert.alert("Biometrics not available", "Please use your password.");
    return;
  }

  const success = await authenticate();
  if (success) {
    // Retrieve stored credentials and log in silently
    const storedToken = await secureStorage.get("accessToken");
    if (storedToken) {
      // Validate token with the server, then setAuth
    }
  }
};
```

---

## 5. Logout

Logout must clear all local state and redirect to login:

```typescript
// hooks/useLogout.ts
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { secureStorage } from "@/lib/secureStorage";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // Invalidate the refresh token on the server
      await apiClient.post("/api/auth/logout", {});
    } catch {
      // Continue even if the server call fails
    } finally {
      // Clear local state
      clearAuth();
      await secureStorage.delete("accessToken");
      queryClient.clear();
      router.replace("/login");
    }
  };

  return { logout };
}
```

---

## 6. Session Validation on App Resume

Validate the stored token when the app comes back to the foreground:

```tsx
// hooks/useSessionValidation.ts
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/apiClient";
import { useRouter } from "expo-router";

export function useSessionValidation() {
  const { isAuthenticated, clearAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) return;

    const handleAppStateChange = async (nextState: AppStateStatus) => {
      if (nextState === "active") {
        try {
          await apiClient.get("/api/auth/me");
        } catch {
          clearAuth();
          router.replace("/login");
        }
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [isAuthenticated]);
}
```

---

## 7. OAuth and Social Login

For Google, Apple, or GitHub sign-in use **Expo AuthSession**:

```bash
npx expo install expo-auth-session expo-web-browser expo-crypto
```

```typescript
// hooks/useGoogleAuth.ts
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/lib/apiClient";

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      const googleToken = response.authentication.accessToken;

      // Exchange the Google token for your own API token
      apiClient
        .post<{ token: string; user: User }>(
          "/api/auth/google",
          { token: googleToken },
          { requiresAuth: false },
        )
        .then((data) => setAuth(data.user, data.token))
        .catch(console.error);
    }
  }, [response]);

  return { request, promptAsync };
}
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

### Task 1 - Protected Route Guard

Implement the auth guard in `app/(tabs)/_layout.tsx`. Verify that navigating to any tab screen redirects to login when `isAuthenticated` is false.

---

### Task 2 - Login Screen

Implement the full login screen with React Hook Form validation. Connect it to your API's login endpoint and store the token in SecureStore on success.

---

### Task 3 - Register Screen

Create `app/(auth)/register.tsx` with fields for first name, last name, email, password, and confirm password. Validate that passwords match using React Hook Form's `validate` rule.

---

### Task 4 - Logout

Implement `useLogout` and add a logout button to the Profile tab. Verify it clears the auth store, removes the SecureStore token, clears the TanStack Query cache, and redirects to login.

---

### Task 5 - Biometric Login

Implement `useBiometricAuth`. On the login screen, show a biometric button if biometrics are available. Store a flag in SecureStore (`biometrics-enabled`) that the user opts into after their first successful password login.

---

### Task 6 - Session Validation

Implement `useSessionValidation` and call it from the root layout. Simulate an expired token by manually deleting it from SecureStore while the app is backgrounded, then verify the app redirects to login on resume.

---

## README

Update the `README.md` to document the authentication flow, token storage strategy, and how to configure biometric authentication.
