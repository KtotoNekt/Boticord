const { join } = require('path')
const { ipcMain } = require('electron')

module.exports = async (bot, win) => {
    await win.loadFile(join('html', "index.html"))

    bot.guilds.cache.forEach(guild => {
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

        win.webContents.send('guild', guild, guild.iconURL(), channels)
    })

    ipcMain.on("messages", (event, id) => {
        const channel = bot.channels.cache.get(id)
        try {
            channel.messages.fetch({limit: 100}).then(messages => {
            messages.forEach(message => {
                const avatar = message.author.avatarURL()
                event.sender.send("message", message, avatar)
            })
        })
        } catch {console.log(channel)}
    })
}