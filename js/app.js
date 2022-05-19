const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')
const Discord = require('discord.js')

let guildCanvas
let channelsCanvas
let messagesCanvas
let membersChannelCanvas
let inputUser

let openChannel
let openDMChannel = false

function windowOpen() {
    guildCanvas = document.querySelector("#guilds")
    channelsCanvas = document.querySelector('#channels')
    messagesCanvas = document.querySelector('#chat')
    membersChannelCanvas = document.querySelector('#channel-members')
    inputUser = document.querySelector("#input")

    global.bot.guilds.cache.forEach(guild => addGuildCanvas(guild))
    document.getElementById("author").style.visibility = "hidden"
    document.getElementById("main").style.visibility = "visible"

    document.getElementById('dmchannels').onclick = () => {
        removeElementsCanvas('.channel')
        selectDmChannels()
    }

    inputUser.addEventListener("keydown", (e) => {
        if(e.code === "Enter") {
            if(openChannel)
                sendMessage(openChannel)

            inputUser.value = ""
        }
    })
}

function removeElementsCanvas(id) {
    const elements = document.querySelectorAll(id)
    elements.forEach(element => element.remove())
}

function addGuildCanvas(guild) {
    const div = document.createElement("div")
    const img = document.createElement("img")
    
    img.src = guild.iconURL() ? guild.iconURL() : join('img', 'default.png')
    div.classList.add("guild")
    div.id = guild.id

    div.onclick = () => {
        removeElementsCanvas('.channel')
        const notHaveCategory = []
        const textChannel = []
        const voiceChannel = []
        const categorys = []
        let i = 0
        
        guild.channels.cache.forEach(channel => {
            if(channel.parentId === null && channel.type !== "GUILD_CATEGORY") {
                notHaveCategory[i] = channel
            }
            else if(channel.type === "GUILD_CATEGORY") {
                categorys[i] = channel
            } else if(channel.type === "GUILD_TEXT") {
                textChannel[i] = channel
            } else {
                voiceChannel[i] = channel
            }
            i += 1
        })

        const channels = notHaveCategory.concat(categorys.concat(textChannel.concat(voiceChannel)))
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
        if(openChannel && !openDMChannel) {
            try {
                document.getElementById(openChannel).classList.remove('open-channel')
            } catch(e) {console.log(e)}
        }

        openDMChannel = false
        
        if(p.classList[1] === "unread-message") {
            p.classList.remove('unread-message') 
            p.innerHTML = p.textContent
        }

        openChannel = e.target.id
    
        document.getElementById(openChannel).classList.add('open-channel')

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
        const offline = []
        let i = 0

        ch.members.forEach(member => {
            if(!member.presence) {
                offline[i] = member
            } else {
                online[i] = member
            }

            i += 1
        })

        const members = online.concat(offline)
        members.forEach(member => addMemberCanvas(member))
    }

    if(category)
        category.appendChild(p)
    else
        channelsCanvas.appendChild(p)
}

function addMemberCanvas(member) {
    const div = document.createElement('div')
    const nick = document.createElement('span')
    const avatar = document.createElement('img')
    const status = document.createElement('div')

    nick.textContent = member.displayName
    avatar.src = member.user.avatarURL() ? 
                 member.user.avatarURL() : 
                 member.user.defaultAvatarURL
    avatar.classList.add('avatar')
    div.id = member.id
    div.classList.add('member')
    status.classList.add('status')
    status.classList.add(member.presence ? member.presence.status : "ofline")


    if(!member.user.bot) {
        div.onclick = (e) => {
            removeElementsCanvas(".channel")
            removeElementsCanvas(".member")
            removeElementsCanvas(".message")

            let id = e.path[0].id !== "" ? e.target.id : e.path[1].id
            selectDmChannelMessages(global.bot.users.cache.get(id))
        }
    }

    div.appendChild(avatar)
    div.appendChild(status)
    div.appendChild(nick)
    membersChannelCanvas.appendChild(div)
}