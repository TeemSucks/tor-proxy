const { app, BrowserWindow, Tray, Menu, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow;
let tray;
let socksProxyEnabled = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'assets', 'tray-icon.ico'),
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  tray = new Tray(path.join(__dirname, 'assets', 'tray-icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Toggle SOCKS Proxy',
      click: toggleSOCKSProxy,
    },
    {
      label: 'Quit',
      click: function () {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Status Bar App');
  tray.setContextMenu(contextMenu);

  tray.on('click', function () {
    console.log('idk AAAA');
  });
}

/*function toggleSOCKSProxy() {
  if (socksProxyEnabled) {
    exec('networksetup -setsocksfirewallproxystate Wi-Fi off', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error disabling SOCKS proxy: ${error}`);
        return;
      }
      console.log('SOCKS proxy disabled');
      socksProxyEnabled = false;
      updateContextMenu();
    });
  } else {
    exec('networksetup -setsocksfirewallproxy Wi-Fi 127.0.0.1 9150', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error enabling SOCKS proxy: ${error}`);
        return;
      }
      console.log('SOCKS proxy enabled');
      socksProxyEnabled = true;
      updateContextMenu();
    });
  }
}*/

function toggleSOCKSProxy() {
  if (socksProxyEnabled) {
    if (process.platform === 'win32') {
      exec('netsh winhttp reset proxy', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error disabling SOCKS proxy: ${error}`);
          return;
        }
        console.log('SOCKS proxy disabled');
        socksProxyEnabled = false;
        updateContextMenu();
      });
    } else {
      exec('networksetup -setsocksfirewallproxystate Wi-Fi off', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error disabling SOCKS proxy: ${error}`);
          return;
        }
        console.log('SOCKS proxy disabled');
        socksProxyEnabled = false;
        updateContextMenu();
      });
    }
  } else {
    if (process.platform === 'win32') {
      exec('netsh winhttp set proxy 127.0.0.1:9150', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error enabling SOCKS proxy: ${error}`);
          return;
        }
        console.log('SOCKS proxy enabled');
        socksProxyEnabled = true;
        updateContextMenu();
      });
    } else {
      exec('networksetup -setsocksfirewallproxy Wi-Fi 127.0.0.1 9150', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error enabling SOCKS proxy: ${error}`);
          return;
        }
        console.log('SOCKS proxy enabled');
        socksProxyEnabled = true;
        updateContextMenu();
      });
    }
  }
}

function updateContextMenu() {
  const toggleLabel = socksProxyEnabled ? 'Disable SOCKS Proxy' : 'Enable SOCKS Proxy';
  const contextMenu = Menu.buildFromTemplate([
    {
      label: toggleLabel,
      click: toggleSOCKSProxy,
    },
    /*{
      label: 'Open Dev Tools',
      click: () => mainWindow.webContents.openDevTools(),
    },*/
    {
      label: 'Quit',
      click: function () {
        app.quit();
      },
    },
  ]);
  tray.setContextMenu(contextMenu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});
