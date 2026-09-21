# PhishGuard AI - Web Application

A React-based cybersecurity dashboard and URL scanning interface powered by Vite and Tailwind CSS.

## Project Structure

```
mini project/
+-- index.html              # Vite entry HTML
+-- package.json            # Dependencies and scripts
+-- postcss.config.js       # PostCSS configuration
+-- tailwind.config.js      # Tailwind CSS styling and theme
+-- vite.config.js          # Vite build tool configuration
+-- src/
¦   +-- main.jsx            # React root mount
¦   +-- App.jsx             # Main routing and layout wrapper
¦   +-- index.css           # Tailwind directives and custom styles
¦   +-- components/         # Reusable UI components
¦   ¦   +-- Navbar.jsx      # Top navigation header
¦   ¦   +-- Sidebar.jsx     # Side navigation bar
¦   ¦   +-- StatCard.jsx    # Metric card display
¦   ¦   +-- ThreatBadge.jsx # Threat level indicator badge
¦   ¦   +-- URLInput.jsx    # Scan input component
¦   +-- context/            # React Context state management
¦   ¦   +-- ScanContext.jsx # Scan history and active state
¦   +-- data/               # Mock datasets and samples
¦   ¦   +-- dummyData.js    # Threats, stats, and historical scans
¦   +-- pages/              # Application views/routes
¦       +-- Analytics.jsx   # Metrics, charts, and analysis
¦       +-- Dashboard.jsx   # Overview dashboard
¦       +-- Login.jsx       # User authentication screen
¦       +-- ScanHistory.jsx # Logged scans and audits
¦       +-- URLScanner.jsx  # Interactive URL threat scanner
```

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```
