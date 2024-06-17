const knex = require('./../config/db')

const registerUser = async (chatId, name) => {
    const hasUser = await knex("users").where({ chat_id: chatId }).first()

    if(!hasUser) await knex("users").insert({ chat_id: chatId, name })
}

const incrRequestFree = async (chatId) => {
    const user = await knex("users").where({ chat_id: chatId }).first()
    
    if(user) await knex("users").update({ request_free: ++user.request_free }).where({chat_id : chatId })
}

const getRequestFree = async (chatId) => {
    const user = await knex("users").where({ chat_id: chatId }).first()

    return user?.request_free
}

module.exports = { registerUser , incrRequestFree, getRequestFree }