function addMessagesCanvas(message) {
    const div = document.createElement('div')
    const div2 = document.createElement('div')
    const content = document.createElement('span')
    const nick = document.createElement('span')
    const avatar = document.createElement('img')

    avatar.width = 40
    avatar.height = 40
    avatar.src = message.author.avatarURL() ? 
                 message.author.avatarURL() : 
                 join("img", "default.png")
    avatar.classList.add('avatar')
    div.id = message.id
    div.classList.add('message')
    div2.classList.add('author')
    nick.textContent = message.author.username
    nick.classList.add('nick')
    content.textContent = message.content
    content.classList.add('content')

    div2.appendChild(avatar)
    div2.appendChild(nick)
    div.appendChild(div2)
    div.appendChild(content)
    messagesCanvas.appendChild(div)

    if(message.editedAt) editMessage(message, message)

    messagesCanvas.scrollTop = messagesCanvas.scrollHeight
}

function parseMessage(message) {
    if(openChannel === message.channel.id) 
        addMessagesCanvas(message)
    else {
        newMessageChannel(message)
    }
}

function deleteMessage(messageId) {
    const message = document.getElementById(messageId)
    message.classList.add('delete')
}

function newMessageChannel(message) {
    
    if(openChannel === message.channel.id && openChannel) return
    
    try {
        if(message.channel.type !== "DM") {
            const channel = document.getElementById(message.channel.id)
            message.mentions.users.forEach(user => {
                if(user.id === global.bot.user.id) {
                    channel.innerHTML = `${channel.textContent}<time class="mention-new"></time>`
                    return
                }
            })
            channel.classList.add('unread-message')
        }
    } catch {console.log(message, openChannel, message.channel.type)}
}

function editMessage(oldMessage, newMessage) {
    if(openChannel !== newMessage.channel.id) return

    const message = document.getElementById(oldMessage.id).querySelector('.content')
    try {
        message.innerHTML = `${newMessage.content} <time class="edit">(измененно)</time>`
    } catch(e) {
        console.log(e)
        console.log(oldMessage, newMessage, message)
    }
}

function sendMessage(id) {
    const message = inputUser.value
    global.bot.channels.cache.get(id).send(message)
}