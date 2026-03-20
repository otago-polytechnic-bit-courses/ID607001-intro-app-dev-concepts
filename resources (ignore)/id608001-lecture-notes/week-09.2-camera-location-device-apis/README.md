# Week 09.2 - Camera, Location and Device APIs

## Navigation

|              | Link                                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 09.1 - Push Notifications and Background Tasks](../week-09.1-push-notifications-background-tasks/README.md)     |
| Code Example | [Code Example](code-example)                                                                                          |
| Next         | [Week 10.1 - Performance Optimisation and Lazy Loading](../week-10.1-performance-optimisation-lazy-loading/README.md) |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 09.2 branch:

```bash
git checkout -b w09.2-camera-location-device-apis
```

---

## 1. Permissions

All device APIs that access personal data require explicit user permission. Always check and request permissions before using any device API.

```bash
npx expo install expo-camera expo-image-picker expo-location expo-media-library expo-sensors expo-haptics expo-clipboard
```

**Permission best practices:**

- Request permission only when the user performs an action that needs it (contextual)
- Explain why you need the permission before the OS dialog appears
- Handle the denied case gracefully — never assume permission is granted
- On iOS, permission dialogs can only be shown once. If denied, direct the user to Settings

---

## 2. Camera

**Expo Camera** provides a camera preview component with support for photo capture, video recording, barcode scanning, and face detection.

---

### 2.1 Camera Component

```tsx
// components/CameraCapture.tsx
import { useRef, useState } from "react";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { View, Text, Pressable, StyleSheet, Alert, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onCapture: (uri: string) => void;
}

export function CameraCapture({ onCapture }: Props) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera access is required to take photos.
        </Text>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.8,
      base64: false,
      exif: false,
    });

    if (photo?.uri) {
      onCapture(photo.uri);
    }
  };

  const toggleFacing = () =>
    setFacing((current) => (current === "back" ? "front" : "back"));

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.controls}>
          <Pressable onPress={toggleFacing} style={styles.iconButton}>
            <Ionicons name="camera-reverse-outline" size={30} color="#fff" />
          </Pressable>

          <Pressable onPress={takePicture} style={styles.captureButton}>
            <View style={styles.captureInner} />
          </Pressable>

          <View style={styles.iconButton} />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 16,
  },
  permissionText: { fontSize: 16, textAlign: "center", color: "#374151" },
  controls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  iconButton: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
```

---

### 2.2 Image Picker (Gallery)

Use **Expo ImagePicker** to let users select an image from their photo library:

```typescript
// hooks/useImagePicker.ts
import * as ImagePicker from "expo-image-picker";
import { Alert, Platform } from "react-native";

interface PickedImage {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
}

export function useImagePicker() {
  const pickFromLibrary = async (): Promise<PickedImage | null> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant photo library access in Settings.",
        [{ text: "OK" }],
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return null;

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      mimeType: asset.mimeType ?? "image/jpeg",
    };
  };

  const pickFromCamera = async (): Promise<PickedImage | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant camera access in Settings.",
      );
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) return null;

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      mimeType: asset.mimeType ?? "image/jpeg",
    };
  };

  const showPickerOptions = (): Promise<PickedImage | null> => {
    return new Promise((resolve) => {
      Alert.alert("Upload Photo", "Choose a source", [
        { text: "Camera", onPress: () => pickFromCamera().then(resolve) },
        {
          text: "Photo Library",
          onPress: () => pickFromLibrary().then(resolve),
        },
        { text: "Cancel", style: "cancel", onPress: () => resolve(null) },
      ]);
    });
  };

  return { pickFromLibrary, pickFromCamera, showPickerOptions };
}
```

---

### 2.3 Uploading a Picked Image

```typescript
// Uploading a local file URI to your backend
const uploadImage = async (uri: string, mimeType: string): Promise<string> => {
  const formData = new FormData();

  formData.append("file", {
    uri,
    name: "upload.jpg",
    type: mimeType,
  } as unknown as Blob);

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/api/uploads/avatar`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    },
  );

  if (!response.ok) throw new Error("Upload failed");

  const data = await response.json();
  return data.data.avatarUrl;
};
```

---

## 3. Location

**Expo Location** provides GPS coordinates, reverse geocoding, and location tracking.

```bash
npx expo install expo-location
```

Add to `app.json`:

```json
{
  "expo": {
    "ios": {
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "We use your location to show nearby institutions."
      }
    },
    "android": {
      "permissions": ["ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"]
    }
  }
}
```

---

### 3.1 Getting the Current Location

```typescript
// hooks/useLocation.ts
import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface LocationState {
  coords: Location.LocationObjectCoords | null;
  address: Location.LocationGeocodedAddress | null;
  error: string | null;
  isLoading: boolean;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    address: null,
    error: null,
    isLoading: false,
  });

  const getLocation = async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: "Location permission denied",
      }));
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
      });

      const [address] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setState({
        coords: location.coords,
        address,
        error: null,
        isLoading: false,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: "Failed to get location",
      }));
    }
  };

  return { ...state, getLocation };
}
```

---

### 3.2 Map View

```bash
npx expo install react-native-maps
```

```tsx
// components/InstitutionMap.tsx
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { StyleSheet, View } from "react-native";

interface Institution {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface Props {
  institutions: Institution[];
  onMarkerPress: (id: string) => void;
}

export function InstitutionMap({ institutions, onMarkerPress }: Props) {
  if (institutions.length === 0) return null;

  const region = {
    latitude: institutions[0].latitude,
    longitude: institutions[0].longitude,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_DEFAULT}
      initialRegion={region}
      showsUserLocation
      showsMyLocationButton
    >
      {institutions.map((inst) => (
        <Marker
          key={inst.id}
          coordinate={{ latitude: inst.latitude, longitude: inst.longitude }}
          title={inst.name}
          onCalloutPress={() => onMarkerPress(inst.id)}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
});
```

---

## 4. Device APIs

---

### 4.1 Haptic Feedback

```typescript
import * as Haptics from "expo-haptics";

// Light tap for selection changes
await Haptics.selectionAsync();

// Success confirmation
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Warning
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

// Error shake
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

// Impact (button presses)
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
```

Use haptics to confirm destructive actions:

```tsx
const handleDelete = async () => {
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  Alert.alert("Delete Institution", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
        deleteInstitution(id);
      },
    },
  ]);
};
```

---

### 4.2 Clipboard

```typescript
import * as Clipboard from "expo-clipboard";

// Copy text
await Clipboard.setStringAsync("Text to copy");

// Read text
const text = await Clipboard.getStringAsync();

// Check if clipboard contains a string
const hasString = await Clipboard.hasStringAsync();
```

---

### 4.3 Device Information

```typescript
import * as Device from "expo-device";
import Constants from "expo-constants";

console.log(Device.modelName); // "iPhone 15 Pro"
console.log(Device.osName); // "iOS"
console.log(Device.osVersion); // "17.4"
console.log(Device.deviceType); // PHONE | TABLET | DESKTOP | TV | UNKNOWN
console.log(Device.isDevice); // false in simulator, true on device
console.log(Constants.appVersion); // "1.0.0" from app.json
```

---

### 4.4 Accelerometer / Sensors

```typescript
import { Accelerometer } from "expo-sensors";
import { useEffect, useState } from "react";

export function useShakeDetector(onShake: () => void, threshold = 2.5) {
  useEffect(() => {
    Accelerometer.setUpdateInterval(100);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalForce = Math.sqrt(x * x + y * y + z * z);
      if (totalForce > threshold) {
        onShake();
      }
    });

    return () => subscription.remove();
  }, [onShake, threshold]);
}
```

---

### 4.5 Share

```typescript
import { Share } from "react-native";

const shareInstitution = async (institution: Institution) => {
  await Share.share({
    title: institution.name,
    message: `Check out ${institution.name} in ${institution.region}, ${institution.country}`,
    url: `https://myapp.example.com/institutions/${institution.id}`,
  });
};
```

---

## 5. Barcode Scanner

Scan QR codes and barcodes using the camera:

```tsx
import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";

export function BarcodeScanner({ onScan }: { onScan: (data: string) => void }) {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <Pressable onPress={requestPermission}>
        <Text>Grant Camera Permission</Text>
      </Pressable>
    );
  }

  return (
    <CameraView
      style={{ flex: 1 }}
      barcodeScannerSettings={{
        barcodeTypes: ["qr", "ean13", "code128"],
      }}
      onBarcodeScanned={
        scanned
          ? undefined
          : ({ data }) => {
              setScanned(true);
              onScan(data);
              setTimeout(() => setScanned(false), 2000);
            }
      }
    />
  );
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

### Task 1 - Avatar Picker

Add an "Edit Avatar" button to the Profile screen that calls `useImagePicker().showPickerOptions()`. Display the picked image locally and upload it to the backend using the file upload endpoint from Week 05.1.

---

### Task 2 - Location Hook

Implement `useLocation`. Add a "Find My Location" button to a screen that shows the user's current city and country using `reverseGeocodeAsync`.

---

### Task 3 - Haptic Feedback

Add `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` to the create institution form submit button. Add `Haptics.notificationAsync(NotificationFeedbackType.Success)` after a successful creation and `NotificationFeedbackType.Error` after a failed one.

---

### Task 4 - Share Institution

Add a share button (using the `Ionicons` `share-outline` icon) to the institution detail screen that calls `Share.share` with the institution's name and a deep link URL.

---

### Task 5 - Barcode Scanner Screen

Create `app/scanner.tsx` that renders `BarcodeScanner`. When a QR code containing an institution ID is scanned, navigate to the institution detail screen. Add a button in the Institutions header to open the scanner.

---

### Task 6 - Clipboard Copy

Add a "Copy ID" button to the institution detail screen that copies the institution's UUID to the clipboard using `Clipboard.setStringAsync` and shows a brief `Haptics.notificationAsync(Success)` confirmation.

---

## README

Update the `README.md` to document the device API permissions required and how to configure them in `app.json`.
