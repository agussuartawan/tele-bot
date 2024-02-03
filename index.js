import express from "express"
import TelegramBot from "node-telegram-bot-api"
import axios from "axios"

const app = express()
const port = 8072

const bot = new TelegramBot("6834034269:AAGXku0CXKD1lEcZUgffEaaeoFq2m2d-IKM", {polling: true})
const url = "http://localhost:8071"

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Selamat datang penyefong bot")
        .then(() => console.log("[TELEGRAM BOT] Message sent..."))
        .catch(err => {
            console.error("[TELEGRAM BOT] Failed sent message:", err.message)
        })
})

bot.onText(/\/redeploydashboard/, (msg) => {
    try {
        bot.sendMessage(msg.chat.id, "Sabar masih loading...")
            .then(() => console.log("[TELEGRAM BOT] Message sent..."))
            .catch(err => {
                console.error("[TELEGRAM BOT] Failed sent message:", err.message)
            })


        (async () => {
            const res = await axios.get(`${url}/pm2/deploy/sipwan-dashboard`)

            bot.sendMessage(msg.chat.id, res.data.message)
                .then(() => console.log("[TELEGRAM BOT] Message sent..."))
                .catch(err => {
                    console.error("[TELEGRAM BOT] Failed sent message:", err.message)
                })
        })
    } catch (error) {
        console.error("[TELEGRAM BOT] Error:", error)
        bot.sendMessage(msg.chat.id, "Gagal cong, server lu koid kali")
            .then(() => console.log("[TELEGRAM BOT] Message sent..."))
            .catch(err => {
                console.error("[TELEGRAM BOT] Failed sent message:", err.message)
            })
    }
})

bot.onText(/\/pm2list/, async (msg) => {
    try {
        const res = await axios.get(`${url}/pm2/list`)
        const list = res.data
        let message = ""
        if (list.length === 0) {
            message = "Ga ada service yang lagi running cong!"
        }
        list.forEach(v => {
            message += `
            ${v.name}
            - id: ${v.pmId}
            - pid: ${v.pid}
            - status: ${v.status}
            - memory: ${v.memory / 1000000} MB
            - cpu: ${v.cpu}%
            - lifetime: ${v.lifetime}
            - restart: ${v.restart} \n
        `
        })
        bot.sendMessage(msg.chat.id, message, {parse_mode: "Markdown"})
            .then(() => console.log("[TELEGRAM BOT] Message sent..."))
            .catch(err => {
                console.error("[TELEGRAM BOT] Failed sent message:", err.message)
            })
    } catch (err) {
        console.error("[TELEGRAM BOT] Error:", err)
        bot.sendMessage(msg.chat.id, "Gagal cong, server lu koid kali")
            .then(() => console.log("[TELEGRAM BOT] Message sent..."))
            .catch(err => {
                console.error("[TELEGRAM BOT] Failed sent message:", err.message)
            })
    }
})

app.listen(port, () => {
    console.log(`[APP] Server started on port ${port}`)
})
