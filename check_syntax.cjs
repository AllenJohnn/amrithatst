const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

async function check() {
  const files = [];
  function getFiles(dir) {
    fs.readdirSync(dir).forEach(file => {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) getFiles(full);
      else if (full.endsWith('.jsx') || full.endsWith('.js')) files.push(full);
    });
  }
  getFiles('src');

  for (const file of files) {
    try {
      await esbuild.transform(fs.readFileSync(file, 'utf8'), { loader: 'jsx' });
    } catch (e) {
      console.error(`Syntax error in ${file}:`);
      console.error(e.message);
    }
  }
}
check();
