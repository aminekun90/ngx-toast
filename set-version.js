const fs = require('node:fs');
const path = require('node:path');

const pkg = require('./projects/ngx-toast/package.json');
const filePath = path.join(__dirname, './projects/ngx-toast/src/lib/current-version.ts');

fs.writeFileSync(filePath, `export const version = '${pkg.version}';\n`);
console.log(`✅ NGX_TOAST version set to ${pkg.version}`);