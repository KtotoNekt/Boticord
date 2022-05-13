const { app, BrowserWindow } = require('electron')

let win

async function createWindow() {
    win = new BrowserWindow({
        width: 830,
        minWidth: 830,
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