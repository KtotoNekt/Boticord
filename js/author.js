function loginToken() {
    const login = document.getElementById('login')
    login.onclick = () => {
        const token = document.querySelector("#token").value
        checkDiscordToken(token)
    }
}



function checkDiscordToken(token) {
    const error = document.querySelector("#error")

    if(token === "") {
        error.textContent = "Пустой токен"
        return
    }

    loadingBot(token)
}

async function changeConfig(key, value) {
    const config = readFileSync(join('json', 'config.json'), {encoding: "utf-8"})
    const object = JSON.parse(config)
    object[key] = value
    writeFileSync(join('json', 'config.json'), JSON.stringify(object))
}