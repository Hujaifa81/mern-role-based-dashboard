// This script ensures EJS templates are copied to the dist folder after TypeScript build.
// Usage: node copy-templates.js

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'app', 'utils', 'templates');
const destDir = path.join(__dirname, 'dist', 'app', 'utils', 'templates');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.ejs')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
    console.log(`Copied ${file} to dist.`);
  }
});
