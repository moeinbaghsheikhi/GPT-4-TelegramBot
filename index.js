const { Telegraf, Markup } = require('telegraf')
const bot = new Telegraf("7236215598:AAHiMnspxnk2ead1RcHHPvGyQ-BMhlTeG68")

bot.start((ctx) => {
    ctx.reply("Welcome to GPT-4!",
        Markup.keyboard([
            Markup.button.callback('help')
        ])
    )
})

bot.launch();