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

## Key Features

* ⚛️ **React 18 & 19 Ready**: Full support for Concurrent Mode and the latest React features.
* ⚓ **Hook-based API**: Simple and intuitive `useToast()` hook to trigger notifications.
* 🎨 **FontAwesome Integration**: Professional iconography baked-in.
* 🛠 **Customizable**: Full control over animations, progress bars, and multiple screen positions.
* 📦 **Zero-latency**: Extremely small bundle size, optimized with Vite.

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

## API Reference

| Method | Arguments | Description |
| --- | --- | --- |
| `success(message, title?)` | `string, string?` | Triggers a success notification (Green). |
| `error(message, title?)` | `string, string?` | Triggers an error notification (Red). |
| `warning(message, title?)` | `string, string?` | Triggers a warning notification (Yellow). |
| `info(message, title?)` | `string, string?` | Triggers an info notification (Blue). |
| `show(config)` | `ToastConfig` | Full control over the toast configuration. |

### ToastConfig Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `type` | `'success' \| 'error' \| 'warning' \| 'info'` | `'info'` | Visual theme and icon. |
| `title` | `string` | `undefined` | Optional bold heading. |
| `message` | `string` | `""` | Primary text content. |
| `duration` | `number` | `5000` | Time in ms (0 = persistent). |
| `progressBar` | `boolean` | `false` | Displays a countdown bar. |
| `position` | `ToastPosition` | `'top-right'` | Screen corner placement. |

## Compatibility

| Package | React Version | Node.js Version |
| --- | --- | --- |
| 1.0.x | ^18.0.0 \| ^19.0.0 | ^22.x \| ^24.x |

## Keep this project alive :coffee:

I dedicate time and effort to maintaining this library. If it helped you, please consider donating!

[Donate via PayPal](https://paypal.me/aminebouzahar)

## License

MIT License, By Amine Bouzahar.
