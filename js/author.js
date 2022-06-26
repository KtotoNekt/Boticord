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