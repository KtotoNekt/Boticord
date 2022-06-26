const { app, BrowserWindow } = require('electron')
const { join } = require("path")

const width = 1080

let win

async function createWindow() {
    win = new BrowserWindow({
        width: width,
        minWidth: width,
        maxWidth: width,
        minHeight: 500,
        icon: join(__dirname, "img", "icon.png"),
        backgroundColor: "#444444",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })
    
    win.loadFile("index.html")
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if(process.platform !== "darwin") {
        app.quit()
    }
})