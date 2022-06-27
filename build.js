const builder = require("electron-builder")
const platform = builder.Platform
const { join } = require("path")

const win32 = platform.WINDOWS.createTarget(null, builder.Arch.ia32)
const win64 = platform.WINDOWS.createTarget()
const linux = platform.LINUX.createTarget()

builder.build({
    // Вместо linux вставьте переменную с вашей OS
    targets: linux,
    config: {
        linux: {
            icon: join(__dirname, "img", "icon_512.png"),
            category: "Network",
            target: "AppImage",
        },
        win: {
            icon: join(__dirname, "img", "icon_512.png"),
            target: "nsis",
        },
    }
})