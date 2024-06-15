const { Telegraf, Markup } = require('telegraf')

const dbAction = require('./dbAction')

const mainKeyboardMenu = (ctx) => {
    const chat = ctx.chat

    // register User
    dbAction.registerUser(chat.id, chat.first_name)

    // send Menu
    ctx.reply("خوش اومدی به ربات چت بات!",
        Markup.inlineKeyboard([
            [ 
                Markup.button.callback('3.5 Turbo', 'Turbo'), Markup.button.callback('GPT 4', 'GPT4')
            ],
            [
                Markup.button.callback('Microsoft copilot', 'copilot')
            ]
        ])
    )
}

module.exports = { mainKeyboardMenu }