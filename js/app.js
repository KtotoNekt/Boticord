const { writeFileSync, readFileSync } = require('fs')
const { ipcRenderer } = require('electron')
const { join } = require('path')
const Discord = require('discord.js')

let guildCanvas
let channelsCanvas
let messagesCanvas
let membersChannelCanvas
let inputUser
let userSettingsCanvas
let statusBot
let dropDownStatuses
let displaySettings
let lineNoName
let guildLine

let channelName
// let addFriendBtn
let guildName

let openChannel
let openDMChannel = false
let openGuild


function windowOpen() {
    console.log(global.bot)
    guildCanvas = document.querySelector("#guilds")
    channelsCanvas = document.querySelector('#channels')
    messagesCanvas = document.querySelector('#chat')
    membersChannelCanvas = document.querySelector('#channel-members')
    inputUser = document.querySelector("#input")
    userSettingsCanvas = document.querySelector("#me")
    statusBot = userSettingsCanvas.querySelector('div')
    displaySettings = document.querySelector('#display-settings')
    lineNoName = document.querySelector('#line-noname')
    channelName = lineNoName.querySelector("#channel-name")
    // addFriendBtn = lineNoName.querySelector("#add-friend")
    guildLine = document.querySelector("#guild-line")
    guildName = guildLine.querySelector("span")

    global.bot.guilds.cache.forEach(guild => addGuildCanvas(guild))
    document.getElementById("author").style.visibility = "hidden"
    document.getElementById("main").style.visibility = "visible"

    const avatar = userSettingsCanvas.querySelector('img#avatar')
    avatar.src = global.bot.user.avatarURL()
    userSettingsCanvas.querySelector('span').textContent = global.bot.user.tag
    statusBot.classList.add(global.bot.presence.status)

    createDropDownStatus()

    document.getElementById('dmchannels').onclick = () => {
        guildName.textContent = "Личные сообщения"
        removeElementsCanvas('.channel')
        removeCategorys()

        // selectDmChannels()
    }

    userSettingsCanvas.querySelector('img#set').onclick = () => {
        dropDownStatuses.classList.add("statusDropDownNotOpen")
        displaySettings.style.visibility = "visible"
        document.getElementById("main").style.visibility = "hidden"
        settingOptions()
    }

    inputUser.addEventListener("keydown", (e) => {
        if (e.code === "Enter") {
            if (openChannel)
                sendMessage(openChannel)

            inputUser.value = ""
        }
    })

    avatar.onclick = () => {
        dropDownStatuses.classList.toggle("statusDropDownNotOpen")
    }
}

function removeCategorys() {
    const categorys = document.querySelectorAll("div > p.category")
    categorys.forEach(category => {
        category.parentElement.remove()
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
        if (openGuild) {
            document.getElementById(`${openGuild}`).classList.remove("open-guild")
        }
        openGuild = guild.id
        guildName.textContent = guild.name
        
        div.classList.add("open-guild")

        removeElementsCanvas('.channel')
        removeCategorys()

        const notHaveCategory = []
        const textChannel = []
        const voiceChannel = []
        const categorys = []
        let i = 0

        guild.channels.cache.forEach(channel => {
            if (channel.parentId === null && channel.type !== "GUILD_CATEGORY") {
                notHaveCategory[i] = channel
            }
            else if (channel.type === "GUILD_CATEGORY") {
                categorys[i] = channel
            } else if (channel.type === "GUILD_TEXT") {
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

    div.appendChild(p)
    channelsCanvas.appendChild(div)
}

function addMemberVoice(member) {
    const user = document.createElement("div")
    const nickname = document.createElement("span")
    const avatarMember = document.createElement("img")

    user.classList.add("member-voice")
    user.id = member.id
    nickname.textContent = member.displayName
    avatarMember.src = member.user.avatarURL() ?
                member.user.avatarURL() :
                member.user.defaultAvatarURL

    user.appendChild(avatarMember)
    user.appendChild(nickname)

    return user
}

function addChannelCanvas(channel) {
    if (channel.type === "GUILD_CATEGORY") {
        addCategoryCanvas(channel)
        return
    }

    const div = document.createElement("div")
    const category = document.getElementById(channel.parentId)
    const p = document.createElement('span')
    let icon = document.createElement("img")
    
    let voice_users

    div.classList.add('channel')
    p.textContent = channel.name
    div.id = channel.id

    if (channel.type === "GUILD_TEXT") {
        icon.src = join("img", "textChannel.svg")

        div.onclick = (e) => {
            if (openChannel && !openDMChannel) {
                try {
                    document.getElementById(openChannel).classList.remove('open-channel')
                } catch (err) { console.log(err) }
            }

            openDMChannel = false

            if (div.classList[1] === "unread-message") {
                div.classList.remove('unread-message')
                p.innerHTML = p.textContent
            }

            openChannel = channel.id
            console.log(channel.id)

            document.getElementById(openChannel).classList.add('open-channel')

            removeElementsCanvas('.message')
            removeElementsCanvas('.member')


            const ch = global.bot.channels.cache.get(openChannel)
            channelName.textContent = ch.name

            ch.messages.fetch({ limit: 100 }).then(messages => {
                messages.reverse()
                messages.forEach(message => {
                    addMessagesCanvas(message)
                })
            })

            const online = []
            const offline = []
            let i = 0

            ch.members.forEach(member => {
                if (!member.presence) {
                    offline[i] = member
                } else {
                    online[i] = member
                }

                i += 1
            })

            const members = online.concat(offline)
            members.forEach(member => addMemberCanvas(member))
        }
    } else if (channel.type === "GUILD_VOICE") {
        icon.src = join("img", "voiceChannel.svg")

        voice_users = document.createElement("div")

        channel.members.mapValues(member => {
            voice_users.appendChild(addMemberVoice(member))
        })
    }

    div.appendChild(icon)
    div.appendChild(p)
    if (voice_users) {
        div.appendChild(voice_users)
    }

    if (category)
        category.appendChild(div)
    else
        channelsCanvas.appendChild(div)
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
    status.classList.add(member.presence ? member.presence.status : "offline")


    if (!member.user.bot) {
        div.onclick = (e) => {
            console.log(member)
            channelName.textContent = member.user.username
            guildName.textContent = "Личные сообщения"
            removeElementsCanvas(".channel")
            removeElementsCanvas(".member")
            removeElementsCanvas(".message")
            removeCategorys()

            // let id = e.path[0].id !== "" ? e.target.id : e.path[1].id
            let id = member.id
            selectDmChannelMessages(global.bot.users.cache.get(id))
        }
    }

    div.appendChild(avatar)
    div.appendChild(status)
    div.appendChild(nick)
    membersChannelCanvas.appendChild(div)
}