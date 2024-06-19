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

const checkVipAccess = async (user_id) => {
    const timenow = Math.floor(Date.now() / 1000)

    const getVIP = await knex("orders").whereRaw(`(started_at <= ${timenow} AND ended_at >= ${timenow}) AND plan = 'vip'`).first()
    
    return getVIP
}

const checkOtherPlan = async (user_id, action) => {
    const timenow = Math.floor(Date.now() / 1000)

    const getPlan = await knex("orders").whereRaw(`(started_at <= ${timenow} AND ended_at >= ${timenow}) AND plan = '${action}'`).first()
    
    return getPlan
}

module.exports = { registerUser , incrRequestFree, getRequestFree, checkVipAccess, checkOtherPlan }