const fs = require('fs');
const path = require('path');

const replacements = {
  'bg-\\[#090909\\]': 'bg-cyber-black',
  'bg-\\[#0F0F0F\\]': 'bg-cyber-dark',
  'bg-\\[#141414\\]': 'bg-cyber-card',
  'bg-\\[#191919\\]': 'bg-cyber-cardHover',
  'bg-\\[#1A1A1A\\]': 'bg-cyber-cardHover',
  'bg-\\[#1E1E1E\\]': 'bg-cyber-cardActive',
  'border-\\[#1F1F1F\\]': 'border-cyber-border',
  'border-\\[#202020\\]': 'border-cyber-borderSubtle',
  'border-\\[#333\\]': 'border-cyber-borderSubtle',
  'text-\\[#F2F2F2\\]': 'text-cyber-white',
  'text-\\[#888888\\]': 'text-cyber-muted',
  'hover:bg-\\[#141414\\]': 'hover:bg-cyber-card',
  'hover:bg-\\[#1A1A1A\\]': 'hover:bg-cyber-cardHover',
  'hover:bg-\\[#222\\]': 'hover:bg-cyber-cardActive',
  'bg-\\[#111111\\]': 'bg-cyber-dark',
  'border-\\[#222222\\]': 'border-cyber-border',
};

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(key, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, value);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

walkDir(path.join(__dirname, 'src'));
console.log('Done.');
