module.exports = (bot, win) => {
    bot.on("ready", () => require('./ready.js')(bot, win))
    bot.on("message", message => require('./message.js').message(bot, win, message))
    
    require("./message.js").onmessage(bot)
}