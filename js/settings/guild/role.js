function roleActions(role, func) {
    const rolesOption = document.getElementById("roles")

    if (rolesOption.classList.contains("open")) {
        func(role)
    }
}



function createSettingsRole(role) {
    const permissions = role.permissions.toArray()

    const divRoleSet = document.getElementById("div-role-set")
    const divPermissionRole = document.getElementById("permissions-role")
    const changeRoleSet = document.getElementById("change-role-set")
    const deleteRole = document.getElementById("delete-role")
    const error = divRoleSet.querySelector(".error")

    error.textContent = ""
    document.getElementById("role-settings").scrollTop = 0

    document.getElementById("integration").textContent = role.tags == null || Object.keys(role.tags).length == 0 ?  "Это роль не управляется какой либо интеграцией" : "Это роль управляется интеграцией" 

    const roleName = document.getElementById("role-name")
    const roleId = divRoleSet.querySelector("#role-id")
    const roleColor = document.getElementById("role-color")
    const isHoist = document.getElementById("hoist")
    const isMentionable = document.getElementById("mentionable")

    const newPermissions = permissions
    
    divPermissionRole.querySelectorAll("input").forEach(permission => {
        if (permissions.indexOf(permission.id) !== -1) {
            permission.checked = true
        } else {
            permission.checked = false
        }

        permission.onchange = () => {
            if (permission.checked) {
                newPermissions[newPermissions.length] = permission.id
            } else {
                delete newPermissions[newPermissions.indexOf(permission.id)]
            }
        }
    })

    roleName.value = role.name
    roleId.textContent = role.id
    roleColor.value = role.color == 0 ? "#99AAB5" : role.hexColor
    isHoist.checked = role.hoist
    isMentionable.checked = role.mentionable
   
    if (!role.editable) {
        divRoleSet.classList.add("view-dis")
        return
    } else {
        divRoleSet.classList.remove("view-dis")
    }

    changeRoleSet.onclick = () => {
        error.textContent = ""
        role.edit({
            name: roleName.value,
            color: roleColor.value,
            hoist: isHoist.checked,
            mentionable: isMentionable.checked,
            permissions: newPermissions
        })
        .then(() => rolesSettins(role.guild, role))
        .catch((e) => {console.error(e);error.textContent = "Во время изменении роли произошла ошибка"})
    }

    deleteRole.onclick = async () => {
        error.textContent = ""
        await role.delete()
            .then(() => rolesSettins(role.guild))
            .catch(() => error.textContent = "Во время удаления роли произошла ошибка")
    }
}

function roleDeleteOnSettingsDisplay(role) {
    const roleOptionOpen = divListRoles.querySelector(".open")

    const roleElement = document.getElementById(role.id)
    roleElement.remove()

    if (roleOptionOpen && role.id == roleOptionOpen.id) {
        rolesSettins(role.guild)
    } 
}

function roleUpdateOnSettingsDisplay(role) {
    const roleOptionOpen = divListRoles.querySelector(".open")

    if (roleOptionOpen && role.id == roleOptionOpen.id) {
        createSettingsRole(role)
    } 

    const roleElement = document.getElementById(role.id)
    const nameRole = roleElement.querySelector("span")
    const colorRole = roleElement.querySelector("div")

    nameRole.textContent = role.name
    colorRole.style.backgroundColor = role.color == 0 ? "#99AAB5" : role.hexColor
}

function roleAddOnSettingsDisplay(role) {
    const div = document.createElement("div")
    const icon = document.createElement("div")
    const name = document.createElement("span")
    const img = document.createElement("img")

    div.classList.add("role")
    div.id = role.id
    div.guildRole = role

    icon.style.borderRadius = "100px"
    icon.style.backgroundColor = role.color == 0 ? "#99AAB5" : role.hexColor

    img.src = role.editable ? join(__dirname, "img", "settings-role.png") : join(__dirname, "img", "view.png")

    img.onclick = () => {
        createSettingsRole(role)
        const optionRoleOpen = divListRoles.querySelector(".open")
        const optionRoleOpenNoDragula = divListNoDragulaRoles.querySelector(".open")
        if (optionRoleOpen) {
            optionRoleOpen.classList.remove("open")
        } else if (optionRoleOpenNoDragula) {
            optionRoleOpenNoDragula.classList.remove("open")
        }

        div.classList.add("open")
    }

    name.textContent = role.name
    
    div.appendChild(icon)
    div.appendChild(name)
    div.appendChild(img)

    if (role.editable) {
        divListRoles.appendChild(div)
    } else {
        divListNoDragulaRoles.appendChild(div)
    }
    
}

function rolesSettins(guild, default_role=guild.roles.everyone) {
    const roleDis = document.querySelector("#roles-dis")
    let addBtn = roleDis.querySelector(".add-btn")

    if (guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
        if (!addBtn) {
            addBtn = document.createElement("img")

            addBtn.classList.add("add-btn")
            addBtn.src = "./img/add.png"
        }

        addBtn.onclick = () => {
            guild.roles.create({permissions: []}).then(role => {
                rolesSettins(guild, role)
            })
        }
        
        roleDis.appendChild(addBtn)
    } else {
        if (addBtn) addBtn.remove()
    }

    removeElementsCurrentCanvas(divListRoles, ".role")
    removeElementsCurrentCanvas(divListNoDragulaRoles, ".role")

    createSettingsRole(default_role)

    const roles = guild.roles.cache.sort((role1, role2) => {
        return role2.rawPosition - role1.rawPosition
    })

    roles.forEach(role => {
        roleAddOnSettingsDisplay(role)
    })
}