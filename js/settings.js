function changeStatus(status) {
    statusBot.classList.remove(global.bot.presence.status)
    global.bot.user.setStatus(status)
    statusBot.classList.add(global.bot.presence.status)
}

async function changeConfig(key, value, subkey) {
    const config = readFileSync(join('json', 'config.json'), {encoding: "utf-8"})
    const object = JSON.parse(config)

    if(subkey) {
        object[key][subkey] = value
    } else {
        object[key] = value
    }

    writeFileSync(join('json', 'config.json'), JSON.stringify(object))
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

        divSt.onclick = (e) => {
            const status = e.path[0].id === "" ? e.path[1].id : e.path[0].id
            changeStatus(status)
            dropDownStatuses.classList.toggle("statusDropDownNotOpen")
        }

        divSt.appendChild(sign)
        divSt.appendChild(span)
        dropDownStatuses.appendChild(divSt)
    }   

    document.body.appendChild(dropDownStatuses)
}

function accountSettings() {
    const avatar = displaySettings.querySelector('#info-user > img')
    const username = displaySettings.querySelector('#username')
    const owner = displaySettings.querySelector("#owner")
    const createAt = displaySettings.querySelector("#create-at")
    const btnChangeName = displaySettings.querySelector("#ch-name-btn")
    const newNameInput = displaySettings.querySelector("#new-name")

    newNameInput.placeholder = global.bot.user.username
    username.textContent = global.bot.user.tag
    owner.textContent = global.bot.application.owner !== null ? 
                         global.bot.application.owner :
                         "Ты пробирочный :)"
    avatar.src = global.bot.user.avatarURL()
    _crAt = global.bot.user.createdAt
    createAt.textContent = `${_crAt.getDate()}.${_crAt.getMonth()+1}.${_crAt.getFullYear()} в ${_crAt.getHours()}:${_crAt.getMinutes()}`

    btnChangeName.onclick = async () => {
        console.log(newNameInput.value)
        await global.bot.user.setUsername(newNameInput.value).catch((e) => {
            console.error(e)
            displaySettings.querySelector("#change-account > p").textContent = "Возникла ошибка при изменении имени бота"
        })
        accountSettings()
        userSettingsCanvas.querySelector('span').textContent = global.bot.user.tag
    }
}

function settingOptions() {
    document.querySelector("#home").onclick = () => {
        displaySettings.style.visibility = "hidden"
        document.getElementById("main").style.visibility = "visible"
    }
    const categories = document.querySelector("#categories")

    accountSettings()

    for (const option of categories.querySelectorAll(".option")) {
        option.onclick = (e) => {
            _type = e.path[0].id === "" ? e.path[1].id : e.path[0].id
            switch (_type) {
                case "account":
                    accountSettings()
                    break;
            }
        }
    }
}