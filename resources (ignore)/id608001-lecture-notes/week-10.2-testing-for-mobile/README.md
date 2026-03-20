# Week 10.2 - Testing for Mobile

## Navigation

|              | Link                                                                                                                  |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 10.1 - Performance Optimisation and Lazy Loading](../week-10.1-performance-optimisation-lazy-loading/README.md) |
| Code Example | [Code Example](code-example)                                                                                          |
| Next         | [Week 11.1 - CI/CD for Mobile](../week-11.1-ci-cd-for-mobile/README.md)                                               |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 10.2 branch:

```bash
git checkout -b w10.2-testing-for-mobile
```

---

## 1. Testing Strategy

| Type            | Tools                               | Scope                                  | Speed  |
| --------------- | ----------------------------------- | -------------------------------------- | ------ |
| **Unit**        | Jest                                | Individual functions, hooks, utilities | Fast   |
| **Component**   | Jest + React Native Testing Library | Component rendering and interactions   | Fast   |
| **Integration** | Jest + RNTL + MSW                   | Screens with mocked network            | Medium |
| **End-to-end**  | Maestro / Detox                     | Real app on simulator or device        | Slow   |

In this course we use **Jest** with **React Native Testing Library (RNTL)** for unit and component tests, and **Maestro** for E2E tests. This is the currently recommended testing stack for Expo apps.

---

## 2. Jest Setup

Expo projects ship with Jest pre-configured. Verify your setup:

```json
// package.json
{
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ],
    "setupFilesAfterFramework": ["@testing-library/jest-native/extend-expect"]
  }
}
```

Install testing dependencies:

```bash
npx expo install jest-expo @testing-library/react-native @testing-library/jest-native --save-dev
npm install --save-dev @types/jest
```

---

## 3. React Native Testing Library

**React Native Testing Library (RNTL)** renders components in a lightweight environment and provides queries for finding elements and utilities for firing events. The API mirrors Testing Library for web.

📖 Reference: [RNTL documentation](https://callstack.github.io/react-native-testing-library/)

---

### 3.1 Querying Elements

```tsx
import { render, screen } from "@testing-library/react-native";

render(<MyComponent />);

// By accessible text
screen.getByText("Submit");
screen.queryByText("Error message"); // Returns null if not found (no throw)
screen.findByText("Loaded data"); // Async - waits for element to appear

// By test ID (set with testID prop)
screen.getByTestId("submit-button");

// By accessibility label
screen.getByLabelText("Email address");

// By role
screen.getByRole("button", { name: "Submit" });

// By placeholder
screen.getByPlaceholderText("Enter email");
```

---

### 3.2 Firing Events

```tsx
import { render, screen, fireEvent } from "@testing-library/react-native";

// Tap a button
fireEvent.press(screen.getByText("Submit"));

// Type into an input
fireEvent.changeText(screen.getByPlaceholderText("Email"), "jane@example.com");

// Scroll a FlatList
fireEvent.scroll(screen.getByTestId("institution-list"), {
  nativeEvent: { contentOffset: { y: 500 } },
});
```

---

### 3.3 Async Utilities

```tsx
import { render, screen, waitFor, act } from "@testing-library/react-native";

// Wait for an element to appear
await waitFor(() => screen.getByText("Institution loaded"));

// Wait for an element to disappear
await waitFor(() => expect(screen.queryByText("Loading...")).toBeNull());

// Wrap async state updates
await act(async () => {
  fireEvent.press(screen.getByText("Submit"));
});
```

---

## 4. Unit Testing

---

### 4.1 Testing Utility Functions

```typescript
// utils/formatters.ts
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
};
```

```typescript
// __tests__/utils/formatters.test.ts
import { formatDate, truncate } from "@/utils/formatters";

describe("formatDate", () => {
  it("formats a date to a readable string", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("15 January 2024");
  });
});

describe("truncate", () => {
  it("returns the original string if within limit", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates and appends ellipsis", () => {
    expect(truncate("Hello World", 8)).toBe("Hello...");
  });

  it("handles exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});
```

---

### 4.2 Testing Custom Hooks

Use `renderHook` from RNTL to test custom hooks:

```typescript
// __tests__/hooks/useCounter.test.ts
import { renderHook, act } from "@testing-library/react-native";
import { useCounter } from "@/hooks/useCounter";

describe("useCounter", () => {
  it("starts at the initial value", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current.count).toBe(5);
  });

  it("increments correctly", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it("resets to the initial value", () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => result.current.increment());
    act(() => result.current.reset());
    expect(result.current.count).toBe(5);
  });
});
```

---

### 4.3 Testing Zustand Stores

```typescript
// __tests__/store/useInstitutionStore.test.ts
import { act } from "@testing-library/react-native";
import { useInstitutionStore } from "@/store/useInstitutionStore";

const institution = {
  id: "1",
  name: "Otago Polytechnic",
  region: "Otago",
  country: "New Zealand",
};

beforeEach(() => {
  useInstitutionStore.setState({ institutions: [], selectedId: null });
});

describe("useInstitutionStore", () => {
  it("adds an institution", () => {
    act(() => {
      useInstitutionStore.getState().addInstitution(institution);
    });
    expect(useInstitutionStore.getState().institutions).toHaveLength(1);
    expect(useInstitutionStore.getState().institutions[0].name).toBe(
      "Otago Polytechnic",
    );
  });

  it("removes an institution by id", () => {
    act(() => {
      useInstitutionStore.getState().addInstitution(institution);
      useInstitutionStore.getState().removeInstitution("1");
    });
    expect(useInstitutionStore.getState().institutions).toHaveLength(0);
  });

  it("updates an institution", () => {
    act(() => {
      useInstitutionStore.getState().addInstitution(institution);
      useInstitutionStore
        .getState()
        .updateInstitution("1", { name: "Updated Name" });
    });
    expect(useInstitutionStore.getState().institutions[0].name).toBe(
      "Updated Name",
    );
  });
});
```

---

## 5. Component Testing

---

### 5.1 Testing a Button Component

```tsx
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders the label", () => {
    render(<Button label="Submit" onPress={() => {}} />);
    expect(screen.getByText("Submit")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPress = jest.fn();
    render(<Button label="Submit" onPress={onPress} />);
    fireEvent.press(screen.getByText("Submit"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does not call onPress when disabled", () => {
    const onPress = jest.fn();
    render(<Button label="Submit" onPress={onPress} disabled />);
    fireEvent.press(screen.getByText("Submit"));
    expect(onPress).not.toHaveBeenCalled();
  });

  it("shows ActivityIndicator when loading", () => {
    render(<Button label="Submit" onPress={() => {}} loading />);
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
    expect(screen.queryByText("Submit")).toBeNull();
  });
});
```

---

### 5.2 Testing a Form

```tsx
// __tests__/components/CreateInstitutionForm.test.tsx
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { CreateInstitutionForm } from "@/components/CreateInstitutionForm";

describe("CreateInstitutionForm", () => {
  it("shows validation errors when submitted empty", async () => {
    render(<CreateInstitutionForm onSubmit={jest.fn()} />);

    fireEvent.press(screen.getByText("Create Institution"));

    await waitFor(() => {
      expect(screen.getByText("Name is required")).toBeTruthy();
    });
  });

  it("calls onSubmit with form values when valid", async () => {
    const onSubmit = jest.fn();
    render(<CreateInstitutionForm onSubmit={onSubmit} />);

    fireEvent.changeText(
      screen.getByPlaceholderText("Institution name"),
      "Otago Polytechnic",
    );
    fireEvent.changeText(screen.getByPlaceholderText("Region"), "Otago");

    fireEvent.press(screen.getByText("Create Institution"));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Otago Polytechnic", region: "Otago" }),
      );
    });
  });
});
```

---

## 6. Mocking

---

### 6.1 Mocking Expo Modules

Create `__mocks__/expo-router.ts`:

```typescript
// __mocks__/expo-router.ts
export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
});

export const useLocalSearchParams = () => ({ id: "test-id" });

export const Link = ({ children }: { children: React.ReactNode }) => children;
export const Stack = { Screen: () => null };
```

---

### 6.2 Mocking API Calls with MSW

**Mock Service Worker (MSW)** intercepts network requests at the fetch level, making integration tests realistic:

```bash
npm install msw --save-dev
```

```typescript
// __tests__/mocks/handlers.ts
import { http, HttpResponse } from "msw";

const institutions = [
  {
    id: "1",
    name: "Otago Polytechnic",
    region: "Otago",
    country: "New Zealand",
  },
  { id: "2", name: "AUT", region: "Auckland", country: "New Zealand" },
];

export const handlers = [
  http.get("*/api/v2/institutions", () =>
    HttpResponse.json({
      data: institutions,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 2,
        totalPages: 1,
        nextPage: null,
        prevPage: null,
      },
    }),
  ),

  http.post("*/api/v2/institutions", async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    return HttpResponse.json(
      {
        message: "Institution successfully created",
        data: [{ id: "3", ...body }],
      },
      { status: 201 },
    );
  }),

  http.delete("*/api/v2/institutions/:id", ({ params }) =>
    HttpResponse.json({
      message: `Institution with the id: ${params.id} successfully deleted`,
    }),
  ),
];
```

```typescript
// __tests__/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);
```

```typescript
// jest.setup.ts
import { server } from "./__tests__/mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

### 6.3 Integration Test with TanStack Query

```tsx
// __tests__/screens/InstitutionsScreen.test.tsx
import { render, screen, waitFor } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { InstitutionsScreen } from "@/screens/InstitutionsScreen";
import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("InstitutionsScreen", () => {
  it("shows a loading indicator initially", () => {
    render(<InstitutionsScreen />, { wrapper: createWrapper() });
    expect(screen.getByTestId("loading-indicator")).toBeTruthy();
  });

  it("shows institutions after loading", async () => {
    render(<InstitutionsScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText("Otago Polytechnic")).toBeTruthy();
      expect(screen.getByText("AUT")).toBeTruthy();
    });
  });

  it("shows an error when the request fails", async () => {
    server.use(
      http.get("*/api/v2/institutions", () =>
        HttpResponse.json({ message: "Server error" }, { status: 500 }),
      ),
    );

    render(<InstitutionsScreen />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeTruthy();
    });
  });
});
```

---

## 7. Maestro E2E Testing

**Maestro** is a mobile E2E testing framework that uses a simple YAML syntax and runs flows on real simulators and devices. It requires no code changes to the app.

```bash
curl -Ls "https://get.maestro.mobile.dev" | bash
```

📖 Reference: [Maestro documentation](https://maestro.mobile.dev)

---

### 7.1 Writing a Flow

```yaml
# flows/login.yaml
appId: com.example.myapp
---
- launchApp
- assertVisible: "Welcome back"
- tapOn: "Email"
- inputText: "jane.doe@example.com"
- tapOn: "Password"
- inputText: "janedoe123"
- tapOn: "Sign In"
- assertVisible: "Institutions"
```

```yaml
# flows/create-institution.yaml
appId: com.example.myapp
---
- launchApp
- runFlow: login.yaml
- tapOn:
    id: "add-button"
- assertVisible: "New Institution"
- tapOn:
    placeholder: "Institution name"
- inputText: "Otago Polytechnic"
- tapOn:
    placeholder: "Region"
- inputText: "Otago"
- tapOn: "Create Institution"
- assertVisible: "Institution successfully created"
- assertVisible: "Otago Polytechnic"
```

---

### 7.2 Running Flows

```bash
# Run a single flow
maestro test flows/login.yaml

# Run all flows in a directory
maestro test flows/

# Run on a specific device
maestro test --device "iPhone 15 Pro" flows/login.yaml
```

---

### 7.3 Test Scripts

```json
"scripts": {
  "test": "jest --watchAll",
  "test:ci": "jest --ci --coverage",
  "test:e2e": "maestro test flows/",
  "test:e2e:login": "maestro test flows/login.yaml"
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

### Task 1 - Utility Tests

Write unit tests for at least two utility functions (e.g. `truncate`, `formatDate`, `buildQuery`). Achieve 100% branch coverage for each function.

---

### Task 2 - Store Tests

Write tests for `useInstitutionStore` covering: adding, updating, removing, and setting the selected ID. Reset the store state in `beforeEach`.

---

### Task 3 - Button Component Tests

Write tests for `Button` covering: renders label, calls `onPress` on press, does not call `onPress` when `disabled`, and shows an `ActivityIndicator` when `loading` is true.

---

### Task 4 - Form Tests

Write tests for `CreateInstitutionForm` covering: validation errors on empty submit, validation error for name shorter than 3 characters, and calling `onSubmit` with correct values when valid.

---

### Task 5 - MSW Integration Test

Set up MSW in your test environment. Write an integration test for the Institutions screen that: shows a loading indicator, shows institution names after loading, and shows an error message when the API returns 500.

---

### Task 6 - Maestro E2E Flow

Write Maestro flows for: login, viewing the institution list, creating a new institution, and logging out. Run the flows against a simulator and attach a screenshot to a `week-10-2-e2e-results.md` file.

---

## README

Update the `README.md` to document how to run unit tests, integration tests, and E2E flows, and what coverage thresholds are configured.
