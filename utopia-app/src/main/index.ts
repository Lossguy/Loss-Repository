import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import express from 'express'  // Importing Express
import cors from 'cors'        // Importing CORS
import { MongoClient } from 'mongodb'  // Importing MongoDB
import dotenv from "dotenv";

dotenv.config();

const server = express()
const PORT = 3001


// Middleware for CORS and JSON handling
server.use(cors())
server.use(express.json())

// MongoDB connection setup
const MONGO_URI = process.env.MONGO_URI
// @ts-ignore
const client = new MongoClient(MONGO_URI)
let db;

// Establish MongoDB connection before starting the server
client.connect()
  .then(() => {
    db = client.db("Utopia");
    console.log("Connected to MongoDB");
    // Now start the server
    server.listen(3001, () => {
      console.log("Server running on http://localhost:3001");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });

// Express route to fetch data
server.get("/api/data", async (req, res) => {
  if (!db) {
    return res.status(500).json({ error: "Database not connected" });
  }

  try {
    const data = await db.collection("Races").find().toArray();
    res.json(data); // Send back the fetched data
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
