const { app, BrowserWindow, ipcMain } = require('electron')
const { join } = require('path')

let win

async function createWindow() {
    const token = require('./client/config.json').token
    win = new BrowserWindow({
        width: 830,
        minWidth: 830,
        minHeight: 500,
        backgroundColor: "#444444",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    
    if(token) {
        require('./client/bot.js')(win)
    }
    else win.loadFile(join('html', "author.html"))
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if(process.platform !== "darwin") {
        app.quit()
    }
})

ipcMain.once("main", () => {
    win.loadFile(join("html", "index.html"))
    require('./client/bot.js')(win)
})