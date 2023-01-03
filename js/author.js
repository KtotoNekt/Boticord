function loginToken() {
    const login = document.getElementById('login')
    login.onclick = () => {
        const token = document.querySelector("#token").value
        checkDiscordToken(token)
    }
}

function checkDiscordToken(token) {
    const error = document.querySelector("#error")
    error.textContent = ""

    if(token === "") {
        error.textContent = "Пустой токен"
        return
    }

    const isEnableIntents = document.getElementById('is-on-intents').checked
    loadingBot(token, isEnableIntents)
}