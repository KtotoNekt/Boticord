const { ipcMain } = require('electron')
const prefix = require('../config.json').prefix

let channel = 0

module.exports.message = async (bot, win, message) => {
    if(message.channel.id !== channel) return

    win.webContents.send('message', message, message.author.avatarURL())
}

module.exports.onmessage = async () => {
    ipcMain.on('openchannel', (event, id) => channel = id)
}