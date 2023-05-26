function emojisSettings(guild) {
    // const emojisDis = document.querySelector("#emojis-dis")
    const divListEmojis = document.getElementById("list-emojis")
    const createEmojiDiv = document.getElementById("create-emoji-div")
    const fileInputEmoji = createEmojiDiv.querySelector('input[type="file"]')

    const isPermissionManageEmoji = hasPermissionGuild(guild, PermissionFlagsBits.ManageEmojisAndStickers)

    fileInputEmoji.value = ""

    if (isPermissionManageEmoji) {
        createEmojiDiv.classList.remove("view-dis")

        const error = createEmojiDiv.querySelector(".error")
        const btnAddEmoji = createEmojiDiv.querySelector("#emoji-add-btn")

        btnAddEmoji.onclick = async () => {
            error.textContent = ""
            if (fileInputEmoji.files.length != 0) {
                const path = fileInputEmoji.files[0].path
                let fileName = basename(path, extname(path)).replace(/[^a-z\d]/g, '');
                if (fileName.length < 3) {
                    fileName += "_crb"
                } 
                
                console.log(fileName)

                await guild.emojis.create({ attachment: path, name: fileName })
                    .then(() => {
                        emojisSettings(guild)
                    })
                    .catch(e => {
                        console.error(e)
                        error.textContent = "Возникла ошибка при добавлении эмодзи"
                    })
            } else {
                error.textContent = "Вы не выбрали изображение"
            }
        }
    } else {
        createEmojiDiv.classList.add("view-dis")
    }


    removeElementsCurrentCanvas(divListEmojis, ".emoji")

    guild.emojis.cache.forEach(emoji => {
        const div = document.createElement("div")
        const divEmoji = document.createElement("div")
        const divAuthor = document.createElement("div")

        const emojiIcon = document.createElement("img")
        const nameEmoji = document.createElement("input")
        const avatarAuthor = document.createElement("img")
        const nameAuthor = document.createElement("span")

        div.classList.add("emoji")
        divEmoji.classList.add("emoji-div")
        divAuthor.classList.add("author-div")

        emojiIcon.src = emoji.url
        nameEmoji.value = emoji.name

        if (isPermissionManageEmoji) {
            const deleteEmoji = document.createElement("img")
            deleteEmoji.classList.add("element-delete")
            deleteEmoji.src = join(__dirname, "img", "delete.png")

            div.addEventListener("mouseover", () => {
                deleteEmoji.style.visibility = "visible"
            })
            div.addEventListener("mouseout", () => {
                deleteEmoji.style.visibility = "hidden"
            })

            deleteEmoji.onclick = async () => {
                error.textContent = ""
                await guild.emojis.delete(emoji)
                    .then(() => emojisSettings(guild))
                    .catch(err => error.textContent = "Не удалось удалить эмодзи")
            }

            nameEmoji.onchange = () => {
                emoji.setName(nameEmoji.value)
            }

            div.appendChild(deleteEmoji)

            emoji.fetchAuthor().then(user => {
                avatarAuthor.src = user.avatarURL()
                nameAuthor.textContent = user.tag
            })
        }

        nameAuthor.textContent = "Недостаточно прав!"

        divEmoji.appendChild(emojiIcon)
        divEmoji.appendChild(nameEmoji)

        divAuthor.appendChild(avatarAuthor)
        divAuthor.appendChild(nameAuthor)
        
        div.appendChild(divEmoji)
        div.appendChild(divAuthor)
        

        divListEmojis.appendChild(div)
    })
}