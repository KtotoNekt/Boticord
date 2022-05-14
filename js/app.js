const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')
const Discord = require('discord.js')
const { send } = require('process')

let guildCanvas
let channelsCanvas
let messagesCanvas
let membersChannelCanvas
let inputUser

let openChannel

function windowOpen() {
    guildCanvas = document.querySelector("#guilds")
    channelsCanvas = document.querySelector('#channels')
    messagesCanvas = document.querySelector('#chat')
    membersChannelCanvas = document.querySelector('#channel-members')
    inputUser = document.querySelector("#input")

    global.bot.guilds.cache.forEach(guild => addGuildCanvas(guild))
    document.getElementById("author").style.visibility = "hidden"
    document.getElementById("main").style.visibility = "visible"

    inputUser.addEventListener("keydown", (e) => {
        if(e.code === "Enter") {
            sendMessage(openChannel)
            inputUser.value = ""
        }
    })
}

function parseMessage(message) {
    if(openChannel === message.channel.id) 
        addMessagesCanvas(message)
}

function removeElementsCanvas(id) {
    const elements = document.querySelectorAll(id)
    elements.forEach(element => element.remove())
}

function addGuildCanvas(guild) {
    const div = document.createElement("div")
    const img = document.createElement("img")
    
    img.src = guild.iconURL() ? guild.iconURL() : join('img', 'default.png')
    img.width = 50
    img.height = 50
    div.classList.add("guild")

    div.onclick = () => {
        removeElementsCanvas('.channel')
        const notHaveCategory = []
        const trash = []
        const categorys = []
        let i = 0
        
        guild.channels.cache.forEach(channel => {
            if(channel.parentId === null && channel.type !== "GUILD_CATEGORY") {
                notHaveCategory[i] = channel
            }
            else if(channel.type === "GUILD_CATEGORY") {
                categorys[i] = channel
            } else {
                trash[i] = channel
            }
            i += 1
        })

        const channels = notHaveCategory.concat(categorys.concat(trash))
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
        openChannel = e.target.id

        removeElementsCanvas('.message')
        removeElementsCanvas('.member')

        const ch = global.bot.channels.cache.get(e.target.id)
        ch.messages.fetch({limit: 100}).then(messages => {
            messages.reverse()
            messages.forEach(message => {
                addMessagesCanvas(message)
            })
        })

        const online = []
        const ofline = []
        let i = 0

        ch.members.forEach(member => {
            if(!member.presence) {
                ofline[i] = member
            } else {
                online[i] = member
            }

            i += 1
        })

        const members = online.concat(ofline)
        members.forEach(member => addMemberCanvas(member))
    }

    if(category)
        category.appendChild(p)
    else
        channelsCanvas.appendChild(p)
}

function addMessagesCanvas(message) {
    const div = document.createElement('div')
    const div2 = document.createElement('div')
    const content = document.createElement('span')
    const nick = document.createElement('span')
    const avatar = document.createElement('img')

    avatar.width = 40
    avatar.height = 40
    avatar.src = message.author.avatarURL() ? 
                 message.author.avatarURL() : 
                 join('..', "img", "default.png")
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

function addMemberCanvas(member) {
    const div = document.createElement('div')
    const nick = document.createElement('span')
    const avatar = document.createElement('img')
    const status = document.createElement('div')

    nick.textContent = member.displayName
    avatar.src = member.user.avatarURL() ? member.user.avatarURL() : join('img', 'default.png')
    avatar.classList.add('avatar')
    div.id = member.id
    div.classList.add('member')
    status.classList.add('status')
    status.classList.add(member.presence ? member.presence.status : "ofline")

    div.appendChild(avatar)
    div.appendChild(status)
    div.appendChild(nick)
    membersChannelCanvas.appendChild(div)
}

function sendMessage(id) {
    const message = inputUser.value
    global.bot.channels.cache.get(id).send(message)
}