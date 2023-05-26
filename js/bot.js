async function loadingBot(token, isEnableIntents) {
    const config = JSON.parse(readFileSync(join(__dirname, "json", 'config.json'), {encoding: 'utf-8'}))
    if (!isEnableIntents) {
        config.cfg.intents = []
    }
    
    const bot = new Discord.Client(config.cfg)

    bot.hideUnallowed = true
    
    bot.login(token)
        .then(() => {
            //changeConfig("token", token)
        })
        .catch(() => {
            const error = document.querySelector("#error")
            error.textContent = "Неверный токен"
        })

    bot.on('ready', () => {
        windowOpen()
    })

    bot.on("messageCreate", message => {
        parseMessage(message)
    })

    bot.on("messageDelete", message => {
        deleteMessage(message.id)
    })

    bot.on("messageUpdate", (oldMessage, newMessage) => {
        editMessage(oldMessage, newMessage)
    })

    bot.on("guildUpdate", (_, guild) => {
        const icon = document.getElementById(guild.id).querySelector("img")
        icon.src = guild.iconURL() ?? join('img', 'default.png')

        if (openGuild == guild.id) {
            guildName.textContent = guild.name
        }
    })

    bot.on("guildCreate", guild => {
        addGuildCanvas(guild)
    })

    bot.on('guildDelete', guild => {
        document.getElementById(guild.id).remove()
    })

    bot.on('roleUpdate', (_, role) => {
        roleActions(role, roleUpdateOnSettingsDisplay)
    })

    bot.on('roleCreate', role => {
        roleActions(role, roleAddOnSettingsDisplay)
    })

    bot.on('roleDelete', role => {
        roleActions(role, roleDeleteOnSettingsDisplay)
    })

    bot.on("voiceStateUpdate", voiceState => {
        if (openGuild === voiceState.guild.id) {
            const voiceImgs = document.querySelectorAll(".channel > img[src='img/voiceChannel.svg']")
            voiceImgs.forEach(voiceImg => {
            bot.channels.fetch(voiceImg.parentElement.id)
                .then(voice => {
                    const voice_users = document.getElementById(`${voiceImg.parentElement.id}`)
                    voice_users.querySelectorAll(".member-voice").forEach(el => el.remove())
                    voice.members.mapValues(mVoice => {
                        voice_users.append(addMemberVoice(mVoice))
                    })
                })
            })
        }
    })

    global.bot = bot
}