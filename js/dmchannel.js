async function selectDmChannelMessages(user) {
    openDMChannel = true
    await user.createDM()

    const dmchannel = user.dmChannel
    openChannel = dmchannel.id

    dmchannel.messages.fetch({limit: 100}).then(messages => {
        messages.reverse()
        messages.forEach(message => addMessagesCanvas(message))
    })

    let member1
    let member2 
    await global.bot.guilds.cache.forEach(guild => {
        if(!member1) {
            guild.members.fetch(user)
                .then(member => member1 = member)
                .catch((e) => console.log("Не найден"))
        }

        if(!member2) {
            guild.members.fetch(global.bot.user)
                .then(member => member2 = member)
                .catch((e) => console.log("Не найден"))
        }
    })

    addMemberCanvas(member1)
    addMemberCanvas(member2)
}

function addDMChannelCanvas(user) {
    
}

function selectDmChannels() {
    // readFileSync(join('json', "config.json"))
}