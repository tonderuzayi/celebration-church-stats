# Celebration Church Stats — Build & Deploy Guide

## Quick Start (Web/Desktop Dev)

```bash
npm install
npm start          # Opens in browser on localhost:3000
npm run electron:dev   # Opens as desktop app
```

---

## 🚀 Option A — Auto Build via GitHub (RECOMMENDED, FREE, No Setup)

This is the easiest way to get all 3 installers without installing anything.

### Step 1 — Create a GitHub account
Go to https://github.com and sign up (free).

### Step 2 — Create a new repository
1. Click the **+** button → **New repository**
2. Name it: `celebration-church-stats`
3. Set to **Private**
4. Click **Create repository**

### Step 3 — Upload this project
1. On your new repo page, click **uploading an existing file**
2. Drag and drop ALL files from this ZIP (keep folder structure)
3. Click **Commit changes**

### Step 4 — Trigger a build
1. Go to **Actions** tab in your repository
2. Click **Build Installers** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait ~10-15 minutes

### Step 5 — Download your installers
1. Click the completed workflow run
2. Scroll to **Artifacts** at the bottom
3. Download:
   - `windows-installer` → contains `.exe`
   - `mac-installer` → contains `.dmg`
   - `android-apk` → contains `.apk`

> ✅ **GitHub gives you 2,000 free build minutes per month** — more than enough.

---

## 🖥️ Option B — Build Locally on Your Machine

### Windows .exe Installer

**Requirements:** Windows PC or laptop with Node.js installed  
Download Node.js from: https://nodejs.org (choose LTS version)

```bash
# Open Command Prompt or PowerShell in the project folder
npm install
npm run build:win
```
Output: `dist/Celebration-Church-Stats-Setup-1.0.0.exe`

---

### macOS .dmg Installer

**Requirements:** Mac computer (MacBook, iMac, Mac Mini)  
> ⚠️ Apple's rules require macOS to build macOS apps — cannot be done on Windows/Linux

```bash
# Open Terminal in the project folder
npm install
npm run build:mac
```
Output: `dist/Celebration-Church-Stats-1.0.0.dmg`

---

### Android .apk

**Requirements:** Any computer with Node.js + Expo account (free)

```bash
# Install Expo CLI
npm install -g @expo/cli eas-cli

# Login to Expo (create free account at expo.dev)
eas login

# Navigate to mobile folder
cd mobile
npm install

# Build APK (takes ~10-15 mins, builds in cloud)
eas build --platform android --profile preview

# Download link will appear in terminal when done
```

---

## 📁 Project Structure

```
celebration-church-stats/
├── src/
│   ├── App.js              # Main React application
│   └── index.js            # Entry point
├── public/
│   ├── index.html          # HTML template
│   └── logo.png            # Celebration logo
├── electron/
│   └── main.js             # Desktop app configuration
├── .github/
│   └── workflows/
│       └── build.yml       # Auto-build pipeline
├── package.json            # Dependencies & build config
└── README.md               # This file
```

---

## 👥 User Accounts (Demo)

| Email | Password | Role | Access |
|---|---|---|---|
| admin@celebrate.org | admin123 | Administrator | All branches + admin portal |
| grace@celebrate.org | pass123 | Data Capturer | Harare Central only |
| tendai@celebrate.org | pass123 | Data Capturer | Borrowdale only |
| blessing@celebrate.org | pass123 | Data Capturer | Chitungwiza only |

---

## 🔧 Customising Before Building

### Change the church name/branches
Edit `src/App.js`, find `const BRANCHES` and update:
```js
const BRANCHES = ["Your Branch 1", "Your Branch 2", "Your Branch 3"];
```

### Change admin password
Edit `src/App.js`, find `const USERS` and update the password fields.

### Change app version
Edit `package.json`, update the `"version"` field.

---

## 📞 Support
For build issues, contact your IT administrator or developer.
