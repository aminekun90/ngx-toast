# ngx-toast — Claude Context

## Project Overview
Yarn-workspaces monorepo shipping the **same toast core** as two published libraries:

- `@aminekun90/ngx-toast` — Angular 21+, zoneless-ready, built by ng-packagr
- `@aminekun90/react-toast` — React 18-19, built by Vite

Root package is `ngx-toast-workspace` (private), current version **1.2.0**.
**Yarn 4.12.0 via corepack** (`packageManager` field, `yarnPath` in `.yarnrc.yml`,
`nodeLinker: node-modules`). **Node `>=24.13.0`** — this is not a formality, the
workspace tooling assumes it.

## The one thing to understand first: `projects/core` is the source of truth

`projects/core/{src,styles}` holds the framework-agnostic toast logic. `sync-core.js`
**deletes and recopies** it into two places, prefixing every file with an
`AUTO-GENERATED … do not edit` header:

```
projects/core/src  ──sync-core.js──▶  projects/ngx-toast/src/lib/core/   (gitignored)
                                  └▶  projects/react-toast/src/core/     (gitignored)
```

**Both copies are gitignored and generated** (`.gitignore` lines 52-54), and neither is
tracked by git. Consequences:

- **Editing a file under `src/lib/core/` or `react-toast/src/core/` is always wrong** — the
  next install or build wipes it. Fix `projects/core/`, then `yarn sync:core`.
- On a fresh clone those folders **do not exist**. Nothing compiles until `yarn install`
  (whose `preinstall` runs the sync) or an explicit `yarn sync:core`. A "Cannot find
  module './core/…'" error means the sync has not run, not that the import is broken.

## Versioning: only the root `package.json`

`set-version.js` reads the root `version` and writes it into
`projects/{ngx-toast,react-toast}/package.json` **and** into their `current-version.ts`.
It runs on `preinstall` **and** `prebuild`, so a bump made in a library's own
`package.json` is silently reverted on the next build. Bump the root, nothing else.

## Traps

**`yarn build` is not a two-step build.** `prebuild` chains `set-version.js` then
`sync-core.js` before `build:ng` and `build:react`. Running `ng build` directly skips both
and can compile a stale core.

**Angular tests run in a real browser.** `test:ng` uses Vitest with `@vitest/browser`; CI
does `npx playwright install chromium --with-deps` first. Without a Chromium available,
the Angular suite fails for environment reasons, not code reasons.

**Publishing is manual and version-driven, not tag-driven.** `release-main.yml` is
`workflow_dispatch` only, with an optional `version` input (defaults to the root
`package.json`). It publishes **four artefacts**: the two libs to npmjs with
`--provenance --access public --ignore-scripts`, then the same two to GitHub Packages,
then creates the `vX.Y.Z` GitHub release, then deploys both demos to Pages
(`/ngx-toast/` and `/ngx-toast/react/`). `--ignore-scripts` matters — publishing must not
re-trigger `prebuild`.

**The Angular lib publishes from `dist/ngx-toast`, the React one from
`projects/react-toast`** — different source directories. Don't assume symmetry.

**`projects/demo-react`, not `demo-react/`.** The four workspaces all live under
`projects/*`: `core`, `ngx-toast`, `react-toast`, `demo-app`, `demo-react`.

**CI installs with `yarn install --immutable`.** A lockfile touched but not committed
fails the build. Always commit `yarn.lock` with a dependency change.

## Commands (all verified on Node 24.17 / yarn 4.12.0)
```bash
yarn build          # prebuild (set-version + sync-core) → ng-packagr → vite
                    #   ✔ Built @aminekun90/ngx-toast  (~690 ms)
                    #   ✓ built in ~1 s — react-toast.js 106 kB, umd 93 kB, css 10.8 kB
yarn test:ng        # 2 files, 7 tests, green (~580 ms)
yarn test:react     # 1 file, 2 tests, green (~460 ms)
yarn sync:core      # recopy core into both libs, nothing else
yarn start          # Angular demo (ng serve)
yarn start:react    # React demo (Vite)
yarn build:ng       # Angular lib only — runs sync-core first via prebuild:ng
yarn build:react    # React lib only — idem via prebuild:react
```

## Key Files
| File | Purpose |
|------|---------|
| `projects/core/` | **Canonical toast logic.** Edit here, only here |
| `sync-core.js` | Copies core into both libs; adds the do-not-edit header |
| `set-version.js` | Propagates the root version to both libs + `current-version.ts` |
| `angular.json` | ng-packagr build config |
| `.yarnrc.yml` | Pins yarn 4.12.0, `nodeLinker: node-modules` |
| `.github/workflows/test.yml` | PR gate — matrix OS × Node, installs Chromium |
| `.github/workflows/release-main.yml` | Manual release: npmjs + GitHub Packages + Pages |

## Angular library conventions
- **Zoneless-ready** — signals or `OnPush`, no `ChangeDetectorRef.markForCheck()`
- Output is APF in `dist/ngx-toast/`
- Export only through `public-api.ts`
- No `zone.js` dependency — must work zoned and zoneless
- `takeUntilDestroyed()` for subscriptions, never a manual unsubscribe
- FontAwesome via `@fortawesome/angular-fontawesome`, reuse the existing icon set

## React library conventions
- React 18/19; clean `useEffect` teardown, no legacy lifecycles
- `react` / `react-dom` are **peer** dependencies
- Strict TypeScript, every prop typed
- No inline `style={{}}` — CSS modules or the shared SCSS

## Monorepo rules
- Shared dev dependencies at the root, library-specific ones in the workspace
- `yarn workspace <name> <cmd>` — never `yarn add` from inside a workspace folder
- Commit `yarn.lock` with every dependency change (CI is `--immutable`)
