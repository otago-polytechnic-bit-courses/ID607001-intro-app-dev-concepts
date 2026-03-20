# Week 10 - Performance and UI/UX Design

## Navigation

|              | Link                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| Previous     | [Week 09 - API Integration, Bootstrap and Deployment](../week-09-api-integration-bootstrap-deployment/README.md) |
| Code Example | [Code Example](code-example)                                                                                     |
| Next         | [Week 11 - Component Testing and End-to-End Testing](../week-11-component-testing-end-to-end-testing/README.md)  |

---

## Before We Start

Open your repository in Visual Studio Code and switch to the Week 10 branch:

```bash
git checkout -b w10-performance-ui-ux-design
```

---

## 1. Performance

Performance in web applications refers to how quickly and efficiently a page loads, renders, and responds to user interactions. Poor performance increases bounce rates, reduces user satisfaction, and negatively affects search engine rankings.

---

### 1.1 Core Web Vitals

Google's Core Web Vitals are a set of real-world metrics that measure user experience:

| Metric  | Name                      | Measures            | Good Threshold |
| ------- | ------------------------- | ------------------- | -------------- |
| **LCP** | Largest Contentful Paint  | Loading performance | ≤ 2.5s         |
| **FID** | First Input Delay         | Interactivity       | ≤ 100ms        |
| **CLS** | Cumulative Layout Shift   | Visual stability    | ≤ 0.1          |
| **INP** | Interaction to Next Paint | Responsiveness      | ≤ 200ms        |

📖 Reference: [web.dev - Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)

---

### 1.2 Measuring Performance

**Chrome DevTools Lighthouse**

Lighthouse is built into Chrome DevTools and generates an automated performance audit. To run it:

1. Open Chrome DevTools (`F12`)
2. Navigate to the **Lighthouse** tab
3. Click **Analyse page load**

The report scores your page across Performance, Accessibility, Best Practices, and SEO.

**WebPageTest**

📖 Reference: [webpagetest.org](https://www.webpagetest.org)

---

### 1.3 Common Performance Bottlenecks

| Bottleneck                    | Description                                                |
| ----------------------------- | ---------------------------------------------------------- |
| **Large images**              | Unoptimised images are the most common cause of slow LCP   |
| **Render-blocking resources** | CSS and JS that prevent the browser from painting the page |
| **Excessive JavaScript**      | Large bundles delay time-to-interactive                    |
| **Too many HTTP requests**    | Each request adds latency, especially on mobile            |
| **No caching**                | Returning visitors re-download unchanged assets            |
| **Unoptimised fonts**         | Web fonts that block rendering                             |

---

## 2. Image Optimisation

Images often account for the largest share of page weight. Optimising them is one of the highest-impact performance improvements available.

---

### 2.1 Modern Image Formats

| Format   | Best For                      | Notes                                            |
| -------- | ----------------------------- | ------------------------------------------------ |
| **WebP** | Photos, illustrations         | 25–34% smaller than JPEG at equivalent quality   |
| **AVIF** | Photos                        | Even smaller than WebP; less browser support     |
| **SVG**  | Icons, logos, illustrations   | Infinitely scalable; ideal for vector graphics   |
| **JPEG** | Photographs                   | Wide support; avoid for images with transparency |
| **PNG**  | Images requiring transparency | Larger than WebP; use only when needed           |

Use the `<picture>` element to serve modern formats with fallbacks:

```html
<picture>
  <source srcset="image.avif" type="image/avif" />
  <source srcset="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Descriptive alt text" width="800" height="600" />
</picture>
```

---

### 2.2 Lazy Loading

Lazy loading defers the loading of off-screen images until they are about to enter the viewport. This reduces initial page weight and speeds up LCP.

```html
<img src="image.webp" alt="..." loading="lazy" width="800" height="600" />
```

> Always specify `width` and `height` attributes to prevent layout shift (CLS).

---

### 2.3 Responsive Images

Serve different image sizes to different screen sizes using the `srcset` and `sizes` attributes:

```html
<img
  src="image-800.webp"
  srcset="image-400.webp 400w, image-800.webp 800w, image-1200.webp 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 1000px) 800px, 1200px"
  alt="Descriptive alt text"
  loading="lazy"
/>
```

---

## 3. JavaScript Performance

---

### 3.1 Code Splitting

Code splitting divides your JavaScript bundle into smaller chunks that are loaded on demand. Vite and SvelteKit do this automatically at the route level - each page only loads the JavaScript it needs.

---

### 3.2 Tree Shaking

Tree shaking removes unused code from the final bundle at build time. Vite performs this automatically for ES modules. To benefit from it, always use named imports rather than importing entire libraries:

```javascript
// Good - only the used function is bundled
import { format } from "date-fns";

// Bad - the entire library is bundled
import dateFns from "date-fns";
```

---

### 3.3 Debouncing and Throttling

Debouncing and throttling limit how often expensive functions run in response to frequent events like scrolling or typing.

**Debounce** - delays execution until after a pause in events:

```javascript
let timer;
const debounce = (fn, delay) => {
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const handleSearch = debounce((value) => {
  // Only runs 300ms after the user stops typing
  fetchResults(value);
}, 300);
```

**Throttle** - ensures a function runs at most once per interval:

```javascript
let lastCall = 0;
const throttle = (fn, limit) => {
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};

const handleScroll = throttle(() => {
  // Runs at most once every 100ms
  updateScrollPosition();
}, 100);
```

---

## 4. SvelteKit Performance Features

---

### 4.1 Preloading

SvelteKit preloads page data when a user hovers over a link, making navigation feel instant:

```svelte
<a href="/dashboard" data-sveltekit-preload-data="hover">Dashboard</a>
```

This is enabled by default for all `<a>` tags inside a SvelteKit layout.

---

### 4.2 Static Generation

Pages that do not require server-side data can be pre-rendered to static HTML at build time, eliminating server response time entirely:

```javascript
// src/routes/about/+page.js
export const prerender = true;
```

---

### 4.3 Streaming

SvelteKit supports streaming data from `load` functions using `Promise`s, allowing the page shell to render immediately while slower data loads in the background:

```javascript
// +page.server.js
export const load = async () => {
  return {
    fastData: await getFastData(),
    slowData: getSlowData(), // Not awaited - streams in later
  };
};
```

---

## 5. UI/UX Design Principles

User Interface (UI) design concerns how an application looks. User Experience (UX) design concerns how it feels to use. Good design makes an application intuitive, accessible, and pleasant to use.

---

### 5.1 Core UX Principles

**Hierarchy**

Visual hierarchy guides the user's eye to the most important content first. Achieved through size, weight, colour, and spacing.

**Consistency**

Consistent patterns reduce the cognitive load on users. Buttons should always look like buttons. Navigation should always be in the same place.

**Feedback**

Every user action should produce a visible response. A button should change appearance when clicked. A form should confirm submission.

**Accessibility**

Design for all users, including those using assistive technologies. Provide sufficient colour contrast, keyboard navigation, and semantic HTML.

**Progressive Disclosure**

Show only what the user needs at each step. Reveal complexity progressively rather than all at once.

---

### 5.2 Colour

**Contrast**

Text must meet WCAG contrast requirements to be readable. The minimum ratio is 4.5:1 for normal text and 3:1 for large text.

📖 Reference: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Semantic Colour**

Use colour consistently to communicate meaning:

| Colour          | Meaning                           |
| --------------- | --------------------------------- |
| Green           | Success, confirmation             |
| Red             | Error, danger, destructive action |
| Yellow / Orange | Warning, caution                  |
| Blue            | Information, primary action       |
| Grey            | Disabled, secondary content       |

---

### 5.3 Typography

| Property        | Guideline                                             |
| --------------- | ----------------------------------------------------- |
| **Font size**   | Body text at least 16px; never go below 12px          |
| **Line height** | 1.4–1.6 for body text                                 |
| **Line length** | 45–75 characters per line for readability             |
| **Contrast**    | Dark text on light backgrounds or light text on dark  |
| **Hierarchy**   | Use size and weight to distinguish headings from body |

---

### 5.4 Spacing and Layout

Use a consistent spacing scale rather than arbitrary values. An 8px base unit is a common convention:

```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 16px;
  --space-4: 24px;
  --space-5: 32px;
  --space-6: 48px;
  --space-7: 64px;
}
```

**Whitespace** is not wasted space. Generous padding and margins improve readability and reduce cognitive load.

---

### 5.5 Responsive Design

Design for mobile screens first, then progressively enhance for larger screens (mobile-first):

```css
/* Mobile first */
.container {
  padding: 1rem;
}

/* Tablet and above */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 960px;
    margin: 0 auto;
  }
}

/* Desktop and above */
@media (min-width: 1200px) {
  .container {
    max-width: 1200px;
  }
}
```

---

## 6. Accessibility

Accessibility (a11y) ensures that applications are usable by people with disabilities, including those using screen readers, keyboard-only navigation, or other assistive technologies.

---

### 6.1 Semantic HTML

Use HTML elements for their intended purpose. Semantic elements convey meaning to assistive technologies automatically:

```html
<!-- Bad -->
<div class="button" onclick="submit()">Submit</div>

<!-- Good -->
<button type="submit">Submit</button>
```

---

### 6.2 ARIA

ARIA (Accessible Rich Internet Applications) attributes supplement semantic HTML when native elements are insufficient:

```html
<button aria-label="Close dialog" aria-expanded="false">×</button>

<div role="alert" aria-live="polite">Form submitted successfully.</div>
```

> Use ARIA only when semantic HTML alone is insufficient. Overuse of ARIA is worse than no ARIA.

---

### 6.3 Keyboard Navigation

All interactive elements must be reachable and operable via keyboard. Ensure:

- Focus order follows the visual layout
- Focus is always visible (never `outline: none` without a replacement)
- Modals trap focus while open and return it on close
- Custom components handle `Enter`, `Space`, and arrow keys as expected

---

### 6.4 Svelte Accessibility Warnings

Svelte's compiler includes built-in accessibility linting. Common warnings and their fixes:

| Warning                                       | Fix                                                             |
| --------------------------------------------- | --------------------------------------------------------------- |
| `a11y-missing-attribute`                      | Add `alt` to `<img>` elements                                   |
| `a11y-click-events-have-key-events`           | Add `onkeydown` alongside `onclick` on non-interactive elements |
| `a11y-no-noninteractive-element-interactions` | Use a `<button>` instead of a `<div>` for clickable elements    |
| `a11y-label-has-associated-control`           | Associate `<label>` with an input via `for`/`id`                |

---

## 7. Applying Performance and UX to SvelteKit

---

### 7.1 Loading States

Always provide feedback while data is loading:

```svelte
<script>
  let loading = $state(true);
  let data = $state(null);

  onMount(async () => {
    const res = await fetch('/api/data');
    data = await res.json();
    loading = false;
  });
</script>

{#if loading}
  <p aria-live="polite">Loading...</p>
{:else}
  <!-- Render data -->
{/if}
```

---

### 7.2 Error States

Always handle errors gracefully and communicate them clearly to the user:

```svelte
<script>
  let error = $state(null);
  let data = $state(null);
</script>

{#if error}
  <div role="alert" class="error">
    <p>Something went wrong: {error}</p>
    <button onclick={() => retry()}>Try again</button>
  </div>
{:else if data}
  <!-- Render data -->
{/if}
```

---

### 7.3 Empty States

Design explicitly for empty states - they are the first thing a new user sees:

```svelte
{#if items.length === 0}
  <div class="empty-state">
    <p>No items yet.</p>
    <a href="/new">Create your first item</a>
  </div>
{:else}
  <!-- Render items -->
{/if}
```

---

## Exercises

### AI Usage Guidelines

Acknowledge AI usage at the top of any AI-assisted file:

```javascript
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

### Task 1 - Lighthouse Audit

Run a Lighthouse audit on your Week 09 SvelteKit application (both the deployed Render URL and locally). In `week-10-performance-audit.md`, record:

1. Your scores for Performance, Accessibility, Best Practices, and SEO
2. The top three opportunities Lighthouse identified
3. Two changes you made and how they affected the scores

---

### Task 2 - Image Optimisation

In your SvelteKit application, replace at least one `<img>` element with a `<picture>` element that serves WebP with a JPEG fallback. Add `loading="lazy"` and explicit `width`/`height` attributes to all images.

---

### Task 3 - Loading and Error States

Update the dashboard from Week 09 to display:

1. A loading indicator while institutions are being fetched
2. A user-friendly error message if the fetch fails
3. An empty state with a helpful prompt when no institutions exist

---

### Task 4 - Accessibility Audit

Using the Accessibility tab in Chrome DevTools (or the axe DevTools browser extension), audit your Week 09 application. In `week-10-accessibility-audit.md`, record:

1. Any issues found and their WCAG success criteria
2. Two fixes you made and why

---

### Task 5 - Keyboard Navigation

Verify that every interactive element in your Week 09 dashboard is reachable and operable using only the keyboard (Tab, Shift+Tab, Enter, Space). Fix any elements that are not keyboard accessible.

---

### Task 6 - Responsive Design

Ensure your Week 09 dashboard is fully usable on a 375px-wide viewport (iPhone SE). Use Chrome DevTools' device toolbar to test. Fix any layout issues using Bootstrap's responsive grid or CSS media queries.

---

## Hard Exercises

---

### Hard Task 1 - Debounced Search

Add a search input to your institutions dashboard that filters the displayed results as the user types, using a debounced fetch call to avoid hammering the API on every keystroke. The debounce delay should be 300ms.

---

### Hard Task 2 - Skeleton Loading

Replace the plain "Loading..." text in Task 3 with a skeleton loading UI - placeholder shapes that match the layout of the content being loaded. Implement this using CSS animations rather than a library.

---

## README

Update the `README.md` in your repository to document any changes made this week, including performance improvements and accessibility fixes.
