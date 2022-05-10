const { writeFileSync, readFileSync } = require('fs')
const { join } = require('path')
const { ipcRenderer } = require('electron')
const Discord = require('discord.js')

function checkDiscordToken(token) {
    const bot = new Discord.Client({intents: new Discord.Intents(32767)})
    bot.login(token)
        .then(() => {
            bot.destroy()
            ipcRenderer.send('main')
            changeConfig(token)
        })
        .catch((e) => {
            document.querySelector("#error").textContent = "Неверный токен"
        })
}

async function changeConfig(value) {
    const config = readFileSync(join(__dirname, "..", 'client', 'config.json'), {encoding: "utf-8"})
    const object = JSON.parse(config)
    object.token = value
    writeFileSync(join(__dirname, "..", 'client', 'config.json'), JSON.stringify(object))
}

document.querySelector('#btn').onclick = () => {
    const token = document.querySelector("#token").value
    checkDiscordToken(token)
}