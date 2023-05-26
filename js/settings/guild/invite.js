function updateTime(time) {
    const date = new Date(new Date(time) - new Date());
    let days = date.getDate()-1
    let hours = date.getHours()-3

    if (hours === -1) {
        days -= 1
        hours = 23
    }

    return `${days}:${hours}:${date.getMinutes()}:${date.getSeconds()}`;
}


function invitesSettings(guild) {
    const divListInvites = guildSettingsCanvas.querySelector("#list-invites")
    removeElementsCurrentCanvas(divListInvites, ".invite")

    guild.invites.fetch().then(invites => {
        invites.forEach(invite => {
            user = invite.inviter

            const div = document.createElement("div")
            const img = document.createElement("img")
            const inviter = document.createElement("span")
            const code_inveite = document.createElement("span")
            const uses = document.createElement("span")
            const age = document.createElement("span")

            const channel = document.createElement("div")
            const icon = document.createElement("img")
            const name = document.createElement("span")

            div.classList.add("invite")

            img.src = invite.inviter.avatarURL() ?? user.defaultAvatarURL
            inviter.textContent = user.tag
            code_inveite.textContent = invite.code
            uses.textContent = invite.maxUses !== 0 ? invite.uses + "/" + invite.maxUses : invite.uses
            
            if (invite.expiresAt) {
                age.textContent = updateTime(invite._expiresTimestamp)
                setInterval(() => {
                    age.textContent = updateTime(invite._expiresTimestamp)
                }, 1000)
            } else {
                age.textContent = "∞"
            }
                

            channel.classList.add("channel-invite")
            name.textContent = invite.channel.name
            switch (invite.channel.type) {
                case 0:
                    icon.src = join("img", "textChannel.svg")
                    break;
                case 2:
                    icon.src = join("img", "voiceChannel.svg")
                    break;
            }

            channel.appendChild(icon)
            channel.appendChild(name)

            div.appendChild(channel)

            div.appendChild(img)
            div.appendChild(inviter)
            div.appendChild(code_inveite)
            div.appendChild(uses)
            div.appendChild(age)

            divListInvites.appendChild(div)
        })
    })
}