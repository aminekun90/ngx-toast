# Architecture

A Yarn 4 monorepo publishing two toast libraries that share one core.

```
ngx-toast/
├── projects/
│   ├── core/                 # 🧠 shared, framework-agnostic source (NOT published)
│   │   ├── src/
│   │   │   ├── types.ts      # types, DEFAULT_TOAST_CONFIG, TOAST_POSITIONS, icon names
│   │   │   ├── engine.ts     # ToastEngine<TIcon>: timers, dedup, pause/resume, max-stack
│   │   │   └── index.ts
│   │   └── styles/
│   │       └── toast.styles.scss   # the entire stylesheet + themes
│   │
│   ├── ngx-toast/            # 📦 @aminekun90/ngx-toast (Angular)
│   ├── react-toast/          # 📦 @aminekun90/react-toast (React)
│   ├── demo-app/             # Angular demo (ng serve)
│   └── demo-react/           # React demo (vite)
│
├── sync-core.js             # copies projects/core → each lib's local core/ (generated)
├── set-version.js           # propagates root version → both libs
└── run-demos.sh             # runs both demos with hot reload
```

## The shared core

The hard part of a toast library is not the rendering — it's the **state
machine**: id generation, auto-dismiss timers, pause/resume on hover, dedup,
max-stack enforcement, and exit animations. That logic lived twice (once per
framework) and drifted. It now lives once, in `projects/core`.

`ToastEngine<TIcon>` is generic over the icon representation:

- Angular uses a `[prefix, name]` tuple.
- React uses FontAwesome's `IconDefinition`.

Each framework binding is thin and owns *rendering only*:

| Concern | Angular | React |
|-|-|-|
| State sink | `signal<Toast[]>` | `useState<Toast[]>` |
| Config source | `NGX_TOAST_CONFIG` DI token | `<ToastProvider config>` |
| Engine emit target | `signal.set` | `setState` |

## Why sync instead of a published `@toast/core`?

`ng-packagr` cannot inline TypeScript imported from outside the library's own
directory (it throws `Cannot destructure property 'pos' of file.referencedFiles`).
Publishing a third package would force consumers to install an extra dependency
and complicate the SCSS resolution.

Instead, `sync-core.js` copies `projects/core` into each library as local source
(`projects/ngx-toast/src/lib/core/`, `projects/react-toast/src/core/`). These
folders are **git-ignored generated artifacts** with an `AUTO-GENERATED` header.
The script runs on `preinstall` and before every build, so:

- both bundlers see plain local files (zero special config),
- there is no extra runtime dependency for consumers,
- there is exactly one place to edit (`projects/core`).

```bash
yarn sync:core   # regenerate manually
```

## Styles

`toast.styles.scss` is the single source of truth, synced alongside the TS.
Each library's stylesheet is a one-liner:

```scss
@use "./core/toast.styles";
```

See [THEMING.md](./THEMING.md) for the CSS-variable model and built-in themes.

## Build & release

| Command | Effect |
|-|-|
| `yarn build` | sync + version + build both libs |
| `yarn build:ng` / `yarn build:react` | build one lib (auto-syncs first) |
| `yarn test:ng` / `yarn test:react` | run a lib's tests |
| `./run-demos.sh [angular\|react\|both]` | serve the demos |

Releases are driven by the root `package.json` version (`set-version.js`
propagates it). CI: `.github/workflows/test.yml` (build + test matrix),
`release-main.yml` (publish + GitHub Pages), and Dependabot keeps deps current.
