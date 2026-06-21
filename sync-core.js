/**
 * Syncs the canonical, framework-agnostic toast core into each library so both
 * build systems (ng-packagr and Vite) compile it as local source.
 *
 * Single source of truth: projects/core/{src,styles}. The copied folders are
 * generated artifacts (git-ignored) — never edit them by hand.
 */
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const CORE_SRC = path.join(ROOT, 'projects/core/src');
const CORE_STYLE = path.join(ROOT, 'projects/core/styles/toast.styles.scss');

const TARGETS = [
  path.join(ROOT, 'projects/ngx-toast/src/lib/core'),
  path.join(ROOT, 'projects/react-toast/src/core'),
];

const HEADER = '// AUTO-GENERATED from projects/core — do not edit. Run `node sync-core.js`.\n';

function syncTo(targetDir) {
  fs.rmSync(targetDir, { recursive: true, force: true });
  fs.mkdirSync(targetDir, { recursive: true });

  for (const file of fs.readdirSync(CORE_SRC)) {
    const content = fs.readFileSync(path.join(CORE_SRC, file), 'utf8');
    fs.writeFileSync(path.join(targetDir, file), HEADER + content);
  }

  fs.copyFileSync(CORE_STYLE, path.join(targetDir, 'toast.styles.scss'));
  console.log(`✅ core synced -> ${path.relative(ROOT, targetDir)}`);
}

TARGETS.forEach(syncTo);
