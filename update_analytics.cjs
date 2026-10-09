const fs = require('fs');
let c = fs.readFileSync('src/pages/Analytics.jsx', 'utf8');

c = c.replace(/color: '#9ca3af'/g, "color: 'var(--color-text-muted)'");
c = c.replace(/color: '#E5E5E5'/g, "color: 'var(--color-text-primary)'");
c = c.replace(/color: '#6b7280'/g, "color: 'var(--color-text-dim)'");
c = c.replace(/color: '#333'/g, "color: 'var(--color-border)'");
c = c.replace(/color: '#1f1f1f'/g, "color: 'var(--color-border)'");
c = c.replace(/color: '#fff'/g, "color: 'var(--color-text-primary)'");
c = c.replace(/backgroundColor: '#111111'/g, "backgroundColor: 'var(--color-surface-2)'");
c = c.replace(/borderColor: '#222222'/g, "borderColor: 'var(--color-border)'");
c = c.replace(/borderColor: '#0F0F0F'/g, "borderColor: 'var(--color-surface-1)'");
c = c.replace(/backgroundColor: '#1A1A1A'/g, "backgroundColor: 'var(--color-surface-3)'");

fs.writeFileSync('src/pages/Analytics.jsx', c);
console.log('Analytics.jsx updated');
