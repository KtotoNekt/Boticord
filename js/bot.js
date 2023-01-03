async function loadingBot(token, isEnableIntents) {
    const config = JSON.parse(readFileSync(join(__dirname, "json", 'config.json'), {encoding: 'utf-8'}))
    if (isEnableIntents) {
        config.cfg.intents = new Discord.Intents(config.cfg.intents)
    }
    
    global.bot = new Discord.Client(config.cfg)

    bot.hideUnallowed = true

    bot.login(token)
        .then(() => {
            //changeConfig("token", token)
        })
        .catch((e) => {
            const error = document.querySelector("#error")
            if (e.name === "Error [DISALLOWED_INTENTS]") {
                error.textContent = "Не включены интенты"
            } else {
                error.textContent = "Неверный токен"
            }
        })

    bot.on('ready', () => {
        windowOpen()
    })

    bot.on("message", message => {
        parseMessage(message)
    })

    bot.on("messageDelete", message => {
        deleteMessage(message.id)
    })

    bot.on("messageUpdate", (oldMessage, newMessage) => {
        editMessage(oldMessage, newMessage)
    })

    bot.on("guildCreate", (guild) => {
        addGuildCanvas(guild)
    })

    bot.on('guildDelete', guild => {
        document.getElementById(guild.id).remove()
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
}