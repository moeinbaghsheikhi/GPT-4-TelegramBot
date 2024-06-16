const { Telegraf, Markup } = require('telegraf')

// config
const token = "7236215598:AAHiMnspxnk2ead1RcHHPvGyQ-BMhlTeG68";
const api_token = "277542:65be30c3eb3ce"
const apiUrl = `https://one-api.ir/chatgpt/?token=${api_token}`

const bot = new Telegraf(token)

// load Actions
const actions = require('./actions/main')
const dbActions = require('./actions/dbAction')

// packages
const axios = require('axios')
const redis = require('redis')
const client = redis.createClient();
client.connect();

bot.start((ctx) => actions.mainKeyboardMenu(ctx, dbActions))

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
    actions.mainKeyboardMenu(ctx)

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
        const requestFreeCount = await dbActions.getRequestFree(chatId)

        if(requestFreeCount >= 5) {
            ctx.reply("ظرفیت استفاده رایگان شما به اتمام رسیده ⛔",  Markup.removeKeyboard())
        } 
        else {
            actions.proccessRequest(ctx, request_url, action, tones)
        
            // incr request_free
            dbActions.incrRequestFree(chatId)
        }
    }
    else actions.mainKeyboardMenu(ctx)
})

bot.launch();