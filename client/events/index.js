module.exports = (bot, win) => {
    bot.on("ready", () => require('./ready.js')(bot, win))
    bot.on("message", message => require('./message.js')(bot, message))
}