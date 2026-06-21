# @toast/core (internal shared core)

Framework-agnostic logic and styles shared by both published packages:

- [`@aminekun90/ngx-toast`](../ngx-toast) (Angular)
- [`@aminekun90/react-toast`](../react-toast) (React)

This package is **not published**. It is the single source of truth that gets
**synced** into each library at build time by [`sync-core.js`](../../sync-core.js),
so both build systems (ng-packagr and Vite) compile it as local source. The
synced folders (`projects/ngx-toast/src/lib/core/` and
`projects/react-toast/src/core/`) are git-ignored generated artifacts.

> Edit files here, never in the synced `core/` folders.

## Contents

| File | Responsibility |
|-|-|
| `src/types.ts` | Shared types (`ToastType`, `ToastPosition`, `ToastGlobalConfig`…), `DEFAULT_TOAST_CONFIG`, `TOAST_POSITIONS`, `DEFAULT_ICON_NAMES`. |
| `src/engine.ts` | `ToastEngine<TIcon>` — id generation, auto-dismiss timers, pause/resume, dedup, max-stack, exit animations. Framework-agnostic. |
| `styles/toast.styles.scss` | The entire stylesheet: positioning, animations, CSS-variable theming, dark mode, built-in themes. |

## Why a generic `ToastEngine<TIcon>`?

Angular represents icons as a `[prefix, name]` tuple; React uses FontAwesome's
`IconDefinition`. The engine is generic over the icon type so the same tested
state machine drives both. Each framework binding only owns *rendering*:

- **Angular** (`ToastService`) emits into a `signal`.
- **React** (`ToastProvider`) emits into `useState`.

## Regenerate the synced copies

```bash
yarn sync:core   # or: node ./sync-core.js
```

Runs automatically on `preinstall` and before every library build.
