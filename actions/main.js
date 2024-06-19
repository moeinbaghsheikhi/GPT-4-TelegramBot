const { Telegraf, Markup } = require('telegraf')

const axios = require('axios')
const dbAction = require("./dbAction")

const mainKeyboardMenu = async (ctx) => {
    const chat = ctx.chat

    // register User
    const register = await dbAction.registerUser(chat.id, chat.first_name)

    // send Menu
    ctx.reply("خوش اومدی به ربات چت بات!",
        Markup.inlineKeyboard([
            [ 
                Markup.button.callback('3.5 Turbo', 'Turbo'), Markup.button.callback('GPT 4', 'GPT4')
            ],
            [
                Markup.button.callback('Microsoft copilot', 'copilot')
            ],
            [
                Markup.button.callback('خرید اشتراک 🚀', 'vip_plans')
            ]
        ])
    )
}

const proccessRequest = async (ctx, request_url, action, tones = false) => {
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
}

module.exports = { mainKeyboardMenu, proccessRequest }