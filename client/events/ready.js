const { join } = require('path')

module.exports = async (bot, win) => {
    await win.loadFile(join('html', "index.html"))

    bot.guilds.cache.forEach(guild => {
        win.webContents.send('guild', guild, guild.iconURL(), guild.channels.cache)
    })
}