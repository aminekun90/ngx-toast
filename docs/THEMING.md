# Theming

Both `@aminekun90/ngx-toast` (Angular) and `@aminekun90/react-toast` (React)
share the **same** stylesheet and theming model. Everything is driven by CSS
custom properties, so toasts are fully customizable.

There are three levels of customization, from simplest to most powerful:

1. [Built-in themes](#1-built-in-themes) — pick a ready-made look.
2. [CSS variables](#2-css-variables) — tweak any token globally or per scope.
3. [Custom themes](#3-custom-themes) — define your own reusable theme class.

---

## 1. Built-in themes

| Theme | Look |
|-|-|
| *(default)* | Soft tinted background with a colored left border. |
| `material` | Material elevation, bottom accent bar. |
| `glass` | Frosted glassmorphism (`backdrop-filter`). |
| `minimal` | Flat, compact, subtle shadow. |
| `neon` | Dark surface with a glowing accent. |
| `solid` | Accent-colored background, white text. |

### Per toast

```ts
// Angular
this.toast.success('Saved!', undefined, { theme: 'glass' });

// React
success('Saved!', undefined, { theme: 'glass' });
```

### Globally (wrapper class)

Add `ngx-toast-theme-<name>` to a wrapping element (e.g. `<body>`):

```html
<body class="ngx-toast-theme-material">…</body>
```

---

## 2. CSS variables

Override any token on `:root` (global) or on any ancestor / theme scope. These
are the public tokens (see `projects/core/styles/toast.styles.scss`):

| Variable | Default | Description |
|-|-|-|
| `--ngx-toast-radius` | `8px` | Corner radius. |
| `--ngx-toast-width` | `350px` | Toast width. |
| `--ngx-toast-gap` | `10px` | Gap between stacked toasts. |
| `--ngx-toast-offset` | `20px` | Distance from the screen edge. |
| `--ngx-toast-padding` | `12px 16px` | Inner padding. |
| `--ngx-toast-z-index` | `9999` | Stacking order. |
| `--ngx-toast-border-width` | `5px` | Accent border thickness. |
| `--ngx-toast-icon-size` | `20px` | Icon size. |
| `--ngx-toast-shadow` | `0 6px 20px …` | Box shadow. |
| `--ngx-toast-font` | system stack | Font family. |
| `--ngx-toast-close` / `--ngx-toast-close-hover` | greys | Close button color. |
| `--ngx-toast-progress-track` | `rgba(0,0,0,.1)` | Progress bar track. |
| `--ngx-toast-backdrop` | `none` | `backdrop-filter` value. |

### Per-type colors

Each type resolves three overridable variables. To recolor, for example, the
success type globally:

```css
:root {
  --ngx-toast-success-accent: #16a34a;
  --ngx-toast-success-bg: #f0fdf4;
  --ngx-toast-success-fg: #14532d;
}
```

Available per type (`success`, `error`, `warning`, `info`, `loading`):
`--ngx-toast-<type>-accent`, `--ngx-toast-<type>-bg`, `--ngx-toast-<type>-fg`.

### Example: brand restyle

```css
:root {
  --ngx-toast-radius: 12px;
  --ngx-toast-width: 380px;
  --ngx-toast-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  --ngx-toast-font: 'Inter', sans-serif;
}
```

---

## 3. Custom themes

A theme is just a class that sets variables. Define `.ngx-toast-theme-<name>`
targeting both the wrapper and the item (so it works per-toast and globally):

```css
.ngx-toast-theme-brand .toast-item,
.toast-item.ngx-toast-theme-brand {
  --ngx-toast-radius: 14px;
  --ngx-toast-border-width: 0;
  --ngx-toast-bg: #111827;
  --ngx-toast-fg: #f9fafb;
  --ngx-toast-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}
```

Then use it like any built-in theme:

```ts
success('On brand!', undefined, { theme: 'brand' });
```

---

## Dark mode

Dark mode is automatic via `prefers-color-scheme`. To force a scheme regardless
of the OS setting, add a class to a wrapper (e.g. `<body>` or `:root`):

- `.ngx-toast-dark` — force dark.
- `.ngx-toast-light` — force light. Overrides both automatic dark mode and
  `.ngx-toast-dark`, so it's what you toggle back to.

```ts
// Example: a light/dark toggle
document.documentElement.classList.toggle('ngx-toast-dark', isDark);
document.documentElement.classList.toggle('ngx-toast-light', !isDark);
```

## Reduced motion

Animations are automatically minimized when the user has
`prefers-reduced-motion: reduce` set (the loading spinner keeps spinning).
