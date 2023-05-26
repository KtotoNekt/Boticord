function accountSettings() {
    const avatar = displaySettings.querySelector('.info-set > img')
    const username = displaySettings.querySelector('#username')
    const owner = displaySettings.querySelector("#owner")
    const createAt = displaySettings.querySelector("#create-at")

    const error = displaySettings.querySelector(".change-set > p")

    const btnChangeName = displaySettings.querySelector("#ch-name-btn")
    const newNameInput = displaySettings.querySelector("#new-name")

    const btnChangeAvatar = displaySettings.querySelector("#ch-avatar-btn")
    const fileInputAvatar = displaySettings.querySelector("#new-avatar")

    newNameInput.placeholder = global.bot.user.username
    username.textContent = global.bot.user.tag
    owner.textContent = global.bot.application.owner !== null ? 
                         global.bot.application.owner :
                         "Ты пробирочный :)"
    avatar.src = global.bot.user.avatarURL() ?? join(__dirname, "img", "default.png")
    createAt.textContent = structuringCreatedAt(global.bot.user.createdAt)

    btnChangeName.onclick = async () => {
        error.textContent = ""
        await global.bot.user.setUsername(newNameInput.value).catch(e => {
            console.error(e)
            error.textContent = "Возникла ошибка при изменении имени бота"
        })

        accountSettings()
        userSettingsCanvas.querySelector('span').textContent = global.bot.user.tag
    }

    btnChangeAvatar.onclick = async () => {
        const file = fileInputAvatar.files[0]
        if (!file) {
            return
        }

        const path = file.path
        error.textContent = ""
        await global.bot.user.setAvatar(readFileSync(path)).catch(e => {
            console.error(e)
            error.textContent = "Возникла ошибка при изменении аватара бота"
        })

        accountSettings()
        userSettingsCanvas.querySelector('img#avatar').src = global.bot.user.avatarURL()
    }
}

function settingOptions() {
    homeOnClickCreate(displaySettings)
    const categories = displaySettings.querySelector(".categories")
    const accountDis = document.getElementById("account-dis")

    accountSettings()

    accountDis.style.visibility = "visible"
    document.getElementById("account").classList.add("open")

    for (const option of categories.querySelectorAll(".option")) {
        option.onclick = () => {
            switch (option.id) {
                case "account":
                    accountSettings()
                    break;
            }
        }
    }
}