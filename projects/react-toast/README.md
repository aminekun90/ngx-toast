# @aminekun90/react-toast 🍞

A lightweight, high-performance, and **Hook-based** toast notification library for React 18 & 19.

[![React Version](https://img.shields.io/badge/react-%3E%3D18.0.0-blue.svg)](https://react.dev/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/aminekun90/ngx-toast/graphs/commit-activity)
[![version number](https://img.shields.io/npm/v/@aminekun90/react-toast?color=green&label=version)](https://www.npmjs.com/package/@aminekun90/react-toast)
[![License](https://img.shields.io/github/license/aminekun90/ngx-toast)](https://github.com/aminekun90/ngx-toast/blob/main/LICENSE)
![node-current](https://img.shields.io/node/v/@aminekun90/react-toast)
[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/@aminekun90/react-toast)

## Demo app

[View React Demo](https://aminekun90.github.io/ngx-toast/react/)

> Shares its core engine and stylesheet with the Angular library
> [`@aminekun90/ngx-toast`](https://www.npmjs.com/package/@aminekun90/ngx-toast) — identical behavior and themes.

## Key Features

* ⚛️ **React 18 & 19 Ready**: Full support for Concurrent Mode and the latest React features.
* ⚓ **Hook-based API**: Simple and intuitive `useToast()` hook to trigger notifications.
* 🎨 **FontAwesome Integration**: Professional iconography baked-in.
* ♿ **Accessible**: `role="alert"`, `aria-live`, keyboard dismissal (Enter/Space/Escape), focus styles.
* ⏸️ **Pause on hover**: Timer and progress bar pause while hovered/focused.
* 🌙 **Themes & dark mode**: 5 built-in themes, full CSS-variable customization, automatic dark mode.
* 🧩 **Global defaults**: Configure position, duration, max stack, dedup via `<ToastProvider config>`.
* 🔁 **Promise & loading toasts**: `loading()` and `promise()` helpers that swap in place.
* 📦 **Tiny**: Small bundle, optimized with Vite, zero extra runtime deps.

## Installation

Install the package via **Yarn**:

```bash
yarn add @aminekun90/react-toast
```

## Peer Dependencies

Ensure you have the following dependencies installed (required for icons and peer-matching):

```bash
yarn add @fortawesome/react-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

## Configuration

Wrap your application (or the desired part of your tree) with the `ToastProvider`.

```tsx
import { ToastProvider } from '@aminekun90/react-toast';

export function App() {
  return (
    <ToastProvider> <!-- Mandatory -->
      <MyMainComponent />
    </ToastProvider>
  );
}
```

## Usage

### 1. Add the Global Container

Place the `ToastContainer` at the root of your application (usually in `App.tsx`). It will manage the stacking of all active notifications.

```tsx
import { ToastContainer } from '@aminekun90/react-toast';

export default function App() {
  return (
    <div className="app-root">
      <ToastContainer />
      <MyContent />
    </div>
  );
}
```

### 2. Triggering Notifications

Use the `useToast` hook anywhere inside your `ToastProvider`.

```tsx
import { useToast } from '@aminekun90/react-toast';

export function MyComponent() {
  const { success, error, info, warning } = useToast();

  const handleAction = () => {
    success('Operation successful!', 'Success');
  };

  return <button onClick={handleAction}>Click me</button>;
}
```

### 3. Global defaults (optional)

```tsx
<ToastProvider config={{
  position: 'top-right',
  duration: 4000,
  pauseOnHover: true,
  maxToasts: 5,
  preventDuplicates: true,
  newestOnTop: true,
}}>
  <App />
</ToastProvider>
```

### 4. Loading & Promise toasts

```tsx
const { loading, success, promise } = useToast();

const id = loading('Uploading…');
// later: success('Done!', undefined, { id });

await promise(saveUser(), {
  loading: 'Saving…',
  success: (user) => `Saved ${user.name}`,
  error: (err) => `Failed: ${err}`,
});
```

## API Reference

| Method | Returns | Description |
|-|-|-|
| `show(config)` | `number` | Display a toast; returns its id. Reusing an `id` updates it in place. |
| `success/error/warning/info(message, title?, config?)` | `number` | Typed shortcuts. |
| `loading(message, title?, config?)` | `number` | Persistent loading toast. |
| `promise(promise, msgs, config?)` | `Promise<T>` | Loading → success/error, swapped in place. |
| `remove(id)` | `void` | Dismiss a single toast. |
| `clear(position?)` | `void` | Dismiss all toasts, optionally by position. |
| `pause(id)` / `resume(id)` | `void` | Pause/resume the auto-dismiss timer. |

### ToastConfig Properties

| Property | Type | Default | Description |
|-|-|-|-|
| `type` | `'success' \| 'error' \| 'warning' \| 'info' \| 'loading'` | `'info'` | Visual theme and icon. |
| `title` | `string` | `undefined` | Optional bold heading. |
| `message` | `string` | — | Primary text content. |
| `duration` | `number` | `5000` | Time in ms (`0` = persistent). |
| `position` | `ToastPosition` | `'bottom-right'` | Screen placement. |
| `progressBar` | `boolean` | `false` | Displays a countdown bar. |
| `progressAnimation` | `'increasing' \| 'decreasing'` | `'increasing'` | Bar direction. |
| `icon` | `IconDefinition` | by type | Custom FontAwesome icon. |
| `toastClass` | `string` | `''` | Extra CSS class. |
| `pauseOnHover` | `boolean` | `true` | Pause on hover/focus. |
| `theme` | `string` | `undefined` | `material` \| `glass` \| `minimal` \| `neon` \| `solid` or custom. |

## Theming

Five built-in themes, applied per toast or globally; everything is CSS-variable
driven for full customization.

```tsx
success('Saved!', undefined, { theme: 'glass' });
```

```html
<body class="ngx-toast-theme-material">…</body>
```

📖 Full reference: [docs/THEMING.md](https://github.com/aminekun90/ngx-toast/blob/main/docs/THEMING.md) ·
🏗️ [docs/ARCHITECTURE.md](https://github.com/aminekun90/ngx-toast/blob/main/docs/ARCHITECTURE.md)

## Compatibility

| Package | React Version | Node.js Version |
| --- | --- | --- |
| 1.0.x | ^18.0.0 \| ^19.0.0 | ^22.x \| ^24.x |

## Keep this project alive :coffee:

I dedicate time and effort to maintaining this library. If it helped you, please consider donating!

[Donate via PayPal](https://paypal.me/aminebouzahar)

## License

MIT License, By Amine Bouzahar.
