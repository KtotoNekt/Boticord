async function loadingBot(token) {
    const config = JSON.parse(readFileSync(join(__dirname, "json", 'config.json'), {encoding: 'utf-8'}))
    config.cfg.intents = new Discord.Intents(config.cfg.intents)
    global.bot = new Discord.Client(config.cfg)

    bot.hideUnallowed = true

    bot.login(token)
        .then(() => {
            //changeConfig("token", token)
        })
        .catch((e) => {
            document.querySelector("#error").textContent = "Неверный токен"
            console.log(e)
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
        console.log(voiceState.guild.id, openGuild)
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

    // bot.on("clientUserSettingsUpdate", user => {
    //     console.log(user)
    //     addMemberCanvas(user)
    // })
}