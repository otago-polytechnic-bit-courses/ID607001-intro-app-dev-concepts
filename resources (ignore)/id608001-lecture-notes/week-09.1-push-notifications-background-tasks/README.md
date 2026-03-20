# Week 09.1 - Push Notifications and Background Tasks

## Navigation

|              | Link                                                                                               |
| ------------ | -------------------------------------------------------------------------------------------------- |
| Previous     | [Week 08.2 - Authentication Flows](../week-08.2-authentication-flows/README.md)                    |
| Code Example | [Code Example](code-example)                                                                       |
| Next         | [Week 09.2 - Camera, Location and Device APIs](../week-09.2-camera-location-device-apis/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 09.1 branch:

```bash
git checkout -b w09.1-push-notifications-background-tasks
```

---

## 1. Push Notifications

Push notifications are messages sent from a server to a device even when the app is not in the foreground. In React Native with Expo, push notifications are handled by **Expo Notifications**, which abstracts the platform-specific services (APNs for iOS, FCM for Android).

```bash
npx expo install expo-notifications expo-device
```

📖 Reference: [Expo Notifications documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)

---

### 1.1 How Expo Push Notifications Work

```
Your Server
    │
    │  HTTP POST to Expo Push API
    │  with Expo Push Token + payload
    ▼
Expo Push Service
    │
    ├── iOS ──→ APNs ──→ iPhone
    └── Android ──→ FCM ──→ Android device
```

The Expo Push Token is a unique identifier for a specific device/app installation. Your server sends notifications to the Expo Push API using this token.

---

### 1.2 Configuration

Add to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#3b82f6",
          "sounds": [],
          "androidMode": "default",
          "androidCollapsedTitle": "#{unread_notifications} new updates"
        }
      ]
    ],
    "android": {
      "googleServicesFile": "./google-services.json"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist"
    }
  }
}
```

---

### 1.3 Requesting Permission and Getting the Push Token

```typescript
// hooks/usePushNotifications.ts
import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const registerForPushNotifications = async (): Promise<string | null> => {
    if (!Device.isDevice) {
      console.warn("Push notifications only work on physical devices");
      return null;
    }

    // Check/request permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      return null;
    }

    // Android requires a notification channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#3b82f6",
      });
    }

    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ??
      Constants.easConfig?.projectId;

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    return token.data;
  };

  useEffect(() => {
    registerForPushNotifications().then(setExpoPushToken);

    // Listen for notifications received while app is foregrounded
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // Listen for user tapping a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("Notification tapped:", data);
        // Navigate to the relevant screen based on data
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  return { expoPushToken, notification };
}
```

---

### 1.4 Registering the Token with Your Backend

After obtaining the token, send it to your API so the server can address notifications to this device:

```typescript
// In the app layout or after login
const { expoPushToken } = usePushNotifications();
const accessToken = useAuthStore((state) => state.accessToken);

useEffect(() => {
  if (!expoPushToken || !accessToken) return;

  apiClient.post("/api/users/push-token", { token: expoPushToken });
}, [expoPushToken, accessToken]);
```

Store the token in your backend:

```typescript
// Backend: schema.prisma
model PushToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  platform  String   // "ios" | "android"
  createdAt DateTime @default(now())
}
```

---

### 1.5 Sending Notifications from Your Backend

```typescript
// Backend: utils/pushNotifications.ts
interface PushMessage {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  badge?: number;
  priority?: "default" | "normal" | "high";
}

export const sendPushNotification = async (
  messages: PushMessage[],
): Promise<void> => {
  const response = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.EXPO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify(messages),
  });

  const result = await response.json();

  // Check for errors per-message
  if (result.data) {
    for (const item of result.data) {
      if (item.status === "error") {
        console.error("Push notification error:", item.message, item.details);
      }
    }
  }
};

// Usage — notify all users in a tenant when a new institution is created
const sendInstitutionCreatedNotification = async (
  tenantId: string,
  institutionName: string,
) => {
  const tokens = await prisma.pushToken.findMany({
    where: { user: { tenantId } },
    select: { token: true },
  });

  await sendPushNotification(
    tokens.map((t) => ({
      to: t.token,
      title: "New Institution",
      body: `${institutionName} has been added`,
      data: { screen: "institutions" },
      sound: "default",
    })),
  );
};
```

---

### 1.6 Deep Linking from Notifications

Handle notification taps to navigate the user to the relevant screen:

```tsx
// app/_layout.tsx
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Handle notification that opened the app from a terminated state
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response?.notification.request.content.data?.screen) {
        router.push(
          `/${response.notification.request.content.data.screen}` as never,
        );
      }
    });

    // Handle notification tap while app is running
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen) {
          router.push(`/${screen}` as never);
        }
      },
    );

    return () => subscription.remove();
  }, []);

  return <Stack />;
}
```

---

## 2. Local Notifications

Local notifications are scheduled by the app itself — no server required. Useful for reminders, daily digests, and offline alerts:

```typescript
// Schedule a notification 10 seconds from now
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Reminder",
    body: "Don't forget to check the latest institutions!",
    sound: "default",
    data: { screen: "institutions" },
  },
  trigger: {
    seconds: 10,
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
  },
});

// Schedule a daily notification at 9am
await Notifications.scheduleNotificationAsync({
  content: {
    title: "Daily Summary",
    body: "View today's updates",
  },
  trigger: {
    type: Notifications.SchedulableTriggerInputTypes.DAILY,
    hour: 9,
    minute: 0,
  },
});

// Cancel all scheduled notifications
await Notifications.cancelAllScheduledNotificationsAsync();

// List scheduled notifications
const scheduled = await Notifications.getAllScheduledNotificationsAsync();
```

---

## 3. Background Tasks

Background tasks run code when the app is not in the foreground. Expo provides two mechanisms: **Background Fetch** for periodic data sync and **Task Manager** for defining what runs in the background.

```bash
npx expo install expo-background-fetch expo-task-manager
```

---

### 3.1 Defining a Background Task

```typescript
// tasks/backgroundSync.ts
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import { institutionsApi } from "@/api/institutions";
import { institutionRepository } from "@/repositories/institutionRepository";

export const BACKGROUND_SYNC_TASK = "background-sync";

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    console.log("[BackgroundSync] Running...");

    const response = await institutionsApi.getAll({ pageSize: 100 });
    institutionRepository.insertMany(response.data);

    console.log(
      "[BackgroundSync] Synced",
      response.data.length,
      "institutions",
    );

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (err) {
    console.error("[BackgroundSync] Failed:", err);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});
```

---

### 3.2 Registering the Background Task

Register the task at app startup:

```typescript
// app/_layout.tsx
import { useEffect } from "react";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { BACKGROUND_SYNC_TASK } from "@/tasks/backgroundSync";

// Import to register the task definition
import "@/tasks/backgroundSync";

const registerBackgroundSync = async () => {
  const isRegistered =
    await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);

  if (!isRegistered) {
    await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
      minimumInterval: 15 * 60, // Minimum 15 minutes (iOS may enforce longer)
      stopOnTerminate: false, // Continue after user closes the app
      startOnBoot: true, // Register on device restart (Android)
    });
  }
};

useEffect(() => {
  registerBackgroundSync();
}, []);
```

> iOS enforces a minimum background fetch interval and may delay or skip runs based on battery and usage patterns. Background fetch is best-effort on both platforms.

---

### 3.3 Background Location (Advanced)

For apps that need continuous location tracking in the background:

```bash
npx expo install expo-location expo-task-manager
```

```typescript
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const LOCATION_TASK = "background-location";

TaskManager.defineTask(LOCATION_TASK, ({ data, error }) => {
  if (error) return;
  const { locations } = data as { locations: Location.LocationObject[] };
  // Process location updates
});

// Request background location permission (must ask for foreground first)
const { status: foreground } =
  await Location.requestForegroundPermissionsAsync();
if (foreground === "granted") {
  const { status: background } =
    await Location.requestBackgroundPermissionsAsync();
  if (background === "granted") {
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60000,
      distanceInterval: 50,
    });
  }
}
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

### Task 1 - Push Token Registration

Implement `usePushNotifications` and call it in the root layout after authentication. Log the Expo push token to the console and verify it is a valid `ExponentPushToken[...]` format.

---

### Task 2 - Store Token on Backend

Create a `POST /api/users/push-token` endpoint on your backend that saves the device's push token to a `PushToken` table. Call this endpoint from the app after login.

---

### Task 3 - Send a Test Notification

Use the [Expo Push Notification tool](https://expo.dev/notifications) (or the API directly from your backend) to send a test notification to your device's Expo push token. Verify it appears as an alert.

---

### Task 4 - Notification Deep Link

Configure `addNotificationResponseReceivedListener` to navigate to `/institutions` when a notification with `data: { screen: "institutions" }` is tapped.

---

### Task 5 - Local Reminder

Add a "Set Reminder" button to the Institutions screen that schedules a local notification for 30 seconds later with the message "Time to review your institutions!". Add a "Cancel Reminder" button that calls `cancelAllScheduledNotificationsAsync`.

---

### Task 6 - Background Sync

Implement `BACKGROUND_SYNC_TASK` and register it on app startup. Log the result of each background run. Verify the local SQLite database is updated after the task runs by querying it in the app.

---

## README

Update the `README.md` to document the push notification setup, how to obtain an Expo access token, and how the background sync works.
