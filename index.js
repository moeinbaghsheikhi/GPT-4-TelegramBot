const { Telegraf } = require('telegraf')
const bot = new Telegraf("7236215598:AAHiMnspxnk2ead1RcHHPvGyQ-BMhlTeG68")

bot.start((ctx) => {
    console.log(ctx)
    ctx.reply("Welcome to GPT-4!")
})

bot.launch();