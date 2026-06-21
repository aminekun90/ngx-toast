# ngx-toast 🍞

A lightweight, high-performance, and **Zoneless-ready** toast notification library for Angular 20+.

[![Angular Version](https://img.shields.io/badge/angular-%3E%3D20.3.13-red.svg)](https://angular.dev/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/aminekun90/ngx-toast/graphs/commit-activity)
[![version number](https://img.shields.io/npm/v/ngx-toast?color=green&label=version)](https://github.com/aminekun90/ngx-toast/releases)
[![Actions Status](https://github.com/aminekun90/ngx-toast/workflows/Test/badge.svg)](https://github.com/aminekun90/ngx-toast/actions)
[![License](https://img.shields.io/github/license/aminekun90/ngx-toast)](https://github.com/aminekun90/ngx-toast/blob/main/LICENSE)
![node-current](https://img.shields.io/node/v/ngx-toast)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@aminekun90/ngx-toast)](https://socket.dev/npm/package/@aminekun90/ngx-toast)
[![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/package/@aminekun90/ngx-toast)

## Demo app and usage

[View Demo](https://aminekun90.github.io/ngx-toast/)

## Key Features

* ⚡ **Angular 20+ Optimized**: Fully supports `provideZonelessChangeDetection()`.
* 📡 **Signal-based**: Built with Angular Signals for reactive and efficient state management.
* 🎨 **FontAwesome Integration**: Built-in support for professional iconography.
* 🛠 **Customizable**: Easy control over duration, progress bars, and screen positions.
* ♿ **Accessible**: `role="alert"`, `aria-live`, keyboard dismissal (Enter/Space/Escape) and focus styles out of the box.
* ⏸️ **Pause on hover**: Auto-dismiss timer and progress bar pause while the toast is hovered or focused.
* 🌙 **Theming & dark mode**: Restyle everything through CSS variables; automatic `prefers-color-scheme` support plus an opt-in `.ngx-toast-dark` class.
* 🧩 **Global defaults**: Configure position, duration, max stack, dedup and more via `provideToast()`.
* 🔁 **Promise & loading toasts**: First-class `loading()` and `promise()` helpers that swap in place.
* 🪶 **Zero runtime deps**: No RxJS — purely signal-driven.

---

## Installation

Install the package via **Yarn**:

```bash
yarn add ngx-toast
```

## Peer Dependencies

Since the library uses FontAwesome for its visual components, ensure the following are installed in your project:

```bash
yarn add @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
```

---

## Configuration

Add the necessary providers to your app.config.ts (or config.ts). It is highly recommended to use provideAnimationsAsync() for smooth transitions.

```ts
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    {
      provide: 'INITIALIZE_FA',
      useFactory: (library: FaIconLibrary) => library.addIconPacks(fas),
      deps: [FaIconLibrary]
    }
  ]
};
```

---

## Usage

### 1. Add the Global Container

Place the ngx-toast-container in your root component (app.ts or app.component.html). This container will handle the stacking and positioning of all active toasts.

```ts
import { ToastContainerComponent } from 'ngx-toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ToastContainerComponent],
  template: `
    <router-outlet></router-outlet>
    <ngx-toast></ngx-toast>
  `
})
export class App {}

```

### 2. Triggering Notifications

```ts

import { Component, inject } from '@angular/core';
import { ToastService } from 'ngx-toast';

@Component({ ... })
export class MyComponent {
  private toastService = inject(ToastService);

  showSuccess() {
    this.toastService.show({
      type: 'success',
      title: 'Success!',
      message: 'The operation was completed successfully.',
      duration: 3000,
      progressBar: true,
      position: 'bottom-right'
    });
  }
}
```

### 3. Global Defaults (optional)

Set app-wide defaults with `provideToast()`. Any value can still be overridden per call.

```ts
import { provideToast } from 'ngx-toast';

export const appConfig: ApplicationConfig = {
  providers: [
    provideToast({
      position: 'top-right',
      duration: 4000,
      pauseOnHover: true,
      maxToasts: 5,
      preventDuplicates: true,
      newestOnTop: true,
    }),
  ],
};
```

### 4. Loading & Promise toasts

```ts
const id = this.toastService.loading('Uploading…');
// later: this.toastService.success('Done!', undefined, { id });

await this.toastService.promise(saveUser(), {
  loading: 'Saving…',
  success: (user) => `Saved ${user.name}`,
  error: (err) => `Failed: ${err}`,
});
```

## Service Methods

| Method | Returns | Description |
|-|-|-|
| `show(config)` | `number` | Display a toast; returns its id. Reusing an `id` updates that toast in place. |
| `success/error/warning/info(message, title?, config?)` | `number` | Typed shortcuts. |
| `loading(message, title?, config?)` | `number` | Persistent loading toast (no auto-dismiss). |
| `promise(promise, msgs, config?)` | `Promise<T>` | Shows loading, then swaps to success/error in place. |
| `remove(id)` | `void` | Dismiss a single toast (with exit animation). |
| `clear(position?)` | `void` | Dismiss all toasts, optionally filtered by position. |
| `pause(id)` / `resume(id)` | `void` | Manually pause/resume the auto-dismiss timer. |

## Config Reference

| Property | Type | Default | Description |
|-|-|-|-|
| type | 'success' \| 'error' \| 'warning' \| 'info' \| 'loading' | 'info' | Visual theme and default icon. |
| title | string | undefined | Optional bold heading above the message. |
| message | string | — | Primary text content. |
| duration | number | 5000 | ms before auto-close (`0` = persistent). |
| position | ToastPosition | 'bottom-right' | One of the six corners/centers. |
| progressBar | boolean | false | Show a visual countdown bar. |
| progressAnimation | 'increasing' \| 'decreasing' | 'increasing' | Progress bar fill direction. |
| icon | [IconPrefix, IconName] | by type | Custom FontAwesome icon. |
| toastClass | string | '' | Extra CSS class on the toast item. |
| pauseOnHover | boolean | true | Pause timer/progress on hover/focus. |
| theme | string | undefined | Built-in theme (`material` \| `glass` \| `minimal` \| `neon` \| `solid`) or a custom one. |

### Global-only options (`provideToast`)

| Property | Default | Description |
|-|-|-|
| maxToasts | 0 | Max simultaneous toasts (`0` = unlimited). |
| preventDuplicates | false | Refresh an identical toast instead of stacking. |
| newestOnTop | false | Insert new toasts at the top of the stack. |

## Theming

Five built-in themes — `material`, `glass`, `minimal`, `neon`, `solid` — applied
per toast or globally:

```ts
this.toastService.success('Saved!', undefined, { theme: 'glass' });
```

```html
<!-- or globally on a wrapper -->
<body class="ngx-toast-theme-material">…</body>
```

Everything is CSS-variable driven, so you can fully restyle or define your own
theme. Override tokens anywhere, or toggle dark mode with `.ngx-toast-dark`:

```css
:root {
  --ngx-toast-radius: 12px;
  --ngx-toast-width: 380px;
  --ngx-toast-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
```

📖 Full reference: [docs/THEMING.md](https://github.com/aminekun90/ngx-toast/blob/main/docs/THEMING.md) ·
🏗️ [docs/ARCHITECTURE.md](https://github.com/aminekun90/ngx-toast/blob/main/docs/ARCHITECTURE.md)

## Compatibility

| ngx-toast | Angular Version | Node.js Version | Change Detection   |
|-----------|-----------------|-----------------|--------------------|
| 1.2.x     | ^21.2.0         | ^22.x \| ^24.x  | Zoneless & Zone.js |
| 1.0.x     | ^21.2.0         | ^22.x \| ^24.x  | Zoneless & Zone.js |

This library is built with Angular 21 and above.
Node 24.13.0 or higher is required.

## Keep this project alive :coffee:

I dedicate time and effort on writing and maintaining this library and if it helped you and saved you time, please consider Donating!

I'm grateful for your support.

[Donate via PayPal](paypal.me/aminebouzahar)

[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://www.paypal.com/paypalme/aminebouzahar)

## Licence

MIT License, By Amine Bouzahar.
