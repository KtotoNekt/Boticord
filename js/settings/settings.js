function changeStatus(status) {
    statusBot.classList.remove(global.bot.presence.status)
    global.bot.user.setStatus(status)
    statusBot.classList.add(global.bot.presence.status)
}



async function changeConfig(key, value, subkey) {
    const config = readFileSync(join(__dirname, 'json', 'config.json'), {encoding: "utf-8"})
    const object = JSON.parse(config)

    if(subkey) {
        object[key][subkey] = value
    } else {
        object[key] = value
    }

    writeFileSync(join(__dirname, 'json', 'config.json'), JSON.stringify(object))
}



function createDropDownStatus() {
    dropDownStatuses = document.createElement("div")
    dropDownStatuses.classList.add("statusDropDownNotOpen")
    dropDownStatuses.id = "statusDropDown"
    for (const status of ["online", 'idle', "dnd", "invisible"]) {
        const divSt = document.createElement("div")
        const sign = document.createElement("div")
        const span = document.createElement("span")
            
        divSt.classList.add('statusDropDownItem')
        divSt.id = status
        sign.classList.add("sign")
        sign.classList.add(status)

        switch (status) {
            case "online": 
                span.textContent = "В сети"
                break
            case "idle":
                span.textContent = "Не активен"
                break
            case "dnd":
                span.textContent = "Не беспокоить"
                break
            case "invisible":
                span.textContent = "Невидимый"
                break
        }

        divSt.onclick = () => {
            changeStatus(divSt.id)
            dropDownStatuses.classList.toggle("statusDropDownNotOpen")
        }

        divSt.appendChild(sign)
        divSt.appendChild(span)
        dropDownStatuses.appendChild(divSt)
    }   

    document.body.appendChild(dropDownStatuses)
}



function structuringCreatedAt(_crAt) {
    return `${_crAt.getDate()}.${_crAt.getMonth()+1}.${_crAt.getFullYear()} в ${_crAt.getHours()}:${_crAt.getMinutes()}`
}




function homeOnClickCreate(elementDivSettings) {
    elementDivSettings.querySelector(".home").onclick = () => {
        elementDivSettings.style.visibility = "hidden"
        document.getElementById("main").style.visibility = "visible"

        const openOption = elementDivSettings.querySelector(".open")
        document.getElementById(openOption.id+"-dis").style.visibility = "hidden"
        openOption.classList.remove("open")
    }
}




function hiddenDivSettings(optionHidden, optionVisible) {
    optionHidden.classList.remove("open")
    optionVisible.classList.add("open")

    const divHidden = document.getElementById(optionHidden.id + "-dis")
    const divVisible = document.getElementById(optionVisible.id + "-dis")

    divHidden.style.visibility = "hidden"
    divVisible.style.visibility = "visible"
}




function hasPermissionGuild(guild, permission) {
    try {
        return guild.members.me.permissions.has(permission)
    } catch {
        return false;
    }
    
}