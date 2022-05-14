async function loadingBot(token) {
    const config = JSON.parse(readFileSync(join("json", 'config.json'), {encoding: 'utf-8'}))
    config.cfg.intents = new Discord.Intents(config.cfg.intents)
    global.bot = new Discord.Client(config.cfg)

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
}