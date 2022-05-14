const { app, BrowserWindow } = require('electron')

const width = 1080

let win

async function createWindow() {
    win = new BrowserWindow({
        width: width,
        minWidth: width,
        maxWidth: width,
        minHeight: 500,
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