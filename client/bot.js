const { channel } = require('diagnostics_channel')
const Discord = require('discord.js')
const { readFileSync } = require('fs')
const  { join } = require('path')

module.exports = async (win) => {
    const config = JSON.parse(readFileSync(join(__dirname, 'config.json'), {encoding: 'utf-8'}))
    config.cfg.intents = new Discord.Intents(config.cfg.intents)
    const bot = new Discord.Client(config.cfg)

    bot.login(config.token)
    require('./events')(bot, win)
}