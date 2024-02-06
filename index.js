import express from "express"
import TelegramBot from "node-telegram-bot-api"
import axios from "axios"

const app = express()
const port = 8072

const bot = new TelegramBot("6834034269:AAGXku0CXKD1lEcZUgffEaaeoFq2m2d-IKM", {
    polling: true,
})
const url = "http://8.215.27.151:8071"

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Selamat datang penyefong bot")
        .then(() => console.log("[/START] Message sent..."))
        .catch((err) => {
            console.error("[/START] Failed sent message:", err.message)
        })
})

bot.onText(/\/seememe/, (msg) => {
    bot.sendPhoto(
        msg.chat.id,
        "https://static.wikia.nocookie.net/spongebob/images/b/b3/Krusty_Towers_019.png/revision/latest/scale-to-width-down/1200?cb=20191211221758",
    )
        .then(() => console.log("[/SEE MEME] Message sent..."))
        .catch((err) => {
            console.error("[/SEE MEME] Failed sent message:", err.message)
        })
})

bot.onText(/\/redeploydashboard/, (msg) => {
    try {
        bot.sendMessage(msg.chat.id, "Sabar masih loading...")
            .then(() => console.log("[/REDEPLOY DASHBOARD] Message sent..."))
            .catch((err) => {
                console.error(
                    "[/REDEPLOY DASHBOARD] Failed sent message:",
                    err.message,
                )
            })

        axios.get(`${url}/pm2/deploy/sipwan-dashboard`).then((res) => {
            bot.sendMessage(msg.chat.id, res.data.message)
                .then(() =>
                    console.log(
                        "[/REDEPLOY DASHBOARD COMPLETE] Message sent...",
                    ),
                )
                .catch((err) => {
                    console.error(
                        "[/REDEPLOY DASHBOARD COMPLETE] Failed sent message:",
                        err.message,
                    )
                })
        })
    } catch (error) {
        console.error("[/REDEPLOY DASHBOARD] Error:", error)
        bot.sendMessage(msg.chat.id, "Gagal cong, server lu koid kali")
            .then(() => console.log("[/REDEPLOY DASHBOARD] Message sent..."))
            .catch((err) => {
                console.error(
                    "[/REDEPLOY DASHBOARD] Failed sent message:",
                    err.message,
                )
            })
    }
})

bot.onText(/\/pm2list/, async (msg) => {
    try {
        const res = await axios.get(`${url}/pm2/list`)
        const list = res.data
        if (list.length === 0) {
            const message = "Ga ada service yang lagi running cong!"
            bot.sendMessage(msg.chat.id, message, { parse_mode: "Markdown" })
                .then(() => console.log("[/PM2 LIST] Message sent..."))
                .catch((err) => {
                    console.error(
                        "[/PM2 LIST] Failed sent message:",
                        err.message,
                    )
                })
        }
        list.forEach((v) => {
            const message = `name: ${v.name}\nid: ${v.pmId}\npid: ${v.pid}\nstatus: ${v.status}\nmemory: ${v.memory / 1000000} MB\ncpu: ${v.cpu}%\nlifetime: ${v.lifetime}\nrestart: ${v.restart}`
            bot.sendMessage(msg.chat.id, message, { parse_mode: "Markdown" })
                .then(() => console.log("[/PM2 LIST] Message sent..."))
                .catch((err) => {
                    console.error(
                        "[/PM2 LIST] Failed sent message:",
                        err.message,
                    )
                })
        })
    } catch (err) {
        console.error("[/PM2 LIST] Error:", err)
        bot.sendMessage(msg.chat.id, "Gagal cong, server lu koid kali")
            .then(() => console.log("[/PM2 LIST] Message sent..."))
            .catch((err) => {
                console.error("[/PM2 LIST] Failed sent message:", err.message)
            })
    }
})

bot.onText(/\/dockerps/, async (msg) => {
    try {
        const res = await axios.get(`${url}/docker/ps`)
        const list = res.data
        if (list.length === 0) {
            const message = "Ga ada service yang lagi running cong!"
            bot.sendMessage(msg.chat.id, message, { parse_mode: "Markdown" })
                .then(() => console.log("[/DOCKER PS] Message sent..."))
                .catch((err) => {
                    console.error(
                        "[/DOCKER PS] Failed sent message:",
                        err.message,
                    )
                })
        }
        list.forEach((v) => {
            const message = `name: ${v.image}\nid: ${v.id}\nstate: ${v.state}\nstatus: ${v.status}`
            bot.sendMessage(msg.chat.id, message, { parse_mode: "Markdown" })
                .then(() => console.log("[/DOCKER PS] Message sent..."))
                .catch((err) => {
                    console.error(
                        "[/DOCKER PS] Failed sent message:",
                        err.message,
                    )
                })
        })
    } catch (err) {
        console.error("[/DOCKER PS] Error:", err)
        bot.sendMessage(msg.chat.id, "Gagal cong, server lu koid kali")
            .then(() => console.log("[/DOCKER PS] Message sent..."))
            .catch((err) => {
                console.error("[/DOCKER PS] Failed sent message:", err.message)
            })
    }
})

app.listen(port, () => {
    console.log(`[APP] Server started on port ${port}`)
})
