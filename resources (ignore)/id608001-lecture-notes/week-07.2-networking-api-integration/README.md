# Week 07.2 - Networking and API Integration

## Navigation

|              | Link                                                                                                           |
| ------------ | -------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 07.1 - State Management](../week-07.1-state-management/README.md)                                        |
| Code Example | [Code Example](code-example)                                                                                   |
| Next         | [Week 08.1 - Local Storage, Async Storage and SQLite](../week-08.1-local-storage-async-storage-sqlite/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 07.2 branch:

```bash
git checkout -b w07.2-networking-api-integration
```

---

## 1. Networking in React Native

React Native supports the standard `fetch` API. For most applications, a lightweight wrapper around `fetch` with a consistent error handling strategy is sufficient. For more complex needs, **Axios** is a popular alternative.

---

### 1.1 Network Permissions

No special permissions are needed to make HTTP requests on iOS or Android. However, iOS enforces **App Transport Security (ATS)**, which requires HTTPS for all production connections. During development, you can allow HTTP in `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSAppTransportSecurity": {
          "NSAllowsArbitraryLoads": true
        }
      }
    }
  }
}
```

> Remove `NSAllowsArbitraryLoads` before submitting to the App Store. Your production API must use HTTPS.

---

## 2. API Client

Create a centralised API client that handles base URL, authentication headers, error normalisation, and token refresh in one place.

---

### 2.1 API Client Setup

```typescript
// lib/apiClient.ts
import { useAuthStore } from "@/store/useAuthStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  tenantSlug?: string;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { requiresAuth = true, tenantSlug, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  if (requiresAuth) {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (tenantSlug) {
    headers.set("X-Tenant-ID", tenantSlug);
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    const message =
      typeof errorData === "object" &&
      errorData !== null &&
      "message" in errorData
        ? String((errorData as { message: unknown }).message)
        : `Request failed with status ${response.status}`;

    throw new ApiError(response.status, message, errorData);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
```

---

### 2.2 Typed API Response Interfaces

```typescript
// types/api.ts

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface Institution {
  id: string;
  name: string;
  region: string;
  country: string;
}

export interface Department {
  id: string;
  name: string;
  institutionId: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  role: string;
}
```

---

### 2.3 Resource API Modules

Group API calls by resource:

```typescript
// api/institutions.ts
import { apiClient } from "@/lib/apiClient";
import type { Institution, PaginatedResponse } from "@/types/api";

interface InstitutionQueryParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  country?: string;
}

const buildQuery = (params: Record<string, unknown>): string => {
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");
  return qs ? `?${qs}` : "";
};

export const institutionsApi = {
  getAll: (params: InstitutionQueryParams = {}) =>
    apiClient.get<PaginatedResponse<Institution>>(
      `/api/v2/institutions${buildQuery(params)}`,
    ),

  getById: (id: string) =>
    apiClient.get<{ data: Institution }>(`/api/v2/institutions/${id}`),

  create: (body: Omit<Institution, "id">) =>
    apiClient.post<{ message: string; data: Institution[] }>(
      "/api/v2/institutions",
      body,
    ),

  update: (id: string, body: Partial<Omit<Institution, "id">>) =>
    apiClient.put<{ message: string; data: Institution }>(
      `/api/v2/institutions/${id}`,
      body,
    ),

  delete: (id: string) =>
    apiClient.delete<{ message: string }>(`/api/v2/institutions/${id}`),
};
```

---

## 3. Token Refresh Interceptor

When the access token expires, automatically request a new one and retry the original request:

```typescript
// lib/apiClient.ts (updated)
import * as SecureStore from "expo-secure-store";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const refreshAccessToken = async (): Promise<string> => {
  const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include", // Sends the httpOnly refresh token cookie
  });

  if (!response.ok) {
    useAuthStore.getState().clearAuth();
    throw new ApiError(401, "Session expired. Please log in again.");
  }

  const data = await response.json();
  const newToken: string = data.accessToken;

  useAuthStore.getState().setAccessToken(newToken);
  return newToken;
};

// In the request function, handle 401 with token refresh:
if (response.status === 401 && requiresAuth) {
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const newToken = await refreshAccessToken();
      isRefreshing = false;
      onTokenRefreshed(newToken);
      // Retry the original request with the new token
      headers.set("Authorization", `Bearer ${newToken}`);
      return request<T>(path, options);
    } catch {
      isRefreshing = false;
      throw new ApiError(401, "Session expired. Please log in again.");
    }
  }

  // Queue subsequent requests until the refresh completes
  return new Promise<T>((resolve, reject) => {
    addRefreshSubscriber((token) => {
      headers.set("Authorization", `Bearer ${token}`);
      resolve(request<T>(path, options));
    });
  });
}
```

---

## 4. Network State Monitoring

Use **NetInfo** to detect connectivity changes and inform users when they are offline:

```bash
npx expo install @react-native-community/netinfo
```

```tsx
// hooks/useNetworkStatus.ts
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

interface NetworkStatus {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  connectionType: string | null;
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>({
    isConnected: null,
    isInternetReachable: null,
    connectionType: null,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setStatus({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
        connectionType: state.type,
      });
    });

    return unsubscribe;
  }, []);

  return status;
}
```

```tsx
// components/OfflineBanner.tsx
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { View, Text, StyleSheet } from "react-native";

export function OfflineBanner() {
  const { isConnected, isInternetReachable } = useNetworkStatus();

  if (isConnected && isInternetReachable !== false) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>You are offline</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#ef4444",
    paddingVertical: 8,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
```

---

## 5. Secure Token Storage

Never store sensitive tokens in `AsyncStorage` — it is unencrypted. Use **Expo SecureStore** which uses the iOS Keychain and Android Keystore:

```bash
npx expo install expo-secure-store
```

```typescript
// lib/secureStorage.ts
import * as SecureStore from "expo-secure-store";

export const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(key);
  },

  async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },
};

// Usage
await secureStorage.set("accessToken", token);
const token = await secureStorage.get("accessToken");
await secureStorage.delete("accessToken");
```

Update the auth store to persist the access token via SecureStore:

```typescript
// store/useAuthStore.ts
import { secureStorage } from "@/lib/secureStorage";

// Replace AsyncStorage persist with manual SecureStore calls
setAuth: async (user, accessToken) => {
  await secureStorage.set("accessToken", accessToken);
  set({ user, accessToken, isAuthenticated: true });
},

clearAuth: async () => {
  await secureStorage.delete("accessToken");
  set({ user: null, accessToken: null, isAuthenticated: false });
},
```

---

## 6. Pagination with TanStack Query

```tsx
// hooks/useInstitutions.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { institutionsApi } from "@/api/institutions";

export function useInstitutionsInfinite() {
  return useInfiniteQuery({
    queryKey: ["institutions", "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      institutionsApi.getAll({ page: pageParam, pageSize: 15 }),
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage,
    initialPageParam: 1,
  });
}
```

```tsx
// In the screen
const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
  useInstitutionsInfinite();

const institutions = data?.pages.flatMap((page) => page.data) ?? [];

<FlatList
  data={institutions}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => <InstitutionRow institution={item} />}
  onEndReached={() => hasNextPage && fetchNextPage()}
  onEndReachedThreshold={0.3}
  ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
/>;
```

---

## 7. Error Handling Patterns

```tsx
// hooks/useApiError.ts
import { ApiError } from "@/lib/apiClient";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";

export function useApiError() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleError = (err: unknown): string => {
    if (err instanceof ApiError) {
      if (err.status === 401) {
        clearAuth();
        router.replace("/login");
        return "Your session has expired. Please log in again.";
      }

      if (err.status === 403) {
        return "You do not have permission to perform this action.";
      }

      if (err.status === 404) {
        return "The requested resource was not found.";
      }

      if (err.status >= 500) {
        return "Something went wrong on our end. Please try again.";
      }

      return err.message;
    }

    if (err instanceof Error) {
      if (err.message.includes("Network request failed")) {
        return "No internet connection. Please check your network.";
      }
      return err.message;
    }

    return "An unexpected error occurred.";
  };

  return { handleError };
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

### Task 1 - API Client

Implement `lib/apiClient.ts` with `get`, `post`, `put`, and `delete` methods. Add the `Authorization` header from `useAuthStore` automatically. Test it against your deployed API.

---

### Task 2 - Institutions API Module

Create `api/institutions.ts` with `getAll`, `getById`, `create`, `update`, and `delete` functions. Connect `getAll` to the Institutions screen via `useInstitutions` (TanStack Query).

---

### Task 3 - Secure Token Storage

Replace the AsyncStorage persist in `useAuthStore` with `expo-secure-store`. Verify the token survives app reload and is not visible in plain text.

---

### Task 4 - Offline Banner

Implement `OfflineBanner` and place it at the top of every screen (in `_layout.tsx`). Verify it appears when you disable Wi-Fi on your device or simulator.

---

### Task 5 - Infinite Scroll

Replace the paginated `useInstitutions` query with `useInstitutionsInfinite`. Implement `onEndReached` on the `FlatList` to load more pages automatically.

---

### Task 6 - Error Handling

Implement `useApiError`. Apply it in all mutation `onError` callbacks to display user-friendly error messages using an `Alert` or an inline error state.

---

## README

Update the `README.md` to document the API client configuration and environment variables required.
