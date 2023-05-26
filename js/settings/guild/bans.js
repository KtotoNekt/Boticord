async function bansSettings(guild) {
    const divListBans = document.querySelector("#list-bans")
    const titleBans = document.querySelector("#bans-dis > h3")

    removeElementsCurrentCanvas(divListBans, ".ban")
    
    const fetchedBans = await guild.bans.fetch();
    if (fetchedBans.size > 0) {
        titleBans.textContent = fetchedBans.size + " банов"
    } else {
        titleBans.textContent = "Нет банов"
    }

    fetchedBans.mapValues(ban => {
        const div = document.createElement("div")
        const avatar = document.createElement("img")
        const name = document.createElement("span")
        const reason = document.createElement("span")

        div.classList.add("ban")
        div.id = ban.user.id
        avatar.src = ban.user.avatarURL() ?? ban.user.defaultAvatarURL
        name.textContent = ban.user.username + "#" + ban.user.discriminator
        name.classList.add("ban-username")

        console.log(ban.reason ? ban.reason.length : undefined)
        if (ban.reason) {
            reason.textContent = ban.reason.length <= 45 ? ban.reason : ban.reason.slice(0, 45)
        } else {
            reason.textContent = "Причина не указана"
        }
        
        reason.classList.add("ban-reason")
        
        div.appendChild(avatar)
        div.appendChild(name)
        div.appendChild(reason)

        divListBans.appendChild(div)
    })
}