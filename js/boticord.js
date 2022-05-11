const { ipcRenderer } = require('electron')
const { join } = require('path')
const guildCanvas = document.querySelector("#guilds")
const channelsCanvas = document.querySelector('#channels')
const messagesCanvas = document.querySelector('#chat')

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

function addCategoryCanvas(channel) {
    const div = document.createElement('div')
    const p = document.createElement('p')

    p.textContent = channel.name
    p.classList.add('category')
    div.id = channel.id
    div.classList.add('channel')

    div.appendChild(p)
    channelsCanvas.appendChild(div)
}

function addChannelCanvas(channel) {
    if(channel.type === "GUILD_CATEGORY") {
        addCategoryCanvas(channel)
        return
    }

    const category = document.getElementById(channel.parentId)
    const p = document.createElement('p')
    p.classList.add('channel')
    p.textContent = channel.name
    p.id = channel.id

    p.onclick = (e) => {
        removeElementsCanvas('.message')
        ipcRenderer.send('openchannel', e.target.id)
        ipcRenderer.send("messages", e.target.id)
    }

    if(category)
        category.appendChild(p)
    else
        channelsCanvas.appendChild(p)
}

function addMessagesCanvas(message, url) {
    const div = document.createElement('div')
    const div2 = document.createElement('div')
    const content = document.createElement('span')
    const nick = document.createElement('span')
    const avatar = document.createElement('img')

    avatar.width = 40
    avatar.height = 40
    avatar.src = url ? url : join('..', "img", "default.png")
    avatar.classList.add('avatar')
    div.id = message.author.id
    div.classList.add('message')
    div2.classList.add('author')
    nick.textContent = message.author.username
    nick.classList.add('nick')
    content.textContent = message.content
    content.classList.add('content')

    div2.appendChild(avatar)
    div2.appendChild(nick)
    div.appendChild(div2)
    div.appendChild(content)
    messagesCanvas.appendChild(div)

    messagesCanvas.scrollTop = messagesCanvas.scrollHeight
}

ipcRenderer.on('guild', (event, guild, guildIcon, channels) => addGuildCanvas(guild, guildIcon, channels))
ipcRenderer.on('message', (event, message, url) => addMessagesCanvas(message, url))