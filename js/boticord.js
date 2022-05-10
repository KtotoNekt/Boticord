const { ipcRenderer } = require('electron')
const { join } = require('path')
const guildCanvas = document.querySelector("#guilds")
const channelsCanvas = document.querySelector('#channels')

function removeElementsCanvas(id) {
    const elements = document.querySelectorAll(id)
    elements.forEach(element => element.remove())
}

function addGuildCanvas(guild, icon, channels) {
    const div = document.createElement("div")
    const img = document.createElement("img")
    
    img.src = icon ? icon : join("..", 'img', 'default.png')
    img.width = 50
    img.height = 50
    div.classList.add("guild")

    div.onclick = () => {
        removeElementsCanvas('.channel')
        channels.forEach(channel => addChannelCanvas(channel))
    }

    div.appendChild(img)
    guildCanvas.appendChild(div)
}

function addChannelCanvas(channel) {
    console.log(channel.type)
    const p = document.createElement('p')
    p.classList.add('channel')
    p.textContent = channel.name

    channelsCanvas.appendChild(p)
}

ipcRenderer.on('guild', (event, guild, guildIcon, channels) => addGuildCanvas(guild, guildIcon, channels))