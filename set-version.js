const fs = require('node:fs');
const path = require('node:path');

// On prend la version du package.json à la racine comme source de vérité
const rootPkg = require('./package.json');
const version = rootPkg.version;

const projects = [
  {
    name: 'ngx-toast',
    versionFile: './projects/ngx-toast/src/lib/current-version.ts'
  },
  {
    name: 'react-toast',
    versionFile: './projects/react-toast/src/current-version.ts'
  }
];

projects.forEach(proj => {
  const pkgPath = path.join(__dirname, `./projects/${proj.name}/package.json`);
  
  if (fs.existsSync(pkgPath)) {
    // 1. Update package.json de la lib
    const projectPkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    projectPkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(projectPkg, null, 2) + '\n');

    // 2. Update current-version.ts
    const filePath = path.join(__dirname, proj.versionFile);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(filePath, `export const version = '${version}';\n`);
    console.log(`✅ ${proj.name} version set to ${version}`);
  }
});