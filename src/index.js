import {app, BrowserWindow, dialog, Menu} from 'electron';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let splash;

const showSplash = () => {
  splash = new BrowserWindow({
    width: 300,
    height: 300,
    transparent: false,
    frame: false,
    alwaysOnTop: true,
    backgroundColor: '#fff'
  });
  splash.loadURL(`file://${__dirname}/splash.html`);
};

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false
    },
    backgroundColor: '#fff'
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`http://payroll.anhoursolution.local:8888`);

  const contents = mainWindow.webContents;
  contents.on('did-fail-load', (event, errorCode, errorDescription) => {
    if (splash && splash.destroy) {
      splash.destroy();
    }
    const choice = dialog.showMessageBox(mainWindow, {
      type: 'error',
      buttons: ['Retry', 'Exit'],
      title: 'Ops, something nasty has happened!',
      message: 'Unable to connect to server! Check if your server is accessible!',
      defaultId: 0,
      cancelId: 1
    }, (index) => {
      if (index) {
        mainWindow.close();
      } else {
        mainWindow.reload();
      }
    });
  });

  // if main window is ready to show, then destroy the splash window and show up the main window
  mainWindow.once('ready-to-show', () => {
    setTimeout(() => {
      splash.destroy();
      splash = null;
    }, 2000);
    mainWindow.show();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    if (splash && splash.destroy) {
      splash.destroy();
    }
    splash = null;
    mainWindow = null;
  });
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  showSplash();
  Menu.setApplicationMenu(null);
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
