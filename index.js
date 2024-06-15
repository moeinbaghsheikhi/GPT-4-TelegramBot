const { Telegraf, Markup } = require('telegraf')

// config
const token = "7255987246:AAG45qe0oPXgfqVkeQsRZiaIyZNsidroD04";
const api_token = "277542:65be30c3eb3ce"
const apiUrl = `https://one-api.ir/chatgpt/?token=${api_token}`

const bot = new Telegraf(token)

// load Actions
const actions = require('./actions/main')

// packages
const axios = require('axios')
const redis = require('redis')
const client = redis.createClient();
client.connect();

bot.start((ctx) => actions.mainKeyboardMenu(ctx))

// send Actions
bot.action("Turbo", (ctx) => {
    client.set(`user:${ctx.chat.id}:action`, "gpt3.5-turbo")

    ctx.editMessageText("سلام چه کمکی میتونم بهتون بکنم؟")
})

bot.action("GPT4", (ctx) => {
    client.set(`user:${ctx.chat.id}:action`, "gpt4o")

    ctx.editMessageText("حالا حالت پاسخ دهی رو انتخاب کن:" , 
        Markup.inlineKeyboard([
            [
                Markup.button.callback('نرمال', 'balanced')
            ],
            [ 
                Markup.button.callback('خلاقانه', 'creative'), Markup.button.callback('دقیق', 'precise')
            ]
        ]))
})

bot.action("copilot", (ctx) => {
    client.set(`user:${ctx.chat.id}:action`, "copilot")

    ctx.editMessageText("حالا حالت پاسخ دهی رو انتخاب کن:" , 
        Markup.inlineKeyboard([
            [
                Markup.button.callback('نرمال', 'balanced')
            ],
            [ 
                Markup.button.callback('خلاقانه', 'creative'), Markup.button.callback('دقیق', 'precise')
            ]
        ]))
})

// send Tones
bot.action("balanced", (ctx) => {
    client.set(`user:${ctx.chat.id}:tones`, "balanced")

    ctx.editMessageText("سلام چه کمکی میتونم بهتون بکنم؟")
})

bot.action("creative", (ctx) => {
    client.set(`user:${ctx.chat.id}:tones`, "creative")

    ctx.editMessageText("سلام چه کمکی میتونم بهتون بکنم؟")
})

bot.action("precise", (ctx) => {
    client.set(`user:${ctx.chat.id}:tones`, "precise")

    ctx.editMessageText("سلام چه کمکی میتونم بهتون بکنم؟")
})

bot.hears("ادامه", (ctx) => {
    ctx.reply("دیگه چه کمکی میتونم بهت بکنم؟", Markup.removeKeyboard())
})

bot.hears("اتمام چت", (ctx) => {
    const chatId   = ctx.chat.id

    // end chat
    ctx.reply("مکالمه به پایان رسید⛔", Markup.removeKeyboard())

    // send home menu
    actions.mainKeyboardMenu

    client.del(`user:${chatId}:action`)
    client.del(`user:${chatId}:tones`)
})

bot.on("text", async (ctx) => {
    const chatId   = ctx.chat.id
    const userText = ctx.text

    const action   = await client.get(`user:${chatId}:action`)
    const tones    = await client.get(`user:${chatId}:tones`)
    const request_url = `${apiUrl}&action=${action}&q=` + encodeURIComponent(userText)
    
    // send response

    if(action) {
        // send loading
        ctx.reply("درخواست شما درحال پردازش است لظفا چند لحظه صبر کنید 🔃")

        if(action == "gpt3.5-turbo"){
            const ressponse = await axios.get(request_url)
    
            ctx.reply(ressponse.data.result[0])
        } 
        else if(action == "gpt4o"){
            const ressponse = await axios.get(request_url + `&tones=${tones}`)
    
            ctx.reply(ressponse.data.result[0])
        } 
        else if(action == "copilot") {
            const ressponse = await axios.get(request_url + `&tones=${tones}`)
    
            ctx.reply(ressponse.data.result[0].message)
        }
    
        // send next step
        ctx.reply("درخواست شما با موفقیت پردازش شد✅" , 
        Markup.keyboard([
            [ 
                Markup.button.callback("اتمام چت"), Markup.button.callback("ادامه")
            ]
        ]))
    } else actions.mainKeyboardMenu
})

bot.launch();