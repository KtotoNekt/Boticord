async function overviewSettings(guild) {
    const icon = guildSettingsCanvas.querySelector('.info-set > img')
    const guildname = guildSettingsCanvas.querySelector('#guildname')
    const owner = guildSettingsCanvas.querySelector("#owner")
    const createAt = guildSettingsCanvas.querySelector("#create-at")
    const changeSettingsGuildDiv = guildSettingsCanvas.querySelector(".change-set")
    const error = guildSettingsCanvas.querySelector(".change-set > p")
    const fileInputAvatar = guildSettingsCanvas.querySelector("#new-avatar")
    
    const newNameInput = guildSettingsCanvas.querySelector("#new-name")

    icon.src = guild.iconURL() ?? join('img', 'default.png')
    guildname.textContent = guild.name
    await guild.fetchOwner().then(ownerUsr => {
        owner.textContent = ownerUsr.user.tag
    })

    newNameInput.value = ""
    error.textContent = ""
    fileInputAvatar.value = ""
    newNameInput.placeholder = guild.name
    createAt.textContent = structuringCreatedAt(guild.createdAt)

    if (hasPermissionGuild(guild, PermissionFlagsBits.ManageGuild)) {
        changeSettingsGuildDiv.classList.remove("view-dis")
        const btnChangeName = guildSettingsCanvas.querySelector("#ch-name-btn")
        const btnChangeAvatar = guildSettingsCanvas.querySelector("#ch-avatar-btn")
        

        btnChangeName.onclick = async () => {
            error.textContent = ""
            await guild.setName(newNameInput.value).catch(e => {
                console.error(e)
                error.textContent = "Возникла ошибка при изменении названия сервера"
            })
    
            overviewSettings(guild)
        }
    
        btnChangeAvatar.onclick = async () => {
            error.textContent = ""
            if (fileInputAvatar.files.length != 0) {
                const path = fileInputAvatar.files[0].path
                await guild.setIcon(readFileSync(path)).catch(e => {
                    console.error(e)
                    error.textContent = "Возникла ошибка при изменении иконки сервера"
                })
    
                overviewSettings(guild)
            } else {
                error.textContent = "Вы не выбрали изображение"
            }
        }
    } else {
        changeSettingsGuildDiv.classList.add('view-dis')
    }
}

function addAdditionalOption(title, id, categories) {
    if (document.getElementById(id)) return

    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("option")
    div.id = id

    span.textContent = title

    div.appendChild(span)
    categories.appendChild(div)
}

function removeAdditionalOption(id) {
    const option = document.getElementById(id)
    if (option) option.remove()
}

function checkPermissionsForAdditionalOptions(guild, categories) {
    const permissions = [
        // {
        //     definition: "ViewAuditLog",
        //     title: "Журнал аудита",
        //     id: "audit-journal"
        // },
        {
            definition: "BanMembers",
            title: "Баны",
            id: "bans"
        },
        {
            definition: "ManageGuild",
            title: "Приглашения",
            id: "invites"
        }
    ]

    for (const permission of permissions) {
        if (hasPermissionGuild(guild, permission.definition)) {
            addAdditionalOption(permission.title, permission.id, categories)
        } else {
            removeAdditionalOption(permission.id)
        }
    }
}

function guildSettingOptions(guild) {
    homeOnClickCreate(guildSettingsCanvas)
    const categories = guildSettingsCanvas.querySelector(".categories")
    const overviewDis = document.getElementById("overview-dis")

    checkPermissionsForAdditionalOptions(guild, categories)

    overviewSettings(guild)
    
    overviewDis.style.visibility = "visible"
    
    guildSettingsCanvas.querySelector("#overview").classList.add("open")

    for (const option of categories.querySelectorAll(".option")) {
        option.onclick = () => {
            const openOption = categories.querySelector(".open")
            switch (option.id) {
                case "overview":
                    overviewSettings(guild)
                    break;
                case "invites":
                    invitesSettings(guild)
                    break;
                case "roles":
                    rolesSettins(guild)
                    break;
                // case "audit-journal":
                //     auditJournalSettings(guild)
                //     break;
                case "bans":
                    bansSettings(guild)
                    break;
                case "emojis":
                    emojisSettings(guild)
                    break;
            }

            hiddenDivSettings(openOption, option)
        }
    }
}