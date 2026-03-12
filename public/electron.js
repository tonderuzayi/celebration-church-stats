const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, 'logo.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    backgroundColor: '#F5F7FA',
    show: false,
  });

  win.loadFile(path.join(__dirname, '../build/index.html'));
  win.once('ready-to-show', () => win.show());
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
```

4. Click **Commit changes**

---

### Fix 3 — Update `package.json` to point to the right electron file
1. Click **`package.json`** in your repo → click **pencil ✏️ to edit**
2. Find this line:
```
"main": "electron/main.js",
```
3. Change it to:
```
"main": "public/electron.js",
